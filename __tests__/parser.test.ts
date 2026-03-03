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
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    });

    it('should return empty array and log error when readFileSync throws', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('failure'); });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(parseCurriculum('error.md')).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should correctly parse sections, topics, and handle ID collisions (foo, foo-1)', () => {
      const mockMd = `
## Section A
- ### Topic A
    - [T1](http://u1.com)
- ### Topic A
    - [T2](http://u2.com)
- ### C#
    - [T3](http://u3.com)
- ### C#
    - [T4](http://u4.com)
- ### Topic With Brackets
    - [T5](<https://bracketed.com>)
- ### Topic With Fragment
    - [T6](https://docs.example.com/page#intro)
`;
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('curriculum.md');
      const topics = result[0].topics;

      expect(topics).toHaveLength(6);
      expect(topics[0].id).toBe('topic-a');
      expect(topics[1].id).toBe('topic-a-1');
      expect(topics[2].title).toBe('C#');
      expect(topics[2].id).toBe('c');
      expect(topics[3].id).toBe('c-1');
      expect(topics[4].resources[0].url).toBe('https://bracketed.com');
      expect(topics[5].resources[0].url).toBe('https://docs.example.com/page#intro');
    });

    it('should handle duplicate SECTION titles by appending counters', () => {
      const mockMd = `
## Section A
- [L1](http://u1.com)
## Section A
- [L2](http://u2.com)
`;
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('sections.md');
      expect(result).toHaveLength(2);
      expect(result[0].topics[0].id).toBe('section-a');
      expect(result[1].topics[0].id).toBe('section-a-1');
    });

    it('should exclude Table of Contents and other boilerplate headers', () => {
      const mockMd = `
## Table of Contents
## LICENSE
## ---
## Section Valid
- [L](http://u.com)
`;
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('excluded.md');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Section Valid');
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
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
    });

    it('should return {} and log error when readFileSync throws', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('failure'); });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(parseLanguageResources('e.md')).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle links, angle brackets, and non-indented headers', () => {
      const mockMd = `
- Python
  - [Safe](https://python.org)
  - [Bracketed](<https://python.org/libs>)
  - [Malicious](javascript:alert(1))
  - Indented bullet which is NOT a language:
    - [Nested](https://nested.com)
- JavaScript
  - [L1](http://js.org)
`;
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseLanguageResources('lang.md');
      expect(result['Python']).toHaveLength(3);
      expect(result['Python'][1].url).toBe('https://python.org/libs');
      expect(result['Indented bullet which is NOT a language:']).toBeUndefined();
      expect(result['JavaScript']).toBeDefined();
    });
  });

  describe('flattenTopics', () => {
    it('should correctly flatten sections into topics', () => {
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
