import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { parseCurriculum, parseLanguageResources } from '../lib/parser';

vi.mock('fs');

describe('Parser logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('should handle formatted headings correctly', () => {
    const mockMd = '## Section **Bold**\n### Topic *Italic*';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseCurriculum('dummy.md');
    expect(result[0].title).toBe('Section Bold');
    expect(result[0].topics[0].title).toBe('Topic Italic');
  });

  it('should detect video resources correctly', () => {
    const mockMd = '## Section\n### Topic\n- [Video](https://youtube.com/watch?v=123)\n- [Article](https://blog.com/post)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseCurriculum('dummy.md');
    expect(result[0].topics[0].resources[0].type).toBe('video');
    expect(result[0].topics[0].resources[1].type).toBe('article');
  });

  it('should handle ID collisions by appending a counter', () => {
    const mockMd = '## Section 1\n### Same Title\n- [L1](u1)\n## Section 2\n### Same Title\n- [L2](u2)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseCurriculum('dummy.md');
    expect(result[0].topics[0].id).toBe('same-title');
    expect(result[1].topics[0].id).toBe('same-title-2');
  });

  it('should handle missing files gracefully', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = parseCurriculum('missing.md');
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('File not found'));

    consoleSpy.mockRestore();
  });

  it('should parse language resources', () => {
    const mockMd = '- Python\n  - [Link](http://py.com)\n- C++\n  - [Link](http://cpp.com)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseLanguageResources('lang.md');
    expect(result['Python']).toBeDefined();
    expect(result['Python'][0]).toMatchObject({
      title: 'Link',
      url: 'http://py.com',
      type: 'article'
    });
    expect(result['C++']).toHaveLength(1);
  });
});
