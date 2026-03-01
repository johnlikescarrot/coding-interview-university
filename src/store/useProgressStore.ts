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
      toggleCheckbox: (_topicId, checkboxId) =>
        set((state) => ({
          completedCheckboxes: {
            ...state.completedCheckboxes,
            [checkboxId]: !state.completedCheckboxes[checkboxId],
          },
        })),
      resetProgress: () => set({ completedCheckboxes: {} }),
    }),
    {
      name: 'ciu-academy-progress',
    }
  )
)
