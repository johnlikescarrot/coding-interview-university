import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Flashcard } from '@/components/flashcard';
import * as React from 'react';
import { useReducedMotion } from 'framer-motion';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: vi.fn(),
  };
});

describe('Flashcard', () => {
  describe('with motion enabled', () => {
    beforeEach(() => {
      vi.mocked(useReducedMotion).mockReturnValue(false);
    });

    it('should render front and back content', () => {
      render(<Flashcard front="Question" back="Answer" />);
      expect(screen.getByText('Question')).toBeInTheDocument();
      expect(screen.getByText('Answer')).toBeInTheDocument();
    });

    it('should toggle flip state when clicked', () => {
      render(<Flashcard front="Question" back="Answer" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should show standard interaction visual cues', () => {
      render(<Flashcard front="Question" back="Answer" />);
      expect(screen.getByText(/Click or press space to reveal/i)).toBeInTheDocument();
    });
  });

  describe('with reduced motion', () => {
    beforeEach(() => {
      vi.mocked(useReducedMotion).mockReturnValue(true);
    });

    it('should show reduced motion interaction visual cues', () => {
      render(<Flashcard front="Question" back="Answer" />);
      expect(screen.getByText(/Tap to reveal/i)).toBeInTheDocument();
      expect(screen.queryByText(/Click or press space to reveal/i)).not.toBeInTheDocument();
    });

    it('should still toggle flip state', () => {
      render(<Flashcard front="Question" back="Answer" />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
