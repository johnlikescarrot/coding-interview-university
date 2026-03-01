import { cn } from './utils'
import { describe, it, expect } from 'vitest'

describe('cn utility', () => {
  it('merges tailwind classes', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
    expect(cn('p-4', { 'm-2': true, 'm-4': false })).toBe('p-4 m-2')
  })
})
