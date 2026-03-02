import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Header } from '../components/header';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/',
}));

describe('Header Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles keyboard shortcuts and navigation', async () => {
    const { unmount } = render(<Header />);

    // Test Command Palette Shortcut
    act(() => {
      fireEvent.keyDown(document, { key: 'k', metaKey: true });
    });
    expect(screen.getByPlaceholderText(/Search for your next/i)).toBeInTheDocument();

    // Test items are present
    expect(screen.getByText('Syllabus Home')).toBeInTheDocument();
    expect(screen.getByText('Language Resource Lab')).toBeInTheDocument();
    expect(screen.getByText('Active Recall (Flashcards)')).toBeInTheDocument();

    // Test Navigation inside Dialog
    const syllabusItem = screen.getByText('Language Resource Lab');
    fireEvent.click(syllabusItem);
    expect(pushMock).toHaveBeenCalledWith('/resources');

    // Test Cleanup (Branch coverage for useEffect cleanup)
    unmount();
  });

  it('handles mobile menu toggle', () => {
    render(<Header />);

    // Toggle Sheet by sr-only text
    const menuBtn = screen.getByText('Toggle menu');
    fireEvent.click(menuBtn);

    // Content is rendered
    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });
});
