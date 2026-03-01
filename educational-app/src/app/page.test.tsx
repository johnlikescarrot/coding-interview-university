import { render, screen } from '@testing-library/react'
import Dashboard from './page'
import { ProgressProvider } from '@/context/ProgressContext'
import { expect, it, describe, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: '' }),
}))

describe('Dashboard Page', () => {
  it('renders the mastery journey title', () => {
    render(
      <ProgressProvider>
        <Dashboard />
      </ProgressProvider>
    )
    expect(screen.getByText('Your Mastery Journey')).toBeInTheDocument()
  })

  it('renders curriculum cards', () => {
    render(
      <ProgressProvider>
        <Dashboard />
      </ProgressProvider>
    )
    expect(screen.getByText(/Data Structures/i)).toBeInTheDocument()
  })
})
