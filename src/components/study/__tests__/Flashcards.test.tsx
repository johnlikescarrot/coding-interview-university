import { render, screen, fireEvent } from '@testing-library/react'
import Flashcards from '../Flashcards'
import { describe, it, expect, vi } from 'vitest'

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className, ...props }: any) => (
      <div onClick={onClick} className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Flashcards', () => {
  it('flips the card when clicked', () => {
    render(<Flashcards />)
    expect(screen.getByText('Question')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Question'))
    expect(screen.getByText('Answer')).toBeInTheDocument()
  })

  it('cycles through cards', () => {
    render(<Flashcards />)
    // Find buttons by their order since they don't have unique text names in the SVG
    const buttons = screen.getAllByRole('button')
    // Index 0: Prev, Index 1: Next, Index 2: Restart
    fireEvent.click(buttons[1])
    expect(screen.getByText(/Card 2/i)).toBeInTheDocument()
  })
})
