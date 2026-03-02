import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false initially (during SSR state)', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(typeof result.current).toBe('boolean');
  });

  it('should update when media query changes', () => {
    let changeHandler: any;

    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') changeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    act(() => {
      if (changeHandler) changeHandler({ matches: true });
    });
  });
});
