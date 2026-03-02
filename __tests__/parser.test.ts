import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { parseCurriculum, parseLanguageResources, getResourceType, extractText } from '../lib/parser';

vi.mock('fs');

describe('Parser Logic Extreme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should cover all code paths', () => {
    const mock = '## S\n### T\n- [L](u)\n### T\n- NoLink\n- [L](u)\n- [L2](v)';
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mock);

    const s = parseCurriculum('x.md');
    expect(s[0].topics[0].id).toBe('t');
    expect(s[0].topics[1].id).toBe('t-1');

    expect(getResourceType('https://youtube.com')).toBe('video');
    expect(getResourceType('https://oreilly.com')).toBe('book');
    expect(getResourceType('https://exercism.org')).toBe('interactive');
    expect(getResourceType('https://medium.com/test')).toBe('article');
    expect(getResourceType('unknown')).toBe('other');

    expect(extractText({ type: 'text', value: 'v' })).toBe('v');
    expect(extractText({ type: 'p', children: [{ type: 't', value: 'c' }] })).toBe('c');
    expect(extractText({ type: 'empty' })).toBe('');
  });

  it('should handle catastrophic failures', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(parseCurriculum('m')).toEqual([]);
    expect(parseLanguageResources('m')).toEqual({});

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error(); });
    expect(parseCurriculum('f')).toEqual([]);
    expect(parseLanguageResources('f')).toEqual({});
  });

  it('should handle language resources accurately', () => {
    const mock = '- L1\n  - [T1](u)\n  - [T1](u)\n- L2\n- L1\n  - [T2](v)\n- [NoLang](v)';
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mock);
    const res = parseLanguageResources('l.md');
    expect(res['L1']).toHaveLength(2);
    expect(res['L2']).toHaveLength(0);
  });
});
