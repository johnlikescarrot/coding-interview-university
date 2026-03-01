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

export default function Roadmap({ topics }: { topics: CurriculumTopic[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">CS Curriculum</h2>
          <p className="text-muted-foreground">Track your journey to becoming a software engineer.</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          75% Complete
        </Badge>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {topics.map((topic) => (
          <AccordionItem key={topic.id} value={topic.id} className="border rounded-xl px-6 bg-card">
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex flex-1 items-center gap-4 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {topic.subtopics.length > 0 ? topic.subtopics.length : topic.checkboxes?.length || 0}
                </div>
                <div>
                  <div className="text-lg font-semibold">{topic.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {topic.subtopics.length} sub-modules available
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6 pt-2">
              <div className="grid gap-6">
                {topic.checkboxes && topic.checkboxes.length > 0 && (
                  <div className="grid gap-4 pl-4 border-l-2 border-primary/20">
                    {topic.checkboxes.map((check, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Checkbox id={`${topic.id}-${idx}`} checked={check.completed} />
                        <label
                          htmlFor={`${topic.id}-${idx}`}
                          className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                           {sub.links.map((link, lIdx) => (
                             <a
                               key={lIdx}
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
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
