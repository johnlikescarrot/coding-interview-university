/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Flashcards from '../Flashcards';

// Comprehensive Mocks
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, onKeyDown, 'aria-label': ariaLabel, ...props }: any) => {
      const domProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !['initial', 'animate', 'exit', 'transition'].includes(key))
      );
      const isInteractive = !!onClick || !!onKeyDown;
      return (
        <div
          {...(isInteractive ? { role: "button", tabIndex: 0, onClick, onKeyDown, "aria-label": ariaLabel } : {})}
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

  const mockLabels = {
    title: "Title",
    subtitle: "Subtitle",
    question: "Question",
    answer: "Answer",
    next: "Next",
    prev: "Prev",
    reset: "Reset",
    flip: "Flip"
  };

  it('renders correctly and flips', () => {
    render(<Flashcards cards={mockCards} labels={mockLabels} />);
    const card = screen.getByLabelText(new RegExp(`${mockLabels.question}, ${mockLabels.flip}`, 'i'));
    expect(card).toBeInTheDocument();

    fireEvent.click(card);
    expect(screen.getByLabelText(new RegExp(mockLabels.answer, 'i'))).toBeInTheDocument();
  });

  it('navigates through the deck', () => {
    render(<Flashcards cards={mockCards} labels={mockLabels} />);
    const nextBtn = screen.getByLabelText(new RegExp(mockLabels.next, 'i'));
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Question [12]/)).toBeInTheDocument();

    const prevBtn = screen.getByLabelText(new RegExp(mockLabels.prev, 'i'));
    fireEvent.click(prevBtn);
    expect(screen.getByText(/Question [12]/)).toBeInTheDocument();
  });

  it('handles keyboard flip', () => {
    render(<Flashcards cards={mockCards} labels={mockLabels} />);
    const card = screen.getByLabelText(new RegExp(`${mockLabels.question}, ${mockLabels.flip}`, 'i'));

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(screen.getByLabelText(new RegExp(mockLabels.answer, 'i'))).toBeInTheDocument();

    fireEvent.keyDown(card, { key: ' ', code: 'Space' });
    expect(screen.getByLabelText(new RegExp(mockLabels.question, 'i'))).toBeInTheDocument();
  });

  it('resets the deck', () => {
    render(<Flashcards cards={mockCards} labels={mockLabels} />);
    const nextBtn = screen.getByLabelText(new RegExp(mockLabels.next, 'i'));
    fireEvent.click(nextBtn);

    const resetBtn = screen.getByText(mockLabels.reset);
    fireEvent.click(resetBtn);

    expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument();
  });

  it('renders null for empty cards', () => {
    const { container } = render(<Flashcards cards={[]} labels={mockLabels} />);
    expect(container.firstChild).toBeNull();
  });

  it('disables navigation for single-card deck', () => {
    render(<Flashcards cards={[{ q: 'Q1', a: 'A1' }]} labels={mockLabels} />);
    expect(screen.getByLabelText(mockLabels.next)).toBeDisabled();
    expect(screen.getByLabelText(mockLabels.prev)).toBeDisabled();
  });
});
