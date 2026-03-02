import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor, renderHook, fireEvent } from '@testing-library/react';
import { ProgressProvider, useProgress } from '../components/progress-provider';
import * as React from 'react';

const TestComponent = () => {
  const { completed, toggleTopic, totalTopics, setTotalTopics } = useProgress();
  return (
    <div>
      <div data-testid="completed-count">{completed.length}</div>
      <div data-testid="total-topics">{totalTopics}</div>
      <button type="button" onClick={() => toggleTopic('test-id')}>Toggle</button>
      <button type="button" onClick={() => setTotalTopics(200)}>SetTotal</button>
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

    expect(screen.getByTestId('completed-count').textContent).toBe('0');

    const button = screen.getByText('Toggle');
    await act(async () => {
      button.click();
    });

    expect(screen.getByTestId('completed-count').textContent).toBe('1');
    expect(JSON.parse(localStorage.getItem('ciu-progress') || '[]')).toContain('test-id');

    // Toggle again to remove (hits line 55 filter)
    await act(async () => {
        button.click();
    });
    expect(screen.getByTestId('completed-count').textContent).toBe('0');
    expect(JSON.parse(localStorage.getItem('ciu-progress') || '[]')).not.toContain('test-id');
  });

  it('should allow setting total topics', async () => {
      render(
          <ProgressProvider>
              <TestComponent />
          </ProgressProvider>
      );
      expect(screen.getByTestId('total-topics').textContent).toBe('180');
      fireEvent.click(screen.getByText('SetTotal'));
      expect(screen.getByTestId('total-topics').textContent).toBe('200');
  });

  it('should hydrate from localStorage on mount', async () => {
    localStorage.setItem('ciu-progress', JSON.stringify(['stored-id']));

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    await waitFor(() => {
        expect(screen.getByTestId('completed-count').textContent).toBe('1');
    });
  });

  it('should handle non-array localStorage data gracefully', async () => {
    localStorage.setItem('ciu-progress', JSON.stringify({ not: 'an-array' }));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    await waitFor(() => {
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid progress data'));
    });
    warnSpy.mockRestore();
  });

  it('should handle array with non-strings gracefully', async () => {
      localStorage.setItem('ciu-progress', JSON.stringify([1, 2, 3]));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <ProgressProvider>
          <TestComponent />
        </ProgressProvider>
      );

      await waitFor(() => {
          expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid progress data'));
      });
      warnSpy.mockRestore();
    });

  it('should handle malformed localStorage JSON gracefully', async () => {
    localStorage.setItem('ciu-progress', 'invalid-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    await waitFor(() => {
        expect(screen.getByTestId('completed-count').textContent).toBe('0');
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle storage failures gracefully', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
          throw new Error('Quota exceeded');
      });

      const { result } = renderHook(() => useProgress(), {
          wrapper: ({ children }) => <ProgressProvider>{children}</ProgressProvider>
      });

      await act(async () => {
          result.current.toggleTopic('fail');
      });

      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to save progress'), expect.any(Error));

      errorSpy.mockRestore();
      setItemSpy.mockRestore();
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useProgress must be used within a ProgressProvider');
    consoleSpy.mockRestore();
  });

  it('should handle rapid successive toggle calls correctly', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProgressProvider>{children}</ProgressProvider>
    );
    const { result } = renderHook(() => useProgress(), { wrapper });

    await act(async () => {
      result.current.toggleTopic('a');
      result.current.toggleTopic('b');
      result.current.toggleTopic('c');
    });

    await waitFor(() => {
      expect(result.current.completed).toEqual(['a', 'b', 'c']);
    });

    expect(JSON.parse(localStorage.getItem('ciu-progress') || '[]')).toEqual(['a', 'b', 'c']);
  });
});
