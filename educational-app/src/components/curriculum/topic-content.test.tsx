import { render, screen, act } from '@testing-library/react'
import { TopicContent } from './topic-content'
import { ProgressProvider } from '@/context/ProgressContext'
import { expect, it, describe, vi } from 'vitest'

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
        { title: 'Other', url: 'o.com', type: 'article' as const }
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
    await act(async () => {
      buttons[0].click() // Toggle button
    })

    expect(screen.getByText('1 / 1 Completed')).toBeInTheDocument()
  })
})
