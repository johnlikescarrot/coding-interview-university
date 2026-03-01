"use client"

import { useEffect } from "react"
import { Section } from "@/lib/parser"
import { useProgress } from "@/components/progress-provider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { ExternalLink, Video, FileText } from "lucide-react"

export function CurriculumView({ sections }: { sections: Section[] }) {
  const { completed, toggleTopic, setTotalTopics } = useProgress()

  useEffect(() => {
    const total = sections.reduce((acc, s) => acc + s.topics.length, 0)
    setTotalTopics(total)
  }, [sections, setTotalTopics])

  return (
    <div className="space-y-6 pb-20">
      {sections.filter(s => s.topics.length > 0).map((section, idx) => (
        <Card key={idx} className="border-none shadow-none bg-transparent">
          <h2 className="text-2xl font-bold mb-4 px-2">{section.title}</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {section.topics.map((topic) => (
              <AccordionItem key={topic.id} value={topic.id} className="border rounded-lg px-4 bg-card">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div onClick={(e) => {
                        e.stopPropagation();
                        toggleTopic(topic.id);
                    }}>
                        <Checkbox checked={completed.includes(topic.id)} />
                    </div>
                    <span className={completed.includes(topic.id) ? "line-through text-muted-foreground" : ""}>
                        {topic.title}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-4">
                  <div className="grid gap-2">
                    {topic.resources.map((res, ridx) => (
                      <a
                        key={ridx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          {res.type === 'video' ? <Video className="h-4 w-4 text-red-500" /> : <FileText className="h-4 w-4 text-blue-500" />}
                          <span className="text-sm font-medium">{res.title}</span>
                        </div>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      ))}
    </div>
  )
}
