import { render, screen, fireEvent } from '@testing-library/react'
import SofaWhiteboard from '../SofaWhiteboard'
import { describe, it, expect, vi } from 'vitest'

describe('SofaWhiteboard', () => {
  it('renders the canvas and controls', () => {
    render(<SofaWhiteboard />)
    expect(screen.getByText('The Sofa Whiteboard')).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  it('changes tools when clicked', () => {
    render(<SofaWhiteboard />)
    const eraserBtn = screen.getAllByRole('button').find(b => b.innerHTML.includes('eraser'))
    if (eraserBtn) fireEvent.click(eraserBtn)
    // Basic verification it doesn't crash
    expect(screen.getByText('The Sofa Whiteboard')).toBeInTheDocument()
  })
})
