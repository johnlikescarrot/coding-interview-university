import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { parseCurriculum, parseLanguageResources } from '../lib/parser';

vi.mock('fs');

describe('Parser logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array if file does not exist', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = parseCurriculum('nonexistent.md');
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('File not found'));

    consoleSpy.mockRestore();
  });

  it('should return empty array for content without sections', () => {
    const mockMd = '# Title\nSome paragraph without sections';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseCurriculum('dummy.md');
    expect(result).toEqual([]);
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

  it('should detect resource types correctly and deduplicate', () => {
    const mockMd = '## Section\n### Topic\n- [Video](https://youtube.com/watch?v=123)\n- [Link](https://youtube.com/watch?v=123)\n- [Book](https://amazon.com/dp/123)\n- [Interactive](https://exercism.org/tracks/python)\n- [Article](https://blog.com/post)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseCurriculum('dummy.md');
    const resources = result[0].topics[0].resources;
    expect(resources).toHaveLength(4); // Video/Link deduplicated
    expect(resources[0].type).toBe('video');
    expect(resources[1].type).toBe('book');
    expect(resources[2].type).toBe('interactive');
    expect(resources[3].type).toBe('article');
  });

  it('should handle ID collisions by appending a counter', () => {
    const mockMd = '## Section 1\n### Same Title\n- [L1](u1)\n## Section 2\n### Same Title\n- [L2](u2)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseCurriculum('dummy.md');
    expect(result[0].topics[0].id).toBe('same-title');
    expect(result[1].topics[0].id).toBe('same-title-2');
  });

  it('should parse language resources correctly and prevent duplicates', () => {
    const mockMd = '- Python\n  - [Link](http://py.com)\n  - [Link](http://py.com)\n- C++\n  - [Video](https://youtube.com/watch?v=cpp)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseLanguageResources('lang.md');
    expect(result['Python']).toHaveLength(1);
    expect(result['Python'][0]).toMatchObject({
      title: 'Link',
      url: 'http://py.com',
      type: 'article'
    });
    expect(result['C++'][0]).toMatchObject({
      title: 'Video',
      url: 'https://youtube.com/watch?v=cpp',
      type: 'video'
    });
  });

  it('should handle non-contiguous language resource blocks', () => {
    const mockMd = '- Python\n  - [P1](u1)\n- C++\n  - [C1](v1)\n- Python\n  - [P2](u2)';
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);

    const result = parseLanguageResources('lang.md');
    expect(result['Python']).toHaveLength(2);
    expect(result['Python'][0].title).toBe('P1');
    expect(result['Python'][1].title).toBe('P2');
    expect(result['C++']).toHaveLength(1);
  });
});
