import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { parseCurriculum, parseLanguageResources, getResourceType } from '../lib/parser.server';
import { flattenTopics } from '../lib/parser';
import { Section } from '../lib/types';

vi.mock('fs');

describe('Parser logic (Integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getResourceType', () => {
    it('should identify all types correctly', () => {
      expect(getResourceType('youtube.com/watch?v=123')).toBe('video');
      expect(getResourceType('youtu.be/123')).toBe('video');
      expect(getResourceType('vimeo.com/123')).toBe('video');
      expect(getResourceType('amazon.com/dp/123')).toBe('book');
      expect(getResourceType('books.google.com')).toBe('book');
      expect(getResourceType('oreilly.com/library')).toBe('book');
      expect(getResourceType('labex.io/tracks')).toBe('interactive');
      expect(getResourceType('exercism.org/tracks')).toBe('interactive');
      expect(getResourceType('codewars.com/kata')).toBe('interactive');
      expect(getResourceType('leetcode.com/problems')).toBe('interactive');
      expect(getResourceType('blog.com/article')).toBe('article');
    });
  });

  describe('parseCurriculum', () => {
    it('should return empty array and log warning when file not found', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(parseCurriculum('nonexistent.md')).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('file not found'));
    });

    it('should return empty array and log error on read failure', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('disk failure'); });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(parseCurriculum('error.md')).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should correctly parse sections, topics, and handle ID collisions', () => {
      const mockMd = `
# Title
Skip me.

## Section 1
Direct link in section.
- [S1 Link](http://u1.com)

- ### Topic A
    - [T1 Link](http://u2.com)
    - [T1 Duplicate Link](http://u2.com)
    - [Internal Anchor Link](#anchor)

- **Topic B**
    - [T2 Link](http://u3.com)

- ### Topic A
    - [T3 Link](http://u4.com)

## [Empty H2 Section]()

## LICENSE
[⬆ back to top](#)
`;
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('curriculum.md');

      // Verification: Section 1 should exist
      expect(result).toHaveLength(1);
      const s1 = result[0];
      expect(s1.title).toBe('Section 1');

      // Topic verification
      // 1. Overview (captures S1 Link)
      // 2. Topic A (captures T1 Link, dedupes T1 Duplicate, skips Anchor)
      // 3. Topic B (Bold topic)
      // 4. Topic A-1 (ID collision)
      expect(s1.topics).toHaveLength(4);

      expect(s1.topics[0].title).toBe('Overview');
      expect(s1.topics[0].resources).toHaveLength(1);

      expect(s1.topics[1].id).toBe('topic-a');
      expect(s1.topics[1].resources).toHaveLength(1);

      expect(s1.topics[2].title).toBe('Topic B');

      expect(s1.topics[3].id).toBe('topic-a-1');
      expect(s1.topics[3].title).toBe('Topic A');
    });

    it('should handle Unicode titles for slugification', () => {
      const mockMd = "## 数据结构\n- [Link](http://u1.com)";
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('unicode.md');
      expect(result[0].topics[0].id).toBe('数据结构');
    });
  });

  describe('parseLanguageResources', () => {
    it('should return {} and log warning when file not found', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(parseLanguageResources('n.md')).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('file not found'));
    });

    it('should return {} and log error on read failure', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('disk failure'); });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(parseLanguageResources('error.md')).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle links and ignore non-http protocols (XSS safety)', () => {
      const mockMd = `
- Python
  - [Safe](http://python.org)
  - [Malicious](javascript:alert(1))
- JavaScript
  - [L1](http://js.org)
`;
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseLanguageResources('lang.md');
      expect(result['Python']).toHaveLength(1);
      expect(result['Python'][0].title).toBe('Safe');
      expect(result['JavaScript']).toHaveLength(1);
    });
  });

  describe('flattenTopics', () => {
    it('should correctly flatten sections into topics with full coverage', () => {
      const sections: Section[] = [
        {
          title: 'S1',
          topics: [
            { title: 'T1', id: 't1', completed: false, resources: [] },
            { title: 'T2', id: 't2', completed: false, resources: [] }
          ]
        }
      ];
      const flattened = flattenTopics(sections);
      expect(flattened).toEqual([
        { title: 'T1', id: 't1', section: 'S1' },
        { title: 'T2', id: 't2', section: 'S1' }
      ]);
    });
  });
});
