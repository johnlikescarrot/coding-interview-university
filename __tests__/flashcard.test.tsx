import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Flashcard } from '../components/flashcard';
import * as React from 'react';

describe('Flashcard', () => {
  it('handles state-driven flip interactions', () => {
    render(<Flashcard front="Front" back="Back" data-testid="test-card" />);
    const card = screen.getByTestId('test-card');

    expect(card.getAttribute('data-flipped')).toBe('false');
    fireEvent.click(card);
    expect(card.getAttribute('data-flipped')).toBe('true');
  });
});
