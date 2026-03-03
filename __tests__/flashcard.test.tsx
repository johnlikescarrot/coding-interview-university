import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Flashcard } from '@/components/flashcard';
import * as React from 'react';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
  };
});

describe('Flashcard', () => {
  it('should render front and back content', () => {
    render(<Flashcard front="Question" back="Answer" />);

    expect(screen.getByText('Question')).toBeInTheDocument();
    expect(screen.getByText('Answer')).toBeInTheDocument();
  });

  it('should toggle flip state when clicked', () => {
    render(<Flashcard front="Question" back="Answer" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('should show visual cues for interaction', () => {
    render(<Flashcard front="Question" back="Answer" />);

    expect(screen.getByText(/Click or press space to reveal/i)).toBeInTheDocument();
  });
});
