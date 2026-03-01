import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from './use-mobile'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('useIsMobile', () => {
  let onChangeCallback: any;

  beforeEach(() => {
    onChangeCallback = null;
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((event, cb) => {
          if (event === 'change') onChangeCallback = cb;
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('reacts to window resize via matchMedia', () => {
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)

    // Simulate change to mobile
    act(() => {
        Object.defineProperty(window, 'innerWidth', { value: 500 })
        if (onChangeCallback) onChangeCallback()
    })

    expect(result.current).toBe(true)
  })
})
