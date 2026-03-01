import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  completedTopics: Record<string, boolean>
  toggleTopic: (topicId: string) => void
  completedCheckboxes: Record<string, boolean>
  toggleCheckbox: (topicId: string, checkboxId: string) => void
  language: string
  setLanguage: (lang: string) => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedTopics: {},
      toggleTopic: (topicId) =>
        set((state) => ({
          completedTopics: {
            ...state.completedTopics,
            [topicId]: !state.completedTopics[topicId]
          }
        })),
      completedCheckboxes: {},
      toggleCheckbox: (topicId, checkboxId) =>
        set((state) => {
          return {
            completedCheckboxes: {
              ...state.completedCheckboxes,
              [checkboxId]: !state.completedCheckboxes[checkboxId]
            }
          }
        }),
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'ciu-progress-storage',
    }
  )
)
