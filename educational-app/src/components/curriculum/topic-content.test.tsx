import { render, screen, fireEvent } from '@testing-library/react'
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
        { title: 'Dangerous', url: 'javascript:x', type: 'other' as any }
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

  it('covers all icon and sanitization branches', async () => {
    render(
      <ProgressProvider>
        <TopicContent topic={mockTopic} />
      </ProgressProvider>
    )

    const trigger = screen.getByText('Sub 1')
    fireEvent.click(trigger)

    expect(await screen.findByText('Video')).toBeInTheDocument()
    expect(await screen.findByText('Book')).toBeInTheDocument()
    expect(await screen.findByText('Other')).toBeInTheDocument()
    expect((await screen.findByText('Dangerous')).closest('a')?.getAttribute('href')).toBe('#')
  })
})
