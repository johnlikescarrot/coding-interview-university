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

export default function Roadmap({ topics }: { topics: CurriculumTopic[] }) {
  const { completedCheckboxes, toggleCheckbox } = useProgressStore()

  const totalCheckboxes = React.useMemo(() => {
    let count = 0
    topics.forEach(t => {
      count += t.checkboxes?.length || 0
      t.subtopics.forEach(st => {
        count += st.checkboxes?.length || 0
      })
    })
    return count
  }, [topics])

  const completedCount = React.useMemo(() => {
    return Object.values(completedCheckboxes).filter(Boolean).length
  }, [completedCheckboxes])

  const progressPercent = totalCheckboxes > 0
    ? Math.round((completedCount / totalCheckboxes) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CS Curriculum</h2>
          <p className="text-muted-foreground">Track your journey to becoming a software engineer.</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1 font-mono">
          {progressPercent}% Complete
        </Badge>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.id} className="border rounded-xl px-6 bg-card">
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex flex-1 items-center gap-4 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {topic.subtopics.length > 0 ? topic.subtopics.length : (topic.checkboxes?.length || 0)}
                </div>
                <div>
                  <div className="text-lg font-semibold">{topic.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {topic.subtopics.length} sub-modules
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="grid gap-6">
                {topic.checkboxes && topic.checkboxes.length > 0 && (
                  <div className="grid gap-4 pl-4 border-l-2 border-primary/20">
                    {topic.checkboxes.map((check) => (
                      <div key={check.id} className="flex items-center space-x-3 group">
                        <Checkbox
                          id={check.id}
                          checked={!!completedCheckboxes[check.id]}
                          onCheckedChange={() => toggleCheckbox(topic.id, check.id)}
                        />
                        <label
                          htmlFor={check.id}
                          className="text-base font-medium leading-none cursor-pointer group-hover:text-primary transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {check.text}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {topic.subtopics.length > 0 && (
                   <div className="space-y-4 pl-4">
                     {topic.subtopics.map(sub => (
                       <div key={sub.id} className="border-t pt-4 first:border-0 first:pt-0">
                         <h4 className="font-semibold mb-2">{sub.title}</h4>
                         <div className="grid gap-2 text-sm text-muted-foreground">
                           {sub.links.map((link) => (
                             <a
                               key={link.url}
                               href={link.url}
                               className="hover:text-primary underline underline-offset-4 transition-colors"
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
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
