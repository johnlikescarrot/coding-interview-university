"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useOptimistic, useTransition } from "react"

const DEFAULT_TOTAL_TOPICS = 180

interface ProgressContextType {
  completed: string[]
  totalTopics: number
  toggleTopic: (id: string) => void
  setTotalTopics: (count: number) => void
  isPending: boolean
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [completed, setCompleted] = useState<string[]>([])
  const [totalTopics, setTotalTopics] = useState(DEFAULT_TOTAL_TOPICS)
  const [isMounted, setIsMounted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [optimisticCompleted, addOptimistic] = useOptimistic(
    completed,
    (state: string[], id: string) =>
      state.includes(id)
        ? state.filter((i) => i !== id)
        : [...state, id]
  )

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ciu-progress")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.every(item => typeof item === "string")) {
          setCompleted(parsed)
        } else {
          console.warn("Invalid progress data in localStorage")
        }
      }
    } catch (e) {
      console.warn("Failed to parse progress from localStorage", e)
    } finally {
      setIsMounted(true)
    }
  }, [])

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("ciu-progress", JSON.stringify(completed))
      } catch (err) {
        console.error("Failed to save progress to localStorage", err)
      }
    }
  }, [completed, isMounted])

  const toggleTopic = useCallback((id: string) => {
    startTransition(() => {
      addOptimistic(id)
      setCompleted((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
    })
  }, [addOptimistic])

  const value = React.useMemo(() => ({
    completed: optimisticCompleted,
    totalTopics,
    toggleTopic,
    setTotalTopics,
    isPending
  }), [optimisticCompleted, totalTopics, toggleTopic, isPending])

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
