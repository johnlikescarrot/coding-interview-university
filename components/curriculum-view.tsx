"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { useProgress } from "@/components/progress-provider"
import { Section } from "@/lib/types"

interface CurriculumViewProps {
  sections: Section[]
}

export function CurriculumView({ sections }: CurriculumViewProps) {
  const { completed, toggleTopic, setTotalTopics } = useProgress()

  const validSections = React.useMemo(() =>
    sections.filter(s => s.topics.length > 0),
  [sections])

  // Calculate total topics
  React.useEffect(() => {
    const total = validSections.reduce((acc, section) => acc + section.topics.length, 0)
    setTotalTopics(total)
  }, [validSections, setTotalTopics])

  return (
    <div className="space-y-12">
      {validSections.map((section, sidx) => (
        <section key={`${section.title}-${sidx}`} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">{section.title}</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {section.topics.map((topic) => (
              <AccordionItem key={topic.id} value={topic.id} className="border rounded-xl px-4 bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="flex items-center gap-4">
                  <div className="flex items-center h-14">
                    <Checkbox
                        id={`check-${topic.id}`}
                        checked={completed.includes(topic.id)}
                        onCheckedChange={() => toggleTopic(topic.id)}
                        aria-label={`Mark ${topic.title} as completed`}
                    />
                  </div>
                  <AccordionTrigger className="flex-1 hover:no-underline py-4 text-left">
                    <span className={completed.includes(topic.id) ? "line-through text-muted-foreground transition-all" : "font-medium transition-all"}>
                        {topic.title}
                    </span>
                  </AccordionTrigger>
                </div>
                <AccordionContent className="pb-6">
                  <div className="pl-10 space-y-4">
                    {topic.resources.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {topic.resources.map((res) => (
                          <a
                            key={res.url}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group"
                          >
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                                {res.type}
                            </span>
                            <span className="text-sm font-medium truncate flex-1">{res.title}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No specific resources linked for this topic yet.</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </div>
  )
}
