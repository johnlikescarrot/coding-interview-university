"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import { CurriculumTopic } from "@/lib/parser"
import { useProgressStore } from "@/store/useProgressStore"
import { cn } from "@/lib/utils"

interface RoadmapProps {
  topics: CurriculumTopic[]
}

const ROADMAP_UI = {
  en: {
    title: "Your Roadmap",
    subtitle: "Follow the path to mastery, one step at a time.",
    complete: "Complete",
    tasks: "tasks",
    modules: "modules available"
  },
  es: {
    title: "Tu Hoja de Ruta",
    subtitle: "Sigue el camino hacia la maestría, paso a paso.",
    complete: "Completado",
    tasks: "tareas",
    modules: "módulos disponibles"
  },
  cn: {
    title: "学习路线图",
    subtitle: "循序渐进，迈向精通之路。",
    complete: "已完成",
    tasks: "任务",
    modules: "个可用模块"
  },
  ja: {
    title: "ロードマップ",
    subtitle: "一歩ずつ着実に、マスターへの道を歩みましょう。",
    complete: "完了",
    tasks: "タスク",
    modules: "個のモジュールが利用可能"
  }
}

export default function Roadmap({ topics }: RoadmapProps) {
  const { completedCheckboxes, toggleCheckbox, language } = useProgressStore()

  // Safe locale selection
  const locale = Object.prototype.hasOwnProperty.call(ROADMAP_UI, language) ? language : 'en'
  const labels = ROADMAP_UI[locale]

  // Mathematically accurate scoped progress calculation
  const { totalTasks, completedTasks } = React.useMemo(() => {
    let total = 0
    let completed = 0

    const traverse = (items: CurriculumTopic[]) => {
      items.forEach(item => {
        if (item.checkboxes) {
          item.checkboxes.forEach(cb => {
            total++
            if (completedCheckboxes[`${item.id}:${cb.id}`]) {
              completed++
            }
          })
        }
        traverse(item.subtopics)
      })
    }

    traverse(topics)
    return { totalTasks: total, completedTasks: completed }
  }, [topics, completedCheckboxes])

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  /**
   * Safe URL validation to prevent javascript: XSS.
   * Uses URL constructor for robust protocol parsing.
   */
  const getSafeUrl = (url: string) => {
    if (!url) return '#'
    const trimmed = url.trim()
    try {
      // Use window.location.origin as base to allow relative URLs
      const base = typeof window !== 'undefined' ? window.location.origin : 'https://example.com'
      const urlObj = new URL(trimmed, base)
      const protocol = urlObj.protocol.toLowerCase()

      // Allow only safe protocols
      if (['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
        return trimmed
      }

      // Allow internal relative paths starting with /
      if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
        return trimmed
      }

      return '#'
    } catch (e) {
      return '#'
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{labels.title}</h2>
          <p className="text-muted-foreground">{labels.subtitle}</p>
        </div>
        <Badge variant="secondary" className="px-4 py-1 text-sm font-semibold">
          {progressPercentage}% {labels.complete} ({completedTasks}/{totalTasks} {labels.tasks})
        </Badge>
      </div>

      <Accordion type="multiple" className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {topics.map((topic) => {
          const badgeCount = (topic.subtopics?.length || 0) + (topic.checkboxes?.length || 0)

          return (
            <AccordionItem
              key={topic.id}
              value={topic.id}
              className="border-none bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden px-6"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center space-x-4 text-left">
                  {badgeCount > 0 && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                      {badgeCount}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.subtopics.length} {labels.modules}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-6 pt-2">
                  {topic.checkboxes && topic.checkboxes.length > 0 && (
                    <div className="grid gap-4 pl-4 border-l-2 border-primary/20">
                      {topic.checkboxes.map((check) => {
                        const storeKey = `${topic.id}:${check.id}`
                        const isCompleted = !!completedCheckboxes[storeKey]
                        return (
                          <div key={check.id} className="flex items-center space-x-3 group">
                            <Checkbox
                              id={check.id}
                              checked={isCompleted}
                              onCheckedChange={() => toggleCheckbox(topic.id, check.id)}
                            />
                            <label
                              htmlFor={check.id}
                              className={cn(
                                "text-sm font-medium leading-none cursor-pointer transition-colors group-hover:text-primary",
                                isCompleted && "text-muted-foreground line-through decoration-primary/50"
                              )}
                            >
                              {check.text}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {topic.subtopics.map((sub) => (
                    <div key={sub.id} className="space-y-4">
                      <h4 className="font-semibold text-primary/80 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                        {sub.title}
                      </h4>
                      <div className="flex flex-wrap gap-4 ml-3">
                        {sub.links.map((link, lIdx) => (
                          <a
                            key={`${link.url}-${lIdx}`}
                            href={getSafeUrl(link.url)}
                            className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.title}
                          </a>
                        ))}
                      </div>
                      {sub.checkboxes && sub.checkboxes.length > 0 && (
                        <div className="grid gap-3 ml-3 pl-4 border-l border-primary/10">
                          {sub.checkboxes.map((subCheck) => {
                            const storeKey = `${sub.id}:${subCheck.id}`
                            const isSubCompleted = !!completedCheckboxes[storeKey]
                            return (
                              <div key={subCheck.id} className="flex items-center space-x-3 group">
                                <Checkbox
                                  id={subCheck.id}
                                  checked={isSubCompleted}
                                  onCheckedChange={() => toggleCheckbox(sub.id, subCheck.id)}
                                />
                                <label
                                  htmlFor={subCheck.id}
                                  className={cn(
                                    "text-sm leading-none cursor-pointer group-hover:text-primary",
                                    isSubCompleted && "text-muted-foreground line-through decoration-primary/40"
                                  )}
                                >
                                  {subCheck.text}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
