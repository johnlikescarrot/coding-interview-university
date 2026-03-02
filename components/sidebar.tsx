"use client"

import { useProgress } from "@/components/progress-provider"
import { Progress } from "@/components/ui/progress"
import { NavLinks } from "./nav-links"
import { motion } from "framer-motion"
import { Trophy, Flame, Target } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { completed, totalTopics } = useProgress()

  // Guard against division by zero
  const progressPercent = totalTopics > 0
    ? Math.min(Math.round((completed.length / totalTopics) * 100), 100)
    : 0

  const isBeastMode = progressPercent > 50;

  return (
    <aside className="hidden md:flex flex-col w-72 border-r bg-card/30 backdrop-blur-xl h-screen shrink-0 relative overflow-hidden transition-all duration-500">
      {/* Decorative Gradient Glow */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 transition-all duration-1000",
        isBeastMode ? "bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-pulse" : "bg-primary"
      )} />

      <div className="p-8 border-b border-border/40">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Flame className={cn("h-6 w-6 transition-colors duration-500", isBeastMode ? "text-orange-500 fill-orange-500" : "text-primary")} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">CIU Mastery</h1>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-1 opacity-70">Beast Mode v1.0</p>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
        <NavLinks />
      </div>

      <div className="p-8 border-t border-border/40 bg-muted/20 relative">
        {/* Background Sparkle Effect for High Progress */}
        {isBeastMode && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.05)_0,transparent_100%)] animate-pulse" />
        )}

        <div className="space-y-6 relative">
          <div className="flex justify-between items-end mb-1">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Global Progress</span>
               <div className="flex items-center gap-2">
                 <Target className="h-4 w-4 text-primary" />
                 <span className="text-2xl font-black tracking-tighter">{progressPercent}%</span>
               </div>
            </div>
            {progressPercent === 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-1.5 rounded-full bg-yellow-500 text-black"
              >
                <Trophy className="h-4 w-4" />
              </motion.div>
            )}
          </div>

          <div className="relative pt-1">
            <Progress
              value={progressPercent}
              className={cn(
                "h-3 bg-primary/10 border border-primary/5",
                isBeastMode && "shadow-[0_0_15px_rgba(249,115,22,0.2)]"
              )}
              aria-label="Curriculum mastery progress"
            />
            {/* Beast Mode Indicator Line */}
            <div className="absolute top-0 left-1/2 bottom-0 w-px bg-border/40 z-10" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/40 shadow-sm">
            <div className="flex flex-col">
               <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight">Mastered</span>
               <span className="text-sm font-black tracking-tighter">{completed.length}</span>
            </div>
            <div className="w-px h-6 bg-border/40" />
            <div className="flex flex-col text-right">
               <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tight">Remaining</span>
               <span className="text-sm font-black tracking-tighter">{totalTopics - completed.length}</span>
            </div>
          </div>

          <p className="text-[9px] text-muted-foreground mt-2 text-center font-bold uppercase tracking-[0.15em] opacity-50">
            Keep Pushing • Transcendent Status Awaits
          </p>
        </div>
      </div>
    </aside>
  )
}
