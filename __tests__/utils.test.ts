import { cn } from '@/lib/utils';
import { describe, it, expect } from 'vitest';

describe('cn utility', () => {
  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2', 'py-2')).toBe('px-2 py-2');
    const condition = false;
    expect(cn('px-2', condition && 'py-2')).toBe('px-2');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle complex conditional objects and arrays', () => {
    expect(cn('base', { active: true, hidden: false }, ['extra'])).toBe('base active extra');
    expect(cn(['a', 'b'], { c: true })).toBe('a b c');
  });

  it('should handle falsy values like null, undefined, and booleans', () => {
    expect(cn('base', null, undefined, false, true, '')).toBe('base');
  });

  it('should properly merge conflicting tailwind classes', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});
