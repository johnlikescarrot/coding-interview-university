"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className="perspective-1000 w-full h-64 cursor-pointer text-left block focus:outline-hidden focus:ring-2 focus:ring-primary rounded-xl group"
      onClick={() => setIsFlipped(!isFlipped)}
      aria-pressed={isFlipped}
      aria-label={isFlipped ? "Show front of card" : "Show back of card"}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
          mass: 1.2
        }}
      >
        {/* Front */}
        <Card
          aria-hidden={isFlipped}
          className={cn(
            "absolute inset-0 backface-hidden flex items-center justify-center p-8 text-center border-2 border-primary/20 transition-all duration-500 group-hover:border-primary/40 shadow-sm group-hover:shadow-md",
            isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <CardContent className="p-0">
            <h3 className="text-2xl font-bold tracking-tight text-gradient">{front}</h3>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mt-4 opacity-70">
              Click to reveal insight
            </p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          aria-hidden={!isFlipped}
          className={cn(
            "absolute inset-0 backface-hidden flex items-center justify-center p-8 text-center border-2 border-primary bg-primary/5 [transform:rotateY(180deg)] transition-all duration-500 shadow-lg",
            !isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <CardContent className="p-0">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.2 }}
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
