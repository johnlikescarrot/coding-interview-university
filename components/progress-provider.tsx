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

const getInitialProgress = () => {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem("ciu-progress")
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.every(x => typeof x === "string")) {
        return parsed
      }
    }
  } catch (e) {
    console.error("Failed to load progress from localStorage", e)
  }
  return []
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>(getInitialProgress)
  const [totalTopics, setTotalTopics] = useState(DEFAULT_TOTAL_TOPICS)

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
