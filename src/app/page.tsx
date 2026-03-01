"use client"

import * as React from "react"
import DashboardShell from "@/components/layout/DashboardShell"
import { Skeleton } from "@/components/ui/skeleton"
import Roadmap from "@/components/curriculum/Roadmap"
import SofaWhiteboard from "@/components/whiteboard/SofaWhiteboard"
import Flashcards from "@/components/study/Flashcards"
import { useProgressStore } from "@/store/useProgressStore"
import { CurriculumTopic } from "@/lib/parser"

const FLASHCARD_LABELS = {
  en: {
    title: "Active Recall",
    subtitle: "Quick-fire conceptual challenges to solidify your understanding.",
    question: "Question",
    answer: "Answer",
    next: "Next card",
    prev: "Previous card",
    reset: "Shuffle deck",
    flip: "Press Space or Enter to flip",
  },
  es: {
    title: "Recuerdo Activo",
    subtitle: "Desafíos conceptuales rápidos para consolidar tu comprensión.",
    question: "Pregunta",
    answer: "Respuesta",
    next: "Siguiente",
    prev: "Anterior",
    reset: "Barajar mazo",
    flip: "Pulsa Espacio o Enter para voltear",
  },
  cn: {
    title: "主动回忆",
    subtitle: "快速的概念挑战，巩固你的理解。",
    question: "问题",
    answer: "答案",
    next: "下一张",
    prev: "上一张",
    reset: "打乱卡片",
    flip: "按空格或回车翻转",
  },
  ja: {
    title: "アクティブリコール",
    subtitle: "理解を深めるための、スピーディーな概念チャレンジ。",
    question: "問題",
    answer: "解答",
    next: "次へ",
    prev: "前へ",
    reset: "シャッフル",
    flip: "スペースまたはEnterで裏返す",
  },
}

const ARENA_LABELS = {
  en: { title: "Practice Arena", subtitle: "Sharpen your logic with the Sofa Whiteboard." },
  es: { title: "Campo de Práctica", subtitle: "Afina tu lógica con la Pizarra Sofa." },
  cn: { title: "演武场", subtitle: "使用 Sofa 白板磨练你的逻辑。" },
  ja: { title: "演習場", subtitle: "Sofa ホワイトボードで論理を磨きましょう。" },
}

const FLASHCARDS = {
  en: [
    { q: "What is Big O notation used for?", a: "To describe the upper bound of an algorithm's time or space complexity." },
    { q: "What is the average time complexity of Quick Sort?", a: "O(n log n)" },
    { q: "Describe the LIFO principle in a Stack.", a: "Last-In, First-Out: The most recently added element is the first one to be removed." },
  ],
  es: [
    { q: "¿Para qué se usa la notación Big O?", a: "Para describir el límite superior de la complejidad de tiempo o espacio de un algoritmo." },
    { q: "¿Cuál es la complejidad de tiempo promedio de Quick Sort?", a: "O(n log n)" },
    { q: "Describe el principio LIFO en una Pila.", a: "Last-In, First-Out: El último elemento en entrar es el primero en salir." },
  ],
  cn: [
    { q: "大 O 表示法用于什么？", a: "描述算法时间或空间复杂度的上界。" },
    { q: "快速排序的平均时间复杂度是多少？", a: "O(n log n)" },
    { q: "描述栈中的 LIFO 原则。", a: "后进先出：最近添加的元素是第一个被移除的。" },
  ],
  ja: [
    { q: "Big O 記法は何のために使われますか？", a: "アルゴリズムの時間または空間計算量の上限を記述するため。" },
    { q: "クイックソートの平均時間計算量は？", a: "O(n log n)" },
    { q: "スタックにおける LIFO の原則を説明してください。", a: "後入れ先出し：最後に追加された要素が最初に削除されます。" },
  ],
}

export default function HomePage() {
  const [topics, setTopics] = React.useState<CurriculumTopic[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { language } = useProgressStore()

  React.useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    fetch(`/data/curriculum-${language}.json`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch curriculum: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setTopics(data)
        setIsLoading(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error("Failed to fetch curriculum", err)
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [language])

  return (
    <DashboardShell>
      <div className="grid gap-12 pb-16">
        <section id="roadmap">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-1/4" />
              <div className="grid gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20">
              <p className="text-destructive font-semibold">Error Loading Content</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : (
            <Roadmap topics={topics} />
          )}
        </section>

        <section id="whiteboard">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">{ARENA_LABELS[language].title}</h2>
            <p className="text-muted-foreground">{ARENA_LABELS[language].subtitle}</p>
          </div>
          <div className="h-[600px]">
            <SofaWhiteboard />
          </div>
        </section>

        <section id="flashcards">
          <Flashcards
            cards={FLASHCARDS[language]}
            labels={FLASHCARD_LABELS[language]}
          />
        </section>
      </div>
    </DashboardShell>
  )
}
