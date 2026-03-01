"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

const SAMPLE_CARDS = [
  { q: "What is the time complexity of binary search?", a: "O(log n)" },
  { q: "What data structure is used in Breadth-First Search (BFS)?", a: "Queue" },
  { q: "What are the four pillars of OOP?", a: "Encapsulation, Abstraction, Inheritance, Polymorphism" },
]

interface FlashcardsProps {
  cards?: { q: string; a: string }[]
}

export default function Flashcards({ cards = SAMPLE_CARDS }: FlashcardsProps) {
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [isFlipped, setIsFlipped] = React.useState(false)

  const next = () => {
    setIsFlipped(false)
    setCurrentIdx((prev) => (prev + 1) % cards.length)
  }

  const prev = () => {
    setIsFlipped(false)
    setCurrentIdx((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const reset = () => {
    setIsFlipped(false)
    setCurrentIdx(0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsFlipped(!isFlipped)
    }
  }

  if (cards.length === 0) return null

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Active Recall</h2>
        <p className="text-muted-foreground">Test your knowledge with randomized flashcards.</p>
      </div>

      <div className="relative w-full max-w-md h-64 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIdx}-${isFlipped}`}
            initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            onClick={() => setIsFlipped(!isFlipped)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? "Answer side" : "Question side, click to see answer"}
          >
            <Card className="w-full h-full flex items-center justify-center text-center p-8 bg-card/50 backdrop-blur border-primary/20">
              <CardContent className="p-0">
                <p className="text-xl font-medium leading-relaxed">
                  {isFlipped ? cards[currentIdx].a : cards[currentIdx].q}
                </p>
                <p className="mt-4 text-xs text-muted-foreground uppercase tracking-widest">
                  {isFlipped ? "Answer" : "Question"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          disabled={cards.length <= 1}
          aria-label="Previous card"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium tabular-nums">
          {currentIdx + 1} / {cards.length}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          disabled={cards.length <= 1}
          aria-label="Next card"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={reset} aria-label="Reset deck">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
