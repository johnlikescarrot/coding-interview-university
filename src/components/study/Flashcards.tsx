"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

interface Flashcard {
  q: string
  a: string
}

interface FlashcardsProps {
  cards: Flashcard[]
  labels: {
    title: string
    subtitle: string
    question: string
    answer: string
    next: string
    prev: string
    reset: string
    flip: string
  }
}

export default function Flashcards({
  cards,
  labels
}: FlashcardsProps) {
  const [shuffledCards, setShuffledCards] = React.useState<Flashcard[]>([])
  const [currentIdx, setCurrentIdx] = React.useState(0)
  const [isFlipped, setIsFlipped] = React.useState(false)

  const shuffle = React.useCallback((deck: Flashcard[]) => {
    const newDeck = [...deck]
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]]
    }
    return newDeck
  }, [])

  // Sync and shuffle
  React.useEffect(() => {
    setShuffledCards(shuffle(cards))
    setCurrentIdx(0)
    setIsFlipped(false)
  }, [cards, shuffle])

  // Bounds-safe index calculation
  const safeIdx = React.useMemo(() => {
    if (shuffledCards.length === 0) return 0
    return Math.max(0, Math.min(currentIdx, shuffledCards.length - 1))
  }, [currentIdx, shuffledCards.length])

  const next = () => {
    if (shuffledCards.length === 0) return
    setIsFlipped(false)
    setCurrentIdx((prev) => (prev + 1) % shuffledCards.length)
  }

  const prev = () => {
    if (shuffledCards.length === 0) return
    setIsFlipped(false)
    setCurrentIdx((prev) => (prev - 1 + shuffledCards.length) % shuffledCards.length)
  }

  const reset = () => {
    setIsFlipped(false)
    setShuffledCards(shuffle(cards))
    setCurrentIdx(0)
  }

  const toggleFlip = () => setIsFlipped((prev) => !prev)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleFlip()
    }
  }

  if (shuffledCards.length === 0) return null

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{labels.title}</h2>
        <p className="text-muted-foreground">{labels.subtitle}</p>
      </div>

      <div className="relative w-full max-w-md h-64 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${safeIdx}-${isFlipped}`}
            initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            onClick={toggleFlip}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={isFlipped ? labels.answer : `${labels.question}, ${labels.flip}`}
          >
            <Card className="w-full h-full flex items-center justify-center text-center p-8 bg-card/50 backdrop-blur border-primary/20">
              <CardContent className="p-0">
                <p className="text-xl font-medium leading-relaxed">
                  {isFlipped ? shuffledCards[safeIdx].a : shuffledCards[safeIdx].q}
                </p>
                <p className="mt-4 text-xs text-muted-foreground uppercase tracking-widest">
                  {isFlipped ? labels.answer : labels.question}
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
          disabled={shuffledCards.length <= 1}
          aria-label={labels.prev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium tabular-nums">
          {safeIdx + 1} / {shuffledCards.length}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={next}
          disabled={shuffledCards.length <= 1}
          aria-label={labels.next}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={reset} aria-label={labels.reset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
