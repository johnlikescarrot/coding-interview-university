/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurriculum } from '../parser';
import fs from 'fs';

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(),
  },
}));

describe('parser', () => {
  it('parses a basic markdown file correctly', () => {
    const mockMd = '# Section 1\n- [ ] Item 1\n- [x] Item 2\n## Subsection 1\n- [ ] Item 3';
    (fs.readFileSync as any).mockReturnValue(mockMd);

    const result = getCurriculum('en');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Section 1');
    expect(result[0].subtopics).toHaveLength(1);
    expect(result[0].subtopics[0].title).toBe('Subsection 1');
    expect(result[0].checkboxes).toHaveLength(2);
  });

  it('handles invalid language by returning empty array', () => {
    const result = getCurriculum('invalid-lang');
    expect(result).toEqual([]);
  });

  it('handles files with no sections', () => {
    (fs.readFileSync as any).mockReturnValue('Just some text without headers');
    const result = getCurriculum('en');
    expect(result).toHaveLength(0);
  });

  it('correctly handles checkbox states in parsing', () => {
    const mockMd = '# Section\n- [ ] unchecked\n- [x] checked';
    (fs.readFileSync as any).mockReturnValue(mockMd);
    const result = getCurriculum('en');
    expect(result[0].checkboxes![0].completed).toBe(false);
    expect(result[0].checkboxes![1].completed).toBe(true);
  });
});

describe('curriculum-logic refinements', () => {
  it('deduplicates IDs correctly', () => {
    const mockMd = '# Duplicate\n## Duplicate\n# Duplicate';
    (fs.readFileSync as any).mockReturnValue(mockMd);
    const result = getCurriculum('en');
    expect(result[0].id).toBe('duplicate');
    expect(result[0].subtopics[0].id).toBe('duplicate-1');
    expect(result[1].id).toBe('duplicate-2');
  });

  it('handles indented ATX headings', () => {
    const mockMd = '  # Indented';
    (fs.readFileSync as any).mockReturnValue(mockMd);
    const result = getCurriculum('en');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Indented');
  });

  it('normalizes CRLF and strips BOM', () => {
    const mockMd = '\uFEFF# BOM\r\n## CRLF';
    (fs.readFileSync as any).mockReturnValue(mockMd);
    const result = getCurriculum('en');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('BOM');
    expect(result[0].subtopics[0].title).toBe('CRLF');
  });

  it('attaches to nearest ancestor on skipped levels', () => {
    const mockMd = '# Root\n### Skipped Level 2';
    (fs.readFileSync as any).mockReturnValue(mockMd);
    const result = getCurriculum('en');
    expect(result[0].subtopics).toHaveLength(1);
    expect(result[0].subtopics[0].title).toBe('Skipped Level 2');
  });
});
