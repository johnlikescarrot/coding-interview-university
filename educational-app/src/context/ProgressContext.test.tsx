import { render, screen, act, fireEvent } from '@testing-library/react'
import { ProgressProvider, useProgress } from './ProgressContext'
import { expect, it, describe, beforeEach, vi } from 'vitest'

const TestComponent = () => {
  const { completedSubTopics, toggleSubTopic, isSubTopicCompleted, getProgressForTopic } = useProgress()
  return (
    <div>
      <div data-testid="completed-count">{completedSubTopics.length}</div>
      <div data-testid="is-completed">{isSubTopicCompleted('test-slug') ? 'yes' : 'no'}</div>
      <div data-testid="progress">{getProgressForTopic(['test-slug', 'other'])}</div>
      <button onClick={() => toggleSubTopic('test-slug')}>Toggle</button>
    </div>
  )
}

describe('ProgressContext', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.restoreAllMocks()
  })

  it('provides progress state and updates it', async () => {
    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    )

    expect(screen.getByTestId('completed-count').textContent).toBe('0')

    fireEvent.click(screen.getByText('Toggle'))

    expect(screen.getByTestId('completed-count').textContent).toBe('1')
    expect(screen.getByTestId('is-completed').textContent).toBe('yes')
    expect(screen.getByTestId('progress').textContent).toBe('50')

    fireEvent.click(screen.getByText('Toggle'))

    expect(screen.getByTestId('completed-count').textContent).toBe('0')
  })

  it('loads from localStorage', () => {
    window.localStorage.setItem('ciu-progress', JSON.stringify(['saved-slug']))

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    )

    expect(screen.getByTestId('completed-count').textContent).toBe('1')
  })

  it('handles corrupted localStorage data (invalid JSON)', () => {
    window.localStorage.setItem('ciu-progress', 'invalid-json')
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    )

    expect(screen.getByTestId('completed-count').textContent).toBe('0')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('handles invalid localStorage data (not an array of strings)', () => {
    window.localStorage.setItem('ciu-progress', JSON.stringify({ not: "an-array" }))
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    )

    expect(screen.getByTestId('completed-count').textContent).toBe('0')
    // It should log a warning and reset state.
    // Note: useEffect might trigger a save of the initial empty array immediately after.
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid progress data'))
    consoleSpy.mockRestore()
  })

  it('handles empty subtopics for progress calculation', () => {
     const TestEmpty = () => {
        const { getProgressForTopic } = useProgress()
        return <div data-testid="empty-progress">{getProgressForTopic([])}</div>
     }

     render(
        <ProgressProvider>
            <TestEmpty />
        </ProgressProvider>
     )

     expect(screen.getByTestId('empty-progress').textContent).toBe('0')
  })

  it('throws error when useProgress is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const BuggyComponent = () => {
        useProgress()
        return null
    }
    expect(() => render(<BuggyComponent />)).toThrow('useProgress must be used within a ProgressProvider')
    consoleSpy.mockRestore()
  })
})
