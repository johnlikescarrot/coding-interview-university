"use client"

import { useProgress } from "@/components/progress-provider"
import { Progress } from "@/components/ui/progress"
import { NavLinks } from "./nav-links"
import { motion } from "framer-motion"

export function Sidebar() {
  const { completed, totalTopics } = useProgress()

  // Guard against division by zero
  const progressPercent = totalTopics > 0
    ? Math.min(Math.round((completed.length / totalTopics) * 100), 100)
    : 0

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card h-screen shrink-0 relative group">
      <div className="p-8 border-b">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-xl font-black tracking-tighter uppercase text-primary">CIU Mastery</h1>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.2em] font-bold opacity-60">Transcendent Education</p>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <NavLinks />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 border-t bg-muted/20"
      >
        <div className="flex justify-between items-center text-xs mb-3">
          <span className="text-muted-foreground font-semibold uppercase tracking-wider">Mastery</span>
          <span className="font-black text-primary">{progressPercent}%</span>
        </div>
        <Progress
          value={progressPercent}
          className="h-1.5"
          aria-label="Curriculum mastery progress"
        />
        <p className="text-[9px] text-muted-foreground mt-4 text-center font-medium opacity-70 italic">
          {completed.length} of {totalTopics} nodes decoded
        </p>
      </motion.div>

      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-linear-to-b from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </aside>
  )
}
