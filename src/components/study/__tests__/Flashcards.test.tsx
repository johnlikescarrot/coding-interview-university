/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Flashcards from '../Flashcards';

// Comprehensive Mocks
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, onKeyDown, ...props }: any) => {
      // Omit motion-specific props to avoid DOM warnings
      const domProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !['initial', 'animate', 'exit', 'transition'].includes(key))
      );

      // Only apply role/tabIndex when handlers are present to match real behavior
      const isInteractive = !!onClick || !!onKeyDown;

      return (
        <div
          {...(isInteractive ? { role: "button", tabIndex: 0, onClick, onKeyDown } : {})}
          className={className}
          data-testid="motion-div"
          {...domProps}
        >
          {children}
        </div>
      );
    },
  },
  AnimatePresence: ({ children }: any) => <div data-testid="animate-presence">{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, 'aria-label': ariaLabel, type = "button" }: any) => (
    <button type={type} onClick={onClick} disabled={disabled} className={className} aria-label={ariaLabel}>{children}</button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={className}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span>Left</span>,
  ChevronRight: () => <span>Right</span>,
  RotateCcw: () => <span>Rotate</span>,
}));

describe('Flashcards', () => {
  const mockCards = [
    { q: 'Question 1', a: 'Answer 1' },
    { q: 'Question 2', a: 'Answer 2' },
  ];

  it('renders correctly and flips', () => {
    render(<Flashcards cards={mockCards} />);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /question side/i }));
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
  });

  it('navigates to next and prev', () => {
    render(<Flashcards cards={mockCards} />);
    const nextBtn = screen.getByLabelText(/next card/i);
    const prevBtn = screen.getByLabelText(/previous card/i);

    fireEvent.click(nextBtn);
    expect(screen.getByText('Question 2')).toBeInTheDocument();

    fireEvent.click(prevBtn);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<Flashcards cards={mockCards} />);
    const card = screen.getByLabelText(/question side/i);

    // Flip to answer
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(screen.getByText('Answer 1')).toBeInTheDocument();

    // Flip back to question
    const answerCard = screen.getByLabelText(/answer side/i);
    fireEvent.keyDown(answerCard, { key: ' ' });
    expect(screen.getByText('Question 1')).toBeInTheDocument();
  });
});
