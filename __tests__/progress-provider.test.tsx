import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ProgressProvider, useProgress } from '../components/progress-provider';
import * as React from 'react';

const TestComponent = () => {
  const { completed, toggleTopic } = useProgress();
  return (
    <div>
      <div data-testid="completed-count">{completed.length}</div>
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

    expect(screen.getByTestId('completed-count').textContent).toBe('0');

    const button = screen.getByRole('button');
    await act(async () => {
      button.click();
    });

    expect(screen.getByTestId('completed-count').textContent).toBe('1');
    expect(JSON.parse(localStorage.getItem('ciu-progress') || '[]')).toContain('test-id');
  });

  it('should hydrate from localStorage on mount', async () => {
    localStorage.setItem('ciu-progress', JSON.stringify(['stored-id']));

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    // Initial render is [] for hydration safety, then useEffect updates it
    // In some environments this might be 0 or 1 depending on microtask timing
    // so we use waitFor to ensure it reaches the expected state
    await waitFor(() => {
        expect(screen.getByTestId('completed-count').textContent).toBe('1');
    });
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

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useProgress must be used within ProgressProvider');
    consoleSpy.mockRestore();
  });
});
