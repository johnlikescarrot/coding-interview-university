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

      const result = parseCurriculum('dummy.md');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Section 1');
      expect(result[0].topics[0].title).toBe('Topic 1');
      expect(result[0].topics[0].resources[0].url).toBe('http://test.com');
    });

    it('should handle complex markdown structures', () => {
        const mockMd = '# Main Title\n## Section 1\nSome text\n### Topic 1\nMore text\n- List Item\n- [Link](url)';
        vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
        const result = parseCurriculum('dummy.md');
        expect(result[0].topics[0].resources).toHaveLength(1);
    });
  });

  describe('parseLanguageResources', () => {
    it('should parse language sections correctly', () => {
      const mockMd = '- Python\n  - [Link](http://py.com)\n- C++\n  - [Book](url)';
      vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);

      const result = parseLanguageResources('dummy.md');
      expect(result['Python']).toHaveLength(1);
      expect(result['C++']).toHaveLength(1);
    });
  });
});
