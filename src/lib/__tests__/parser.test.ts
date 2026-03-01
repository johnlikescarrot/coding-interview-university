/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { getCurriculum } from '../parser';
import fs from 'fs';

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
}));

describe('parser', () => {
  it('parses a basic markdown file correctly', () => {
    const mockMd = '# Section 1\n- [ ] Item 1\n- [x] Item 2\n## Subsection 1\n- [ ] Item 3';
    (fs.readFileSync as any).mockReturnValue(mockMd);
    (fs.existsSync as any).mockReturnValue(true);

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
    (fs.existsSync as any).mockReturnValue(true);
    const result = getCurriculum('en');
    expect(result).toHaveLength(0);
  });

  it('correctly handles checkbox states in parsing', () => {
    const mockMd = '# Section\n- [ ] unchecked\n- [x] checked';
    (fs.readFileSync as any).mockReturnValue(mockMd);
    (fs.existsSync as any).mockReturnValue(true);
    const result = getCurriculum('en');
    expect(result[0].checkboxes![0].completed).toBe(false);
    expect(result[0].checkboxes![1].completed).toBe(true);
  });
});
