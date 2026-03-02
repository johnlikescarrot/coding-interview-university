import { create } from 'zustand'
import { persist } from "zustand/middleware"
import { LanguageCode } from '@/lib/constants'

interface ProgressState {
  language: LanguageCode
  completedCheckboxes: Record<string, boolean>
  setLanguage: (lang: LanguageCode) => void
  toggleCheckbox: (topicId: string, checkboxId: string) => void
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      language: 'en',
      completedCheckboxes: {},
      setLanguage: (language) => set({ language }),
      toggleCheckbox: (topicId, checkboxId) =>
        set((state) => {
          // Use namespaced key to prevent collisions across topics
          const namespacedKey = `${topicId}:${checkboxId}`
          return {
            completedCheckboxes: {
              ...state.completedCheckboxes,
              [namespacedKey]: !state.completedCheckboxes[namespacedKey],
            },
          }
        }),
      resetProgress: () => set({ completedCheckboxes: {} }),
    }),
    {
      name: 'ciu-academy-progress',
    }
  )
)
