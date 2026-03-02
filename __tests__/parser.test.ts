import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { parseCurriculum, parseLanguageResources, extractText } from '../lib/parser';

vi.mock('fs');

describe('Parser logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('extractText', () => {
      it('should return empty string for empty node', () => {
          expect(extractText({})).toBe('');
      });
      it('should join children text', () => {
          expect(extractText({ children: [{ value: 'a' }, { children: [{ value: 'b' }] }] })).toBe('ab');
      });
  });

  describe('parseCurriculum', () => {
    it('should return empty array if file does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = parseCurriculum('nonexistent.md');
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('File not found'));

      consoleSpy.mockRestore();
    });

    it('should return empty array and log error on exception', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Read error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = parseCurriculum('error.md');
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to parse curriculum'), expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should parse curriculum sections and topics', () => {
      const mockMd = '## Section 1\n### Topic 1\n- [Link](url)';
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('dummy.md');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Section 1');
      expect(result[0].topics).toHaveLength(1);
      expect(result[0].topics[0].title).toBe('Topic 1');
    });

    it('should handle complex branch coverage for headings and lists', () => {
        const mockMd = '### Orphan\n## S1\n### \n### T1\n- [L1](u1)\n- [L1](u1)\n- [ ](u2)\n- Plain';
        vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);
        const result = parseCurriculum('dummy.md');
        expect(result).toHaveLength(1);
        expect(result[0].topics).toHaveLength(2);
        expect(result[0].topics[0].id).toBe('heading');
        expect(result[0].topics[1].resources).toHaveLength(2);
        expect(result[0].topics[1].resources[1].title).toBe(' ');
    });

    it('should handle ID collisions', () => {
        const mockMd = '## S1\n### T\n## S2\n### T';
        vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);
        const result = parseCurriculum('dummy.md');
        expect(result[1].topics[0].id).toBe('t-2');
    });

    it('should cover all resource types', () => {
        const mockMd = '## S1\n### T1\n- [Y](https://youtube.com/watch?v=1)\n- [Y2](https://youtu.be/1)\n- [V](https://vimeo.com/1)\n- [B](https://books.google.com)\n- [O](https://oreilly.com)\n- [L](https://labex.io/1)\n- [E](https://exercism.org/1)\n- [C](https://codewars.com/1)\n- [LC](https://leetcode.com/1)\n- [A](https://amazon.com/1)';
        vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);
        const result = parseCurriculum('dummy.md');
        const res = result[0].topics[0].resources;
        expect(res[0].type).toBe('video');
        expect(res[1].type).toBe('video');
        expect(res[2].type).toBe('video');
        expect(res[3].type).toBe('book');
        expect(res[4].type).toBe('book');
        expect(res[5].type).toBe('interactive');
        expect(res[6].type).toBe('interactive');
        expect(res[7].type).toBe('interactive');
        expect(res[8].type).toBe('interactive');
        expect(res[9].type).toBe('book');
    });

    it('should handle empty link text and fallback to paragraph title', () => {
        const mockMd = '## S1\n### T1\n- [](url)';
        vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
        vi.spyOn(fs, 'existsSync').mockReturnValue(true);
        const result = parseCurriculum('dummy.md');
        expect(result[0].topics[0].resources[0].title).toBe('');
    });
  });

  describe('parseLanguageResources', () => {
    it('should return empty object if file does not exist', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = parseLanguageResources('nonexistent-lang.md');
      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Language resources file not found'));

      consoleSpy.mockRestore();
    });

    it('should return empty object and log error on exception', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Read error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = parseLanguageResources('error-lang.md');
      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to parse language resources'), expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should parse language resources correctly', () => {
      const mockMd = '- [Orphan](u)\n- Python\n  - [Link](http://py.com)\n  - [Link](http://py.com)\n- \n- C++\n  - [Video](https://youtube.com/watch?v=cpp)';
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseLanguageResources('lang.md');
      expect(result['Python']).toHaveLength(1);
      expect(result['C++']).toHaveLength(1);
    });
  });
});
