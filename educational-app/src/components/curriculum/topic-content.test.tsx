import { render, screen, fireEvent, act } from '@testing-library/react'
import { TopicContent } from './topic-content'
import { ProgressProvider } from '@/context/ProgressContext'
import { expect, it, describe } from 'vitest'

const mockTopic = {
  title: 'Test Topic',
  slug: 'test-topic',
  subtopics: [
    {
      title: 'Sub 1',
      slug: 'sub-1',
      items: ['item 1'],
      resources: [
        { title: 'Video', url: 'v.com', type: 'video' as const },
        { title: 'Book', url: 'b.com', type: 'book' as const },
        { title: 'Other', url: 'o.com', type: 'article' as const },
        { title: 'Dangerous', url: 'javascript:alert(1)', type: 'article' as const }
      ]
    }
  ]
}

describe('TopicContent', () => {
  it('renders topic details and handles interaction', async () => {
    render(
      <ProgressProvider>
        <TopicContent topic={mockTopic} />
      </ProgressProvider>
    )

    expect(screen.getByText('Test Topic')).toBeInTheDocument()

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0]) // Toggle progress

    expect(screen.getByText('1 / 1 Completed')).toBeInTheDocument()
  })

  it('sanitizes dangerous URLs when visible', async () => {
    render(
      <ProgressProvider>
        <TopicContent topic={mockTopic} />
      </ProgressProvider>
    )

    // Open accordion to make links visible
    const trigger = screen.getByText('Sub 1')
    fireEvent.click(trigger)

    const dangerousLink = await screen.findByText('Dangerous')
    const anchor = dangerousLink.closest('a')
    expect(anchor?.getAttribute('href')).toBe('#')
  })
})
