"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const springConfig = { type: "spring", stiffness: 260, damping: 20 }
  const instantConfig = { duration: 0 }

  return (
    <motion.button
      type="button"
      className="perspective-1000 w-full h-64 cursor-pointer text-left block focus:outline-hidden focus:ring-2 focus:ring-primary rounded-xl group"
      onClick={() => setIsFlipped(!isFlipped)}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Show front of card" : "Show back of card"}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={shouldReduceMotion ? instantConfig : springConfig}
      >
        {/* Front */}
        <Card
          aria-hidden={isFlipped}
          className={cn(
            "absolute inset-0 backface-hidden flex items-center justify-center p-8 text-center border-2 border-primary/20 transition-colors bg-card",
            isFlipped ? "pointer-events-none" : ""
          )}
        >
          <CardContent className="p-0">
            <motion.h3
              layout
              className="text-2xl font-black tracking-tight mb-3"
            >
              {front}
            </motion.h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold opacity-60">
              {shouldReduceMotion ? "Tap to reveal" : "Click or press space to reveal"}
            </p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          aria-hidden={!isFlipped}
          className={cn(
            "absolute inset-0 backface-hidden flex items-center justify-center p-8 text-center border-2 border-primary bg-primary/[0.03] [transform:rotateY(180deg)] transition-colors",
            !isFlipped ? "pointer-events-none" : ""
          )}
        >
          <CardContent className="p-0">
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              className="text-lg font-medium leading-relaxed"
            >
              {back}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.button>
  )
}
