"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

// Fisher-Yates Shuffle
function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function Flashcards({ cards, labels }: FlashcardsProps) {
  const [shuffledCards, setShuffledCards] = React.useState<Flashcard[]>(() => shuffle(cards))
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isFlipped, setIsFlipped] = React.useState(false)
  const [direction, setDirection] = React.useState(0)

  // Sync shuffled cards if the input cards change (e.g., language change)
  React.useEffect(() => {
    setShuffledCards(shuffle(cards))
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [cards])

  if (!cards || cards.length === 0) return null

  const safeIdx = Math.min(currentIndex, shuffledCards.length - 1)
  const currentCard = shuffledCards[safeIdx] || cards[0]

  const next = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setDirection(1)
      setIsFlipped(false)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setIsFlipped(false)
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const reset = () => {
    setShuffledCards(shuffle(cards))
    setCurrentIndex(0)
    setIsFlipped(false)
    setDirection(0)
  }

  const toggleFlip = () => setIsFlipped((prev) => !prev)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      toggleFlip()
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      rotateY: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: isFlipped ? 180 : 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-2xl mx-auto px-4 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{labels.title}</h2>
        <p className="text-muted-foreground">{labels.subtitle}</p>
      </div>

      <div className="relative w-full aspect-video perspective-[1000px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              rotateY: { duration: 0.4 },
            }}
            className="absolute inset-0 transform-3d cursor-pointer"
            onClick={toggleFlip}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${isFlipped ? labels.answer : labels.question}, ${labels.flip}`}
          >
            {/* Front Side */}
            <Card className="absolute inset-0 backface-hidden flex items-center justify-center p-8 bg-card border-2 shadow-xl hover:border-primary/50 transition-colors overflow-hidden">
              <CardContent className="text-center p-0">
                <span className="text-xs font-bold uppercase tracking-widest text-primary/50 mb-4 block">
                  {labels.question}
                </span>
                <p className="text-2xl md:text-3xl font-medium leading-tight">
                  {currentCard.q}
                </p>
              </CardContent>
            </Card>

            {/* Back Side */}
            <Card className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center p-8 bg-primary text-primary-foreground border-2 border-primary shadow-xl overflow-hidden">
              <CardContent className="text-center p-0">
                <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/50 mb-4 block">
                  {labels.answer}
                </span>
                <p className="text-2xl md:text-3xl font-medium leading-tight">
                  {currentCard.a}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prev}
          disabled={currentIndex === 0}
          className="rounded-full h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all"
          aria-label={labels.prev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-bold tabular-nums bg-secondary px-3 py-1 rounded-full">
            {currentIndex + 1} / {shuffledCards.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-xs opacity-50 hover:opacity-100 flex items-center"
            aria-label={labels.reset}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {labels.reset}
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={next}
          disabled={currentIndex === shuffledCards.length - 1}
          className="rounded-full h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground transition-all"
          aria-label={labels.next}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
