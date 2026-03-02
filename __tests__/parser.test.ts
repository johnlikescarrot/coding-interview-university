import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { parseCurriculum, parseLanguageResources, getResourceType, extractText } from '../lib/parser';

vi.mock('fs');

describe('Parser Logic Extreme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle ID collisions and deduplicate resources', () => {
    const mockMd = '## Section\n### Topic\n- [Link](url)\n- [Link](url)\n### Topic\n- [Link](url2)';
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);

    const sections = parseCurriculum('x.md');
    expect(sections[0].topics[0].id).toBe('topic');
    expect(sections[0].topics[1].id).toBe('topic-2');
    expect(sections[0].topics[0].resources).toHaveLength(1);
  });

  it('should handle edge case resource types and extract text correctly', () => {
    expect(getResourceType('https://labex.io/test')).toBe('interactive');
    expect(getResourceType('https://other.com')).toBe('article');
    expect(extractText({ type: 'text', value: 'Hello' })).toBe('Hello');
    expect(extractText({ type: 'parent', children: [{ type: 'text', value: 'A' }, { type: 'text', value: 'B' }] })).toBe('AB');
  });

  it('should handle missing files and errors gracefully', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(parseCurriculum('miss.md')).toEqual([]);
    expect(parseLanguageResources('miss.md')).toEqual({});

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error('fail'); });
    expect(parseCurriculum('fail.md')).toEqual([]);
    expect(parseLanguageResources('fail.md')).toEqual({});
  });

  it('should parse language resources correctly', () => {
    const mockMd = '- Python\n  - [P1](u1)\n- JS\n  - [J1](u2)\n- Empty\n- Python\n  - [P1](u1)';
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mockMd);

    const res = parseLanguageResources('l.md');
    expect(res['Python']).toHaveLength(1);
    expect(res['JS']).toHaveLength(1);
  });
});
