import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Flashcard } from '../components/flashcard';

describe('Flashcard', () => {
  it('handles state-driven flip interactions', () => {
    render(<Flashcard front="Front" back="Back" />);

    const root = screen.getByTestId('flashcard-root');
    expect(root).toHaveAttribute('data-flipped', 'false');
    expect(screen.getByText('Front')).toBeInTheDocument();

    fireEvent.click(root);
    expect(root).toHaveAttribute('data-flipped', 'true');
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
