"use client"

import { useState } from "react"
import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1
  }

  return (
    <div className="perspective-1000 w-full h-72">
      <motion.button
        type="button"
        className="w-full h-full cursor-pointer text-left block focus:outline-hidden focus:ring-2 focus:ring-primary rounded-2xl group relative"
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotateX: 2, rotateY: 2 }}
        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Show front of card" : "Show back of card"}
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : springConfig}
        >
          {/* Front Side */}
          <Card
            aria-hidden={isFlipped}
            className={cn(
              "absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 text-center border-2 border-primary/20 transition-colors duration-300 bg-card/80 backdrop-blur-sm group-hover:border-primary/40 rounded-2xl shadow-xl",
              isFlipped && "pointer-events-none"
            )}
          >
            <CardContent className="p-0 space-y-4">
              <div className="text-primary/40 uppercase tracking-[0.2em] text-[10px] font-black">Concept Node</div>
              <h3 className="text-3xl font-black tracking-tighter leading-tight text-gradient">
                {front}
              </h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">
                {shouldReduceMotion ? "Tap to reveal" : "Click to decode"}
              </p>
            </CardContent>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
          </Card>

          {/* Back Side */}
          <Card
            aria-hidden={!isFlipped}
            className={cn(
              "absolute inset-0 backface-hidden flex items-center justify-center p-10 text-center border-2 border-primary bg-primary/[0.05] [transform:rotateY(180deg)] transition-colors duration-300 backdrop-blur-md rounded-2xl shadow-2xl shadow-primary/10",
              !isFlipped && "pointer-events-none"
            )}
          >
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {isFlipped && (
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                        : { opacity: 0, scale: 0.9, filter: "blur(10px)" }
                    }
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.2, duration: 0.4 }}
                  >
                    <p className="text-lg font-bold leading-relaxed text-foreground/90">
                      {back}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
            <div className="absolute top-4 right-6 text-primary/30 text-[10px] font-black uppercase tracking-tighter">Decoded</div>
          </Card>
        </motion.div>
      </motion.button>
    </div>
  )
}
