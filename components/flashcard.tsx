"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  front: string
  back: string
  "data-testid"?: string
}

export function Flashcard({ front, back, "data-testid": testId }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <button
      type="button"
      className="perspective-1000 w-full h-64 cursor-pointer text-left block focus:outline-hidden focus:ring-2 focus:ring-primary rounded-2xl group"
      onClick={() => setIsFlipped(!isFlipped)}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Show front of card" : "Show back of card"}
      data-flipped={isFlipped}
      data-testid={testId}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{
          rotateY: isFlipped ? 180 : 0,
          scale: isFlipped ? 0.98 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Front */}
        <Card
          className={cn(
            "absolute inset-0 backface-hidden flex items-center justify-center p-8 text-center border-2 border-primary/20 bg-card/50 backdrop-blur-xl transition-all group-hover:border-primary/40 shadow-2xl",
            isFlipped ? "pointer-events-none" : ""
          )}
        >
          <CardContent className="p-0">
            <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">{front}</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground opacity-60">Click to reveal core truth</p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          className={cn(
            "absolute inset-0 backface-hidden flex items-center justify-center p-8 text-center border-2 border-primary bg-primary/5 backdrop-blur-2xl [transform:rotateY(180deg)] transition-all shadow-primary/20 shadow-2xl",
            !isFlipped ? "pointer-events-none" : ""
          )}
        >
          <CardContent className="p-0">
            <p className="text-xl font-bold leading-relaxed tracking-tight">{back}</p>
          </CardContent>
        </Card>
      </motion.div>
    </button>
  )
}
