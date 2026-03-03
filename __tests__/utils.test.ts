import { cn } from '@/lib/utils';
import { describe, it, expect } from 'vitest';

describe('cn utility', () => {
  it('should merge tailwind classes correctly', () => {
    expect(cn('px-2', 'py-2')).toBe('px-2 py-2');
    const condition = false;
    expect(cn('px-2', condition && 'py-2')).toBe('px-2');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });
});
