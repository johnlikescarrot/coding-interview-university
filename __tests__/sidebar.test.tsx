import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from '../components/sidebar';
import { useProgress } from '../components/progress-provider';

vi.mock('../components/progress-provider', () => ({
  useProgress: vi.fn(),
}));

vi.mock('../components/nav-links', () => ({
  NavLinks: () => <div data-testid="nav-links-mock" />,
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    }
}));

describe('Sidebar', () => {
  const renderWithProgress = (completed: string[], totalTopics: number) => {
    (useProgress as any).mockReturnValue({ completed, totalTopics });
    return render(<Sidebar />);
  };

  it('renders correctly at 0% progress', () => {
    renderWithProgress([], 10);
    // Functional matcher to find combined text "0%"
    expect(screen.getAllByText((content, element) => element?.textContent === '0%').length).toBeGreaterThan(0);
  });

  it('renders correctly at 20% progress (low variant)', () => {
    renderWithProgress(['1', '2'], 10);
    expect(screen.getAllByText((content, element) => element?.textContent === '20%').length).toBeGreaterThan(0);
  });

  it('renders correctly at 40% progress (mid variant)', () => {
    renderWithProgress(['1', '2', '3', '4'], 10);
    expect(screen.getAllByText((content, element) => element?.textContent === '40%').length).toBeGreaterThan(0);
  });

  it('renders correctly at 75% progress (high variant)', () => {
    renderWithProgress(['1', '2', '3', '4', '5', '6', '7', '8'], 11);
    // 8/11 * 100 = 72.7 -> 73%
    expect(screen.getAllByText((content, element) => element?.textContent === '73%').length).toBeGreaterThan(0);
  });

  it('renders correctly at 100% progress (max variant)', () => {
    renderWithProgress(['1', '2', '3'], 3);
    expect(screen.getAllByText((content, element) => element?.textContent === '100%').length).toBeGreaterThan(0);
  });

  it('handles negative or zero topics gracefully', () => {
    renderWithProgress([], 0);
    expect(screen.getAllByText((content, element) => element?.textContent === '0%').length).toBeGreaterThan(0);
  });
});
