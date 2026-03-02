"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { useProgress } from "@/components/progress-provider"
import { Section } from "@/lib/parser"
import { Play, Book, Zap, FileText, HelpCircle, type LucideIcon } from "lucide-react"

interface CurriculumViewProps {
  sections: Section[]
}

const iconMap: Record<string, LucideIcon> = {
  video: Play,
  book: Book,
  interactive: Zap,
  article: FileText,
  other: HelpCircle,
}

export function CurriculumView({ sections }: CurriculumViewProps) {
  const { completed, toggleTopic, setTotalTopics } = useProgress()

  const validSections = React.useMemo(() =>
    sections.filter(s => s.topics.length > 0),
  [sections])

  React.useEffect(() => {
    const total = validSections.reduce((acc, section) => acc + section.topics.length, 0)
    setTotalTopics(total)
  }, [validSections, setTotalTopics])

  return (
    <div className="space-y-16 pb-20">
      {validSections.map((section, sidx) => (
        <motion.div
          key={`${section.title}-${sidx}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <section className="space-y-8">
            <div className="space-y-3 relative">
              <h2 className="text-4xl font-black tracking-tighter text-foreground group flex items-center gap-4">
                <span className="opacity-20 text-5xl font-outline-2 select-none">{(sidx + 1).toString().padStart(2, '0')}</span>
                {section.title}
              </h2>
              <div className="h-1.5 w-24 bg-primary rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {section.topics.map((topic) => (
                <AccordionItem
                  key={topic.id}
                  value={topic.id}
                  className="border-border/40 rounded-2xl px-5 bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all overflow-hidden border hover:border-primary/20 group"
                  data-testid="curriculum-item"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex items-center h-16">
                      <Checkbox
                          id={`check-${topic.id}`}
                          checked={completed.includes(topic.id)}
                          onCheckedChange={() => toggleTopic(topic.id)}
                          className="h-5 w-5 rounded-lg border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all scale-110"
                          aria-label={`Mark ${topic.title} as completed`}
                      />
                    </div>
                    <AccordionTrigger className="flex-1 hover:no-underline py-5 text-left group">
                      <span className={completed.includes(topic.id) ? "line-through text-muted-foreground opacity-50 font-medium transition-all" : "font-bold text-lg tracking-tight transition-all group-hover:text-primary"}>
                          {topic.title}
                      </span>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="pb-8">
                    <div className="pl-12 space-y-5">
                      {topic.resources.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                          {topic.resources.map((res, ridx) => {
                            const Icon = iconMap[res.type] || iconMap.other;
                            return (
                              <motion.div
                                key={res.url}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: ridx * 0.05 }}
                              >
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-muted/30 hover:bg-primary/5 hover:border-primary/30 transition-all group/link shadow-xs"
                                >
                                  <div className="p-2 rounded-lg bg-background/50 text-primary group-hover/link:scale-110 transition-transform shadow-xs">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-0.5">{res.type}</span>
                                    <span className="text-sm font-bold truncate tracking-tight">{res.title}</span>
                                  </div>
                                </a>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/10 text-center">
                          <p className="text-sm text-muted-foreground font-medium italic opacity-60">No specific resources linked for this neural pathway yet.</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </motion.div>
      ))}
    </div>
  )
}
