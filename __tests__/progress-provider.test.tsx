import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor, renderHook } from '@testing-library/react';
import { ProgressProvider, useProgress } from '../components/progress-provider';
import * as React from 'react';

const TestComponent = () => {
  const { completed, toggleTopic, isPending } = useProgress();
  return (
    <div>
      <div data-slot="completed-count">{completed.length}</div>
      <div data-slot="pending-status">{isPending ? 'pending' : 'idle'}</div>
      <button type="button" onClick={() => toggleTopic('test-id')}>Toggle</button>
    </div>
  );
};

describe('ProgressProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide progress state and toggle function', async () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    expect(screen.getByDataSlot('completed-count').textContent).toBe('0');

    const button = screen.getByRole('button');
    await act(async () => {
      button.click();
    });

    expect(screen.getByDataSlot('completed-count').textContent).toBe('1');

    await waitFor(() => {
        expect(JSON.parse(localStorage.getItem('ciu-progress') || '[]')).toContain('test-id');
    });

    await act(async () => {
      button.click();
    });
    expect(screen.getByDataSlot('completed-count').textContent).toBe('0');
  });

  it('should hydrate from localStorage on mount', async () => {
    localStorage.setItem('ciu-progress', JSON.stringify(['stored-id']));

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    await waitFor(() => {
        expect(screen.getByDataSlot('completed-count').textContent).toBe('1');
    });
  });

  it('handles malformed localStorage JSON gracefully', async () => {
    localStorage.setItem('ciu-progress', 'invalid-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    await waitFor(() => {
        expect(screen.getByDataSlot('completed-count').textContent).toBe('0');
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles non-array localStorage data', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem('ciu-progress', JSON.stringify({ invalid: 'object' }));

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("Invalid progress data in localStorage");
    });
    consoleSpy.mockRestore();
  });

  it('handles localStorage setItem failure gracefully', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useProgress(), {
      wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>
    });

    await act(async () => {
      result.current.toggleTopic('fail-id');
    });

    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("Failed to save progress to localStorage", expect.any(Error));
    });

    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useProgress must be used within a ProgressProvider');
    consoleSpy.mockRestore();
  });
});
