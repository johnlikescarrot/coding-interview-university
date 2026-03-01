import { render, screen } from '@testing-library/react'
import TopicPage, { generateStaticParams, generateMetadata } from './page'
import { ProgressProvider } from '@/context/ProgressContext'
import { expect, it, describe, vi } from 'vitest'

describe('Topic Page Server Component', () => {
  it('renders TopicContent when topic exists', async () => {
    const params = Promise.resolve({ slug: 'data-structures' })
    const Page = await TopicPage({ params })

    render(
      <ProgressProvider>
        {Page}
      </ProgressProvider>
    )

    expect(screen.getAllByText(/Data Structures/i).length).toBeGreaterThan(0)
  })

  it('renders not found when topic missing', async () => {
    const params = Promise.resolve({ slug: 'missing' })
    const Page = await TopicPage({ params })

    render(
      <ProgressProvider>
        {Page}
      </ProgressProvider>
    )

    expect(screen.getByText('Topic Not Found')).toBeTruthy()
  })

  it('generateStaticParams returns curriculum slugs', async () => {
    const params = await generateStaticParams()
    expect(params.length).toBeGreaterThan(0)
    expect(params[0]).toHaveProperty('slug')
  })

  it('generateMetadata returns correct title', async () => {
    const params = Promise.resolve({ slug: 'data-structures' })
    const metadata = await generateMetadata({ params })
    expect(metadata.title).toContain('Data Structures')
  })

  it('generateMetadata returns default title when topic missing', async () => {
    const params = Promise.resolve({ slug: 'missing' })
    const metadata = await generateMetadata({ params })
    expect(metadata.title).toContain('Topic')
  })
})
