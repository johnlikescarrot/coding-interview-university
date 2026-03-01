/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Flashcards from '../Flashcards';

// Comprehensive Mocks
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => (
      <div
        className={className}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
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
    { q: 'Q1', a: 'A1' },
    { q: 'Q2', a: 'A2' },
  ];

  it('renders correctly and flips', () => {
    render(<Flashcards cards={mockCards} />);
    expect(screen.getByText('Q1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Q1'));
    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  it('navigates to next and prev', () => {
    render(<Flashcards cards={mockCards} />);
    const nextBtn = screen.getByLabelText(/next/i);
    const prevBtn = screen.getByLabelText(/prev/i);

    fireEvent.click(nextBtn);
    expect(screen.getByText('Q2')).toBeInTheDocument();

    fireEvent.click(prevBtn);
    expect(screen.getByText('Q1')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<Flashcards cards={mockCards} />);
    const card = screen.getByRole('button', { name: /click to see answer/i });

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(screen.getByText('A1')).toBeInTheDocument();

    fireEvent.keyDown(card, { key: ' ' });
    expect(screen.getByText('Q1')).toBeInTheDocument();
  });
});
