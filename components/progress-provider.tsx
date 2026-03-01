"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ProgressContextType {
  completed: string[]
  totalTopics: number
  toggleTopic: (id: string) => void
  setTotalTopics: (count: number) => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([])
  const [totalTopics, setTotalTopics] = useState(180) // Default fallback

  useEffect(() => {
    const saved = localStorage.getItem("ciu-progress")
    if (saved) {
      try {
        setCompleted(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse progress", e)
      }
    }
  }, [])

  const toggleTopic = (id: string) => {
    const next = completed.includes(id)
      ? completed.filter((i) => i !== id)
      : [...completed, id]

    setCompleted(next)
    localStorage.setItem("ciu-progress", JSON.stringify(next))
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
