import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { ProgressProvider, useProgress } from '../components/progress-provider';
import * as React from 'react';

const TestComponent = () => {
  const { completed, toggleTopic, isPending } = useProgress();
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

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should provide progress state', async () => {
    render(<ProgressProvider><TestComponent /></ProgressProvider>);
    const button = screen.getByText('Toggle');
    await act(async () => { button.click(); });
    expect(screen.getByTestId('completed-count').textContent).toBe('1');
  });

  it('should handle malformed JSON', async () => {
    localStorage.setItem('ciu-progress', '{invalid}');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ProgressProvider><TestComponent /></ProgressProvider>);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should handle valid JSON that is not an array', async () => {
    localStorage.setItem('ciu-progress', 'true');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<ProgressProvider><TestComponent /></ProgressProvider>);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('should handle storage errors during persistence', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ProgressProvider><TestComponent /></ProgressProvider>);

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('fail'); });
    await act(async () => { screen.getByText('Toggle').click(); });
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
