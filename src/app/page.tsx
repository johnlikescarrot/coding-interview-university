"use client"

import * as React from "react"
import DashboardShell from "@/components/layout/DashboardShell"
import { Skeleton } from "@/components/ui/skeleton"
import Roadmap from "@/components/curriculum/Roadmap"
import SofaWhiteboard from "@/components/whiteboard/SofaWhiteboard"
import Flashcards from "@/components/study/Flashcards"
import { useProgressStore } from "@/store/useProgressStore"
import { CurriculumTopic } from "@/lib/parser"

interface LabelSet {
  title: string
  subtitle: string
  question: string
  answer: string
  next: string
  prev: string
  reset: string
  flip: string
}

const FLASHCARD_LABELS: Record<string, LabelSet> = {
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

interface ArenaLabel {
  title: string
  subtitle: string
}

const ARENA_LABELS: Record<string, ArenaLabel> = {
  en: { title: "Practice Arena", subtitle: "Sharpen your logic with the Sofa Whiteboard." },
  es: { title: "Campo de Práctica", subtitle: "Afina tu lógica con la Pizarra Sofa." },
  cn: { title: "演武场", subtitle: "使用 Sofa 白板磨练你的逻辑。" },
  ja: { title: "演習場", subtitle: "Sofa ホワイトボードで論理を磨きましょう。" },
}

interface UILabels {
  errorTitle: string
}

const UI_LABELS: Record<string, UILabels> = {
  en: { errorTitle: "Error Loading Content" },
  es: { errorTitle: "Error al cargar contenido" },
  cn: { errorTitle: "内容加载错误" },
  ja: { errorTitle: "コンテンツの読み込みエラー" },
}

interface CardItem {
  q: string
  a: string
}

const FLASHCARDS: Record<string, CardItem[]> = {
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

/**
 * Type guard to validate the shape of curriculum data.
 */
function isCurriculumArray(data: any): data is CurriculumTopic[] {
  return Array.isArray(data) && data.every(item =>
    typeof item === 'object' &&
    'id' in item &&
    'title' in item &&
    Array.isArray(item.subtopics)
  );
}

export default function HomePage() {
  const [topics, setTopics] = React.useState<CurriculumTopic[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { language } = useProgressStore()

  // Validate locale and fallback
  const locale = Object.prototype.hasOwnProperty.call(ARENA_LABELS, language) ? language : 'en'

  React.useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    setIsLoading(true)
    setError(null)

    // Robust fetch URL construction preserving protocol
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    const dataPath = `/data/curriculum-${locale}.json`

    let fetchUrl = ''
    if (basePath.includes('://')) {
      const parts = basePath.split('://', 2)
      const protocol = parts[0]
      const rest = parts[1]
      const joinedRest = `${rest}/${dataPath}`.replace(/\/+/g, '/')
      fetchUrl = `${protocol}://${joinedRest}`
    } else {
      fetchUrl = `${basePath}/${dataPath}`.replace(/\/+/g, '/')
    }

    fetch(fetchUrl, { signal })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch curriculum: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (signal.aborted) return;

        if (isCurriculumArray(data)) {
          setTopics(data)
          setError(null)
        } else {
          console.error("Malformed curriculum data received", data)
          setError("Malformed data structure received from server.")
        }
        setIsLoading(false)
      })
      .catch(err => {
        if (!signal.aborted) {
          console.error("Failed to fetch curriculum", err)
          setError(err.message || "An unexpected error occurred.")
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [locale])

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
            <div className="p-8 text-center bg-destructive/10 rounded-xl border border-destructive/20 shadow-sm">
              <p className="text-destructive font-bold text-lg mb-1">{UI_LABELS[locale]?.errorTitle || UI_LABELS.en.errorTitle}</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-xs font-semibold underline underline-offset-4 hover:text-primary transition-colors"
              >
                Try reloading the page
              </button>
            </div>
          ) : (
            <Roadmap topics={topics} />
          )}
        </section>

        <section id="whiteboard">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">{ARENA_LABELS[locale].title}</h2>
            <p className="text-muted-foreground">{ARENA_LABELS[locale].subtitle}</p>
          </div>
          <div className="h-[600px]">
            <SofaWhiteboard />
          </div>
        </section>

        <section id="flashcards">
          <Flashcards
            cards={FLASHCARDS[locale] || FLASHCARDS.en}
            labels={FLASHCARD_LABELS[locale] || FLASHCARD_LABELS.en}
          />
        </section>
      </div>
    </DashboardShell>
  )
}
