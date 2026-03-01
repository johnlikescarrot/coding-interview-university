"use client"

import * as React from "react"
import DashboardShell from "@/components/layout/DashboardShell"
import Roadmap from "@/components/curriculum/Roadmap"
import SofaWhiteboard from "@/components/whiteboard/SofaWhiteboard"
import Flashcards from "@/components/study/Flashcards"
import { CurriculumTopic } from "@/lib/parser"
import { useProgressStore } from "@/store/useProgressStore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

const TOPIC_LIMIT = 20

const FLASHCARD_LABELS: Record<string, { title: string; subtitle: string; question: string; answer: string; next: string; prev: string; reset: string; flip: string }> = {
  en: {
    title: "Active Recall",
    subtitle: "Test your knowledge with randomized flashcards.",
    question: "Question",
    answer: "Answer",
    next: "Next card",
    prev: "Previous card",
    reset: "Reset deck",
    flip: "click to see answer"
  },
  es: {
    title: "Recuerdo Activo",
    subtitle: "Pon a prueba tus conocimientos con tarjetas aleatorias.",
    question: "Pregunta",
    answer: "Respuesta",
    next: "Siguiente tarjeta",
    prev: "Tarjeta anterior",
    reset: "Reiniciar mazo",
    flip: "clic para ver respuesta"
  },
  cn: {
    title: "主动回想",
    subtitle: "通过随机闪卡测试您的知识。",
    question: "问题",
    answer: "答案",
    next: "下一张",
    prev: "上一张",
    reset: "重置卡组",
    flip: "点击查看答案"
  },
  ja: {
    title: "アクティブリコール",
    subtitle: "ランダムなフラッシュカードで知識をテストしましょう。",
    question: "問題",
    answer: "解答",
    next: "次のカード",
    prev: "前のカード",
    reset: "デッキをリセット",
    flip: "クリックして回答を表示"
  }
}

export default function Home() {
  const { language } = useProgressStore()
  const [topics, setTopics] = React.useState<CurriculumTopic[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [retryCount, setRetryCount] = React.useState(0)

  const fetchData = React.useCallback(async (lang: string, signal: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/data/curriculum-${lang}.json`, { signal })
      if (!res.ok) {
        throw new Error(`Failed to load curriculum: ${res.status} ${res.statusText}`)
      }
      const data = await res.json()
      if (!signal.aborted) {
        setTopics(data)
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError' && !signal.aborted) {
        console.error("Failed to fetch curriculum", err)
        setError(err.message || "An unexpected error occurred while loading the curriculum.")
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false)
      }
    }
  }, [])

  React.useEffect(() => {
    const controller = new AbortController()
    fetchData(language, controller.signal)
    return () => controller.abort()
  }, [language, fetchData, retryCount])

  return (
    <DashboardShell>
      <div className="space-y-24 pb-24">
        <section id="curriculum">
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" onClick={() => setRetryCount(c => c + 1)}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Roadmap topics={topics.slice(0, TOPIC_LIMIT)} />
          )}
        </section>

        <section id="whiteboard">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Practice Arena</h2>
            <p className="text-muted-foreground">Sharpen your logic with the Sofa Whiteboard.</p>
          </div>
          <div className="h-[600px]">
            <SofaWhiteboard />
          </div>
        </section>

        <section id="flashcards">
          <Flashcards labels={FLASHCARD_LABELS[language]} />
        </section>
      </div>
    </DashboardShell>
  )
}
