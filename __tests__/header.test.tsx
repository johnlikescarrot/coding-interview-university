import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '../components/header';
import * as React from 'react';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/'
}));

describe('Header Integration', () => {
  it('handles mobile menu workflow and navigation', async () => {
    render(<Header />);
    const menuBtn = screen.getByRole('button', { name: /toggle menu/i });

    // Initial state
    expect(screen.queryByText('Navigation')).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(menuBtn);
    expect(await screen.findByText('Navigation')).toBeInTheDocument();

    // Click navigation link
    const syllabusLink = screen.getByText('Study Plan');
    fireEvent.click(syllabusLink);

    // Menu should close
    await waitFor(() => {
        expect(screen.queryByText('Navigation')).not.toBeInTheDocument();
    });
  });

  it('provides command search access via shortcuts', async () => {
    render(<Header />);

    // Trigger Command Dialog
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    const searchInput = await screen.findByPlaceholderText(/search for your next challenge/i);
    expect(searchInput).toBeInTheDocument();

    // Test navigation from search
    const resourceLink = screen.getByText('Language Resource Lab');
    fireEvent.click(resourceLink);

    expect(mockPush).toHaveBeenCalledWith('/resources');

    // Dialog should close
    await waitFor(() => {
        expect(screen.queryByPlaceholderText(/search for your next challenge/i)).not.toBeInTheDocument();
    });
  });
});
