"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RefreshCcw } from "lucide-react"

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="perspective-1000 w-full h-80 group">
      <button
        type="button"
        className="w-full h-full cursor-pointer text-left block focus:outline-hidden focus:ring-2 focus:ring-primary rounded-3xl"
        onClick={() => setIsFlipped(!isFlipped)}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Show front of card" : "Show back of card"}
        data-testid="flashcard-root"
        data-flipped={isFlipped}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          data-testid="flashcard-motion"
        >
          <div className="relative w-full h-full preserve-3d min-h-80">
            {/* Front */}
            <Card
              className={cn(
                "absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 text-center border-2 border-primary/10 bg-card/60 backdrop-blur-xl rounded-3xl shadow-xl transition-colors",
                isFlipped ? "pointer-events-none" : ""
              )}
            >
              <CardContent className="p-0 space-y-4" aria-hidden={isFlipped}>
                <h3 className="text-2xl font-black tracking-tighter leading-tight text-foreground">{front}</h3>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                  <RefreshCcw className="h-3 w-3 animate-neural-pulse" />
                  <span>Click to reveal core truth</span>
                </div>
              </CardContent>
            </Card>

            {/* Back */}
            <Card
              className={cn(
                "absolute inset-0 backface-hidden flex items-center justify-center p-10 text-center border-2 border-primary bg-primary/5 [transform:rotateY(180deg)] rounded-3xl shadow-inner transition-colors",
                !isFlipped ? "pointer-events-none" : ""
              )}
            >
              <CardContent className="p-0" aria-hidden={!isFlipped}>
                <p className="text-xl font-bold leading-relaxed tracking-tight text-primary drop-shadow-sm">{back}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </button>
    </div>
  )
}
