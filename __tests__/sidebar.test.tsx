import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Sidebar } from '../components/sidebar';
import { useProgress } from '../components/progress-provider';

vi.mock('../components/progress-provider', () => ({
  useProgress: vi.fn(),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const renderWithProgress = (completed: string[], totalTopics: number) => {
  (useProgress as any).mockReturnValue({
    completed,
    totalTopics,
  });
  return render(<Sidebar />);
};

describe('Sidebar Component Scenarios', () => {
  afterEach(cleanup);

  it('renders correctly at 0% progress', () => {
    renderWithProgress([], 100);
    expect(screen.getAllByText((content, element) => element?.textContent === '0%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CIU Mastery').length).toBeGreaterThan(0);
  });

  it('renders correctly at 100% progress', () => {
    renderWithProgress(['a', 'b'], 2);
    expect(screen.getAllByText((content, element) => element?.textContent === '100%').length).toBeGreaterThan(0);
  });

  it('handles over-complete progress (caps at 100%)', () => {
    renderWithProgress(['a', 'b', 'c'], 2);
    expect(screen.getAllByText((content, element) => element?.textContent === '100%').length).toBeGreaterThan(0);
  });

  it('handles totalTopics = 0 (defaults to 0%)', () => {
    renderWithProgress(['a'], 0);
    expect(screen.getAllByText((content, element) => element?.textContent === '0%').length).toBeGreaterThan(0);
  });

  it('renders correctly at 73% progress', () => {
    renderWithProgress(['1', '2', '3', '4', '5', '6', '7', '8'], 11);
    expect(screen.getAllByText((content, element) => element?.textContent === '73%').length).toBeGreaterThan(0);
  });
});
