"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

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
  const [isMounted, setIsMounted] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ciu-progress")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Runtime validation: Ensure it's a string array
        if (Array.isArray(parsed) && parsed.every(i => typeof i === "string")) {
          setCompleted(parsed)
        } else {
          console.warn("Invalid data format in localStorage: ciu-progress")
        }
      } catch (e) {
        console.error("Failed to parse progress from localStorage", e)
      }
    }
    setIsMounted(true)
  }, [])

  // Persist to localStorage when completed changes
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("ciu-progress", JSON.stringify(completed))
      } catch (err) {
        console.error("Failed to save ciu-progress to localStorage", err)
      }
    }
  }, [completed, isMounted])

  const toggleTopic = useCallback((id: string) => {
    setCompleted((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }, [])

  const value = React.useMemo(() => ({
    completed,
    totalTopics,
    toggleTopic,
    setTotalTopics
  }), [completed, totalTopics, toggleTopic])

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
