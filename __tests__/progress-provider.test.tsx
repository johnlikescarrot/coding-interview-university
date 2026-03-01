import { renderHook, act } from '@testing-library/react';
import { ProgressProvider, useProgress } from '@/components/progress-provider';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ProgressProvider>{children}</ProgressProvider>
);

describe('ProgressProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should hydrate from localStorage on mount', () => {
    localStorage.setItem('ciu-progress', JSON.stringify(['existing-id']));
    const { result } = renderHook(() => useProgress(), { wrapper });
    expect(result.current.completed).toContain('existing-id');
  });

  it('should persist to localStorage on toggle', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    act(() => {
      result.current.toggleTopic('new-topic');
    });
    expect(localStorage.getItem('ciu-progress')).toBe(JSON.stringify(['new-topic']));
  });

  it('should handle invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('ciu-progress', 'invalid-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useProgress(), { wrapper });
    expect(result.current.completed).toEqual([]);
    consoleSpy.mockRestore();
  });

  it('should handle localStorage write errors gracefully', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    act(() => {
      result.current.toggleTopic('fail-id');
    });

    expect(result.current.completed).toContain('fail-id');
    expect(consoleSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should throw when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useProgress())).toThrow(
      'useProgress must be used within ProgressProvider'
    );
    spy.mockRestore();
  });
});
