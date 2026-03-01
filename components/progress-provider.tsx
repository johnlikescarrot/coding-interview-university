"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

const DEFAULT_TOTAL_TOPICS = 180 // Approximate count from curriculum

interface ProgressContextType {
  completed: string[]
  totalTopics: number
  toggleTopic: (id: string) => void
  setTotalTopics: (count: number) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([])
  const [totalTopics, setTotalTopics] = useState(DEFAULT_TOTAL_TOPICS)

  // Resolve hydration mismatch by loading from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ciu-progress")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.every(x => typeof x === "string")) {
          setCompleted(parsed)
        }
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e)
    }
  }, [])

  const toggleTopic = (id: string) => {
    setCompleted((prev) => {
      const next = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]

      try {
        localStorage.setItem("ciu-progress", JSON.stringify(next))
      } catch (e) {
        console.error("Failed to save progress to localStorage", e)
      }
      return next
    })
  }

  return (
    <ProgressContext.Provider value={{ completed, totalTopics, toggleTopic, setTotalTopics }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) throw new Error("useProgress must be used within ProgressProvider")
  return context
}
