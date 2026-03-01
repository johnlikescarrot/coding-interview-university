"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className="perspective-1000 w-full h-64 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full transition-all duration-500 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <Card className="absolute inset-0 backface-hidden flex items-center justify-center p-6 text-center border-2 border-primary/20">
          <CardContent className="p-0">
            <h3 className="text-xl font-bold">{front}</h3>
            <p className="text-sm text-muted-foreground mt-2">Click to reveal answer</p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 backface-hidden flex items-center justify-center p-6 text-center border-2 border-primary bg-primary/5 [transform:rotateY(180deg)]">
          <CardContent className="p-0">
            <p className="text-lg font-medium">{back}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
