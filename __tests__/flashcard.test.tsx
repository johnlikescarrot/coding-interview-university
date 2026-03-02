import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Flashcard } from '../components/flashcard';

describe('Flashcard Full Cycle', () => {
  it('handles bidirectional flip interactions', () => {
    render(<Flashcard front="Neural Network" back="AI Core" />);

    const root = screen.getByTestId('flashcard-root');
    expect(root).toHaveAttribute('data-flipped', 'false');
    expect(screen.getByText('Neural Network')).toBeInTheDocument();

    // Flip to back
    fireEvent.click(root);
    expect(root).toHaveAttribute('data-flipped', 'true');
    expect(screen.getByText('AI Core')).toBeInTheDocument();

    // Flip back to front
    fireEvent.click(root);
    expect(root).toHaveAttribute('data-flipped', 'false');
    expect(screen.getByText('Neural Network')).toBeInTheDocument();
  });
});
