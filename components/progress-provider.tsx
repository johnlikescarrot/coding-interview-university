"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useActionState, useOptimistic, startTransition } from "react"

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

  // React 19 Action State for Neuro-Sync Updates
  const [state, dispatch, isPending] = useActionState(
    async (prevState: string[], id: string) => {
      const nextState = prevState.includes(id)
        ? prevState.filter((i) => i !== id)
        : [...prevState, id]
      return nextState
    },
    []
  )

  // Optimistic UI for Transcendent Speed
  const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(completed)

  useEffect(() => {
    const saved = localStorage.getItem("ciu-progress")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.every(item => typeof item === "string")) {
          setCompleted(parsed)
        } else {
          console.warn("Invalid progress data in localStorage")
        }
      } catch (e) {
        console.error("Failed to parse progress from localStorage", e)
      }
    }
    setIsMounted(true)
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

  // Sync action state with base state
  useEffect(() => {
    if (state.length > 0 || completed.length > 0) {
       setCompleted(state)
    }
  }, [state])

  const toggleTopic = useCallback((id: string) => {
    startTransition(() => {
      setOptimisticCompleted((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      )
      dispatch(id)
    })
  }, [dispatch, setOptimisticCompleted])

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
