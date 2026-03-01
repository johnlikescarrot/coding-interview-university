"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DEFAULT_CARDS = [
  { q: "What is the time complexity of a binary search?", a: "O(log n)" },
  { q: "What are the four basic ways to represent a graph in memory?", a: "Objects and pointers, adjacency matrix, adjacency list, and adjacency map." },
  { q: "What is the difference between a process and a thread?", a: "A process is an instance of a program in execution, whereas a thread is a unit of execution within a process. Threads share the process's memory space." }
]

interface FlashcardsProps {
  cards?: { q: string; a: string }[]
}

export default function Flashcards({ cards = DEFAULT_CARDS }: FlashcardsProps) {
  const [index, setIndex] = React.useState(0)
  const [flipped, setFlipped] = React.useState(false)

  const next = () => {
    setFlipped(false)
    setIndex((prev) => (prev + 1) % cards.length)
  }

  const prev = () => {
    setFlipped(false)
    setIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFlipped(!flipped)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-8 py-12">
       <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Active Recall</h2>
          <p className="text-muted-foreground">Master CS fundamentals with interactive flashcards.</p>
       </div>

       <div
         role="button"
         tabIndex={0}
         aria-label={flipped ? "Flipped to answer. Click to see question." : "Click to see answer."}
         aria-pressed={flipped}
         onKeyDown={handleKeyDown}
         className="relative h-[300px] w-full perspective-1000 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
         onClick={() => setFlipped(!flipped)}
       >
          <AnimatePresence mode="wait">
            <motion.div
              key={index + (flipped ? '-back' : '-front')}
              initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <Card className="w-full h-full flex items-center justify-center p-8 text-center shadow-xl border-2 border-primary/20">
                <CardContent className="p-0">
                  <div className="text-sm font-medium uppercase tracking-widest text-primary/60 mb-4">
                    {flipped ? 'Answer' : 'Question'}
                  </div>
                  <div className="text-xl font-semibold">
                    {flipped ? cards[index].a : cards[index].q}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
       </div>

       <div className="flex items-center justify-between px-4">
         <Button
           variant="outline"
           size="icon"
           onClick={prev}
           aria-label="Previous card"
         >
           <ChevronLeft className="h-4 w-4" />
         </Button>
         <div className="text-sm font-medium text-muted-foreground">
           Card {index + 1} of {cards.length}
         </div>
         <Button
           variant="outline"
           size="icon"
           onClick={next}
           aria-label="Next card"
         >
           <ChevronRight className="h-4 w-4" />
         </Button>
       </div>

       <div className="flex justify-center">
         <Button variant="ghost" onClick={() => { setIndex(0); setFlipped(false); }} aria-label="Restart deck">
           <RotateCcw className="mr-2 h-4 w-4" />
           Restart Deck
         </Button>
       </div>
    </div>
  )
}
