import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { parseCurriculum, parseLanguageResources, getResourceType } from '../lib/parser.server';
import { flattenTopics } from '../lib/parser';

vi.mock('fs');

describe('Parser logic (Integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getResourceType', () => {
    it('should identify all types', () => {
      expect(getResourceType('youtube.com')).toBe('video');
      expect(getResourceType('youtu.be')).toBe('video');
      expect(getResourceType('vimeo.com')).toBe('video');
      expect(getResourceType('amazon.com')).toBe('book');
      expect(getResourceType('books.google')).toBe('book');
      expect(getResourceType('oreilly.com')).toBe('book');
      expect(getResourceType('labex.io')).toBe('interactive');
      expect(getResourceType('exercism.org')).toBe('interactive');
      expect(getResourceType('codewars.com')).toBe('interactive');
      expect(getResourceType('leetcode.com')).toBe('interactive');
      expect(getResourceType('other.com')).toBe('article');
    });
  });

  describe('parseCurriculum', () => {
    it('should handle file not found', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(parseCurriculum('n.md')).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle errors', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('e'); });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(parseCurriculum('e.md')).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should hit all branches and correctly parse content', () => {
      const mockMd = `
# CIU
Skip me.

## Why use it?
Intro text.

## Section 1
- ### Topic 1
    - [Link 1](http://vimeo.com/123)
    - [Link 1 Duplicate](http://vimeo.com/123)
    - [Internal Link](#anchor)

- ### Topic 1
    - [Link 2](http://blog.com)

## Section 2
- [Link 3](http://exercism.org)

## [Empty H2]()
## LICENSE
[⬆ back to top](#)
---
Separator

## Section 3
### Topic with [Markdown Link](http://u.com) and *Bold*
- [Link](http://u2.com)
###
- [Empty H3 Link](http://u3.com)

## Section 4
### Duplicate ID
- [L1](http://u1.com)
### Duplicate ID
- [L2](http://u2.com)
`;
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('chaos.md');
      expect(result).toHaveLength(4);
      // Verify ID collision handling
      const s4 = result.find(s => s.title === 'Section 4');
      expect(s4?.topics[0].id).toBe('duplicate-id');
      expect(s4?.topics[1].id).toBe('duplicate-id-2');
    });
  });

  describe('parseLanguageResources', () => {
    it('should handle file not found and errors', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(parseLanguageResources('n.md')).toEqual({});

      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('e'); });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(parseLanguageResources('e.md')).toEqual({});
    });

    it('should hit all branches', () => {
      const mockMd = `
- [Link before lang](http://u1.com)
- Python
  - [L1](http://u2.com)
  - [L1 Duplicate](http://u2.com)
- Java [Bracketed]
- JavaScript
- Python
  - [L2](http://u3.com)
`;
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseLanguageResources('lang.md');
      expect(result['Python']).toHaveLength(2);
      expect(result['JavaScript']).toHaveLength(0);
      expect(result['Java [Bracketed]']).toBeUndefined();
    });
  });

  describe('flattenTopics', () => {
    it('should correctly flatten sections into topics', () => {
      const sections = [
        {
          title: 'S1',
          topics: [
            { title: 'T1', id: 't1', completed: false, resources: [] },
            { title: 'T2', id: 't2', completed: false, resources: [] }
          ]
        }
      ];
      const flattened = flattenTopics(sections as any);
      expect(flattened).toHaveLength(2);
      expect(flattened[0]).toEqual({ title: 'T1', id: 't1', section: 'S1' });
    });
  });
});
