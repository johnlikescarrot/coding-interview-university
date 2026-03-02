"use client"

import { useProgress } from "@/components/progress-provider"
import { Progress } from "@/components/ui/progress"
import { NavLinks } from "./nav-links"

export function Sidebar() {
  const { completed, totalTopics } = useProgress()

  // Guard against division by zero
  const progressPercent = totalTopics > 0
    ? Math.min(Math.round((completed.length / totalTopics) * 100), 100)
    : 0

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen shrink-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold tracking-tight">CIU Mastery</h1>
        <p className="text-xs text-muted-foreground mt-1">Transcendental Education</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <NavLinks />
      </div>

      <div className="p-6 border-t bg-muted/30">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground font-medium">Overall Progress</span>
          <span className="font-bold">{progressPercent}%</span>
        </div>
        <Progress
          value={progressPercent}
          className="h-2"
          aria-label="Curriculum mastery progress"
        />
        <p className="text-[10px] text-muted-foreground mt-3 text-center">
          {completed.length} of {totalTopics} topics mastered
        </p>
      </div>
    </aside>
  )
}
