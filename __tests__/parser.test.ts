import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseCurriculum, parseLanguageResources } from '@/lib/parser';
import fs from 'fs';

vi.mock('fs');

describe('Parser Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('parseCurriculum', () => {
    it('should parse sections and topics correctly', () => {
      const mockMd = '## Section 1\n### Topic 1\n- [Link](http://test.com)';
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('dummy.md');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Section 1');
      expect(result[0].topics[0].title).toBe('Topic 1');
      expect(result[0].topics[0].resources[0].url).toBe('http://test.com');
    });

    it('should detect video types correctly', () => {
      const mockMd = '## Section\n### Topic\n- [Youtube](https://youtube.com/v1)\n- [Vimeo](https://vimeo.com/v2)\n- [Article](https://blog.com)';
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseCurriculum('dummy.md');
      const res = result[0].topics[0].resources;
      expect(res[0].type).toBe('video');
      expect(res[1].type).toBe('video');
      expect(res[2].type).toBe('article');
    });

    it('should handle missing files gracefully', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const result = parseCurriculum('nonexistent.md');
      expect(result).toEqual([]);
    });

    it('should handle read error', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('fail'); });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = parseCurriculum('fail.md');
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('parseLanguageResources', () => {
    it('should parse language sections correctly', () => {
      const mockMd = '- Python\n  - [Link](http://py.com)\n- C++\n  - [Video](https://vimeo.com/v1)';
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);

      const result = parseLanguageResources('dummy.md');
      expect(result['Python'][0].type).toBe('article');
      expect(result['C++'][0].type).toBe('video');
    });

    it('should handle missing file in language parser', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const result = parseLanguageResources('none.md');
      expect(result).toEqual({});
    });

    it('should handle read error in language parser', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('fail'); });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = parseLanguageResources('fail.md');
      expect(result).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
