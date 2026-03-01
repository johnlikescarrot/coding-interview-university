"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CurriculumTopic } from "@/lib/parser"
import { useProgressStore } from "@/store/useProgressStore"

interface RoadmapProps {
  topics: CurriculumTopic[]
}

export default function Roadmap({ topics }: RoadmapProps) {
  const { completedCheckboxes, toggleCheckbox } = useProgressStore()

  const { total, completed } = React.useMemo(() => {
    let totalCount = 0
    let completedCount = 0

    // Only count depth 1 and depth 2 (subtopics) to match UI rendering
    topics.forEach(t => {
      // Depth 1
      t.checkboxes?.forEach(c => {
        totalCount++
        if (completedCheckboxes[c.id]) completedCount++
      })

      // Depth 2
      t.subtopics?.forEach(sub => {
        sub.checkboxes?.forEach(c => {
          totalCount++
          if (completedCheckboxes[c.id]) completedCount++
        })
      })
    })

    return { total: totalCount, completed: completedCount }
  }, [topics, completedCheckboxes])

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Curriculum Roadmap</h2>
          <p className="text-muted-foreground">Follow the structured path to mastery.</p>
        </div>
        <Badge variant="secondary" className="px-4 py-1 text-sm font-semibold">
          {percentage}% Complete
        </Badge>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {topics.map((topic) => {
          const itemCount = (topic.checkboxes?.length || 0) + topic.subtopics.length;

          return (
            <AccordionItem
              key={topic.id}
              value={topic.id}
              className="border-2 rounded-xl px-4 bg-card shadow-sm data-[state=open]:border-primary/50 transition-all"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 text-sm font-bold">
                    {itemCount > 0 ? itemCount : "-"}
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-lg leading-none">{topic.title}</div>
                    {topic.checkboxes && (
                      <div className="text-xs text-muted-foreground font-medium">
                        {topic.checkboxes.filter(c => completedCheckboxes[c.id]).length} / {topic.checkboxes.length} Tasks
                      </div>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-6 pt-2">
                  {topic.checkboxes && topic.checkboxes.length > 0 && (
                    <div className="grid gap-4 pl-4 border-l-2 border-primary/20">
                      {topic.checkboxes.map((check) => (
                        <div key={check.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={check.id}
                            checked={!!completedCheckboxes[check.id]}
                            onCheckedChange={() => toggleCheckbox(check.id)}
                          />
                          <label
                            htmlFor={check.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {check.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {topic.subtopics.length > 0 && (
                    <div className="space-y-4">
                      <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70 pl-4">
                        Modules & Resources
                      </div>
                      <div className="grid gap-4 pl-4 border-l-2 border-primary/10">
                        {topic.subtopics.map((sub) => (
                          <div key={sub.id} className="space-y-2">
                            <div className="font-semibold text-sm">{sub.title}</div>
                            {sub.checkboxes && sub.checkboxes.length > 0 && (
                              <div className="grid gap-2 pl-4">
                                {sub.checkboxes.map((check) => (
                                  <div key={check.id} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={check.id}
                                      checked={!!completedCheckboxes[check.id]}
                                      onCheckedChange={() => toggleCheckbox(check.id)}
                                    />
                                    <label htmlFor={check.id} className="text-xs text-muted-foreground cursor-pointer">
                                      {check.text}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                              {sub.links.map((link, lIdx) => (
                                <a
                                  key={`${sub.id}-${lIdx}-${link.url}`}
                                  href={link.url}
                                  className="hover:text-primary underline underline-offset-4"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {link.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  )
}
