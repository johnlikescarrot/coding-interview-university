import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SidebarProvider, useSidebar } from '../sidebar'
import * as React from 'react'

// Mock useIsMobile
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}))

const TestComponent = () => {
  const { open, setOpen } = useSidebar()
  return (
    <div>
      <span data-testid="open-state">{open ? 'open' : 'closed'}</span>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>Toggle State</button>
    </div>
  )
}

describe('SidebarProvider', () => {
  it('toggles open state with functional updater', () => {
    render(
      <SidebarProvider defaultOpen={true}>
        <TestComponent />
      </SidebarProvider>
    )

    expect(screen.getByTestId('open-state').textContent).toBe('open')

    const button = screen.getByText('Toggle State')
    fireEvent.click(button)
    expect(screen.getByTestId('open-state').textContent).toBe('closed')

    fireEvent.click(button)
    expect(screen.getByTestId('open-state').textContent).toBe('open')
  })

  it('handles controlled state correctly', () => {
    const onOpenChange = vi.fn()
    render(
      <SidebarProvider open={true} onOpenChange={onOpenChange}>
        <TestComponent />
      </SidebarProvider>
    )

    const button = screen.getByText('Toggle State')
    fireEvent.click(button)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
