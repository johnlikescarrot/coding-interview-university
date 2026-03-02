import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { parseCurriculum, parseLanguageResources, getResourceType, extractText } from '../lib/parser';

vi.mock('fs');

describe('Parser Logic Extreme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should cover all code paths', () => {
    // Collision loop, skip paragraph, dedupe, multiple depths
    const mock = '## S\n### T\n- [L](u)\n### T\n- NoLink\n- [L](u)\n- [L2](v)\n#### H4';
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mock);

    const s = parseCurriculum('x.md');
    expect(s[0].topics[0].id).toBe('t');
    expect(s[0].topics[1].id).toBe('t-1');
    expect(s[0].topics[0].resources).toHaveLength(1);

    expect(getResourceType('https://youtube.com')).toBe('video');
    expect(getResourceType('https://amazon.com')).toBe('book');
    expect(getResourceType('https://exercism.org')).toBe('interactive');
    expect(extractText({ type: 'text', value: 'v' })).toBe('v');
    expect(extractText({ type: 'p', children: [{ type: 't', value: 'c' }] })).toBe('c');
    expect(extractText({ type: 'e' })).toBe('');
  });

  it('should handle catastrophic failures and missing files', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    expect(parseCurriculum('m')).toEqual([]);
    expect(parseLanguageResources('m')).toEqual({});

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => { throw new Error(); });
    expect(parseCurriculum('f')).toEqual([]);
    expect(parseLanguageResources('f')).toEqual({});
  });

  it('should handle language resources accurately', () => {
    const mock = '- L1\n  - [T](u)\n  - [T](u)\n- \n- L2\n- L1\n  - [T](v)';
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(mock);
    const r = parseLanguageResources('l.md');
    expect(r['L1']).toHaveLength(2); // (T,u) and (T,v) are different URLs
    expect(r['L2']).toHaveLength(0);
  });
});
