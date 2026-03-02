import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../page';
import { useProgressStore } from '@/store/useProgressStore';

vi.mock('@/store/useProgressStore', () => ({
  useProgressStore: vi.fn(),
}));

vi.mock('@/components/layout/DashboardShell', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/curriculum/Roadmap', () => ({
  default: () => <div data-testid="roadmap">Roadmap</div>,
}));

vi.mock('@/components/whiteboard/SofaWhiteboard', () => ({
  default: () => <div>Whiteboard</div>,
}));

vi.mock('@/components/study/Flashcards', () => ({
  default: () => <div>Flashcards</div>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useProgressStore as any).mockReturnValue({
      language: 'en',
    });

    global.fetch = vi.fn();
  });

  it('renders loading state initially', () => {
    (global.fetch as any).mockReturnValue(new Promise(() => {}));
    render(<HomePage />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders roadmap after successful fetch', async () => {
    const mockData = [{ id: '1', title: 'Topic 1', subtopics: [] }];
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByTestId('roadmap')).toBeInTheDocument();
    });
  });

  it('renders error state on fetch failure', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
    });

    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/Error Loading Content/i)).toBeInTheDocument();
      expect(screen.getByText(/404/i)).toBeInTheDocument();
    });
  });
});
