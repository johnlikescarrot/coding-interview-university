import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Flashcard } from '../components/flashcard';
import * as React from 'react';

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, animate, ...props }: any) => (
            <div {...props} data-animate={JSON.stringify(animate)}>
                {children}
            </div>
        ),
    }
}));

describe('Flashcard', () => {
  it('flips on click', async () => {
    render(<Flashcard front="Front Side" back="Back Side" />);

    const button = screen.getByRole('button');

    expect(screen.getByTestId('flashcard-motion')).toHaveAttribute('data-animate', '{"rotateY":0}');

    await act(async () => {
        fireEvent.click(button);
    });

    expect(screen.getByTestId('flashcard-motion')).toHaveAttribute('data-animate', '{"rotateY":180}');

    await act(async () => {
        fireEvent.click(button);
    });

    expect(screen.getByTestId('flashcard-motion')).toHaveAttribute('data-animate', '{"rotateY":0}');
  });
});
