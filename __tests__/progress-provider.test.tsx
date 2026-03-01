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

  it('should manage topic completion', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.toggleTopic('test-id');
    });
    expect(result.current.completed).toEqual(['test-id']);

    act(() => {
      result.current.toggleTopic('test-id');
    });
    expect(result.current.completed).toEqual([]);
  });

  it('should update total topics', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    act(() => {
      result.current.setTotalTopics(100);
    });
    expect(result.current.totalTopics).toBe(100);
  });
});
