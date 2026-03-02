"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Sparkles, RefreshCcw } from "lucide-react"

interface FlashcardProps {
  front: string
  back: string
}

export function Flashcard({ front, back }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="group perspective-1000 w-full h-72">
      <button
        type="button"
        className="w-full h-full cursor-pointer text-left block focus:outline-hidden focus:ring-4 focus:ring-primary/20 rounded-3xl transition-all duration-500 group-hover:scale-[1.02]"
        onClick={() => setIsFlipped(!isFlipped)}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Show front of card" : "Show back of card"}
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }} data-testid="flashcard-motion"
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 1 }}
        >
          {/* Front */}
          <Card
            aria-hidden={isFlipped}
            className={cn(
              "absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 text-center border-2 border-primary/10 bg-card/60 backdrop-blur-xl rounded-3xl shadow-xl transition-colors",
              isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
            )}
          >
            <div className="absolute top-6 left-6 text-primary/30">
               <Sparkles className="h-6 w-6" />
            </div>
            <CardContent className="p-0 space-y-4">
              <h3 className="text-2xl font-black tracking-tighter leading-tight text-foreground">{front}</h3>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                <RefreshCcw className="h-3 w-3 animate-spin-slow" />
                <span>Click to reveal core truth</span>
              </div>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            aria-hidden={!isFlipped}
            className={cn(
              "absolute inset-0 backface-hidden flex flex-col items-center justify-center p-10 text-center border-2 border-primary bg-primary/[0.03] backdrop-blur-2xl rounded-3xl shadow-2xl [transform:rotateY(180deg)] transition-all duration-500",
              !isFlipped ? "pointer-events-none opacity-0" : "opacity-100 border-primary/40"
            )}
          >
             <div className="absolute top-6 right-6 text-primary/20">
               <RefreshCcw className="h-6 w-6" />
            </div>
            <CardContent className="p-0">
              <p className="text-xl font-bold leading-relaxed text-foreground/90">{back}</p>
            </CardContent>
            <div className="absolute bottom-6 inset-x-0 flex justify-center">
               <div className="h-1 w-12 bg-primary/20 rounded-full" />
            </div>
          </Card>
        </motion.div>
      </button>
    </div>
  )
}
