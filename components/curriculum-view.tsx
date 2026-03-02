"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { useProgress } from "@/components/progress-provider"
import { Section } from "@/lib/parser"
import { ExternalLink, PlayCircle, BookOpen, Monitor, FileText, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CurriculumViewProps {
  sections: Section[]
}

const iconMap = {
  video: PlayCircle,
  book: BookOpen,
  interactive: Monitor,
  article: FileText,
  other: ExternalLink
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
        <motion.section
          key={`${section.title}-${sidx}`}
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: sidx * 0.1 }}
        >
          <div className="space-y-3 relative">
            <div className="absolute left-[-20px] top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
            <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              {section.title}
            </h2>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">
              Section {sidx + 1} • {section.topics.length} Mastery Points
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {section.topics.map((topic) => {
              const isCompleted = completed.includes(topic.id);

              return (
                <AccordionItem
                  key={topic.id}
                  value={topic.id}
                  className={cn(
                    "border rounded-2xl px-6 bg-card/40 backdrop-blur-sm transition-all duration-300 overflow-hidden",
                    isCompleted ? "border-primary/20 bg-primary/[0.02]" : "border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex items-center h-16">
                      <Checkbox
                        id={`check-${topic.id}`}
                        checked={isCompleted}
                        onCheckedChange={() => toggleTopic(topic.id)}
                        className="h-5 w-5 rounded-md border-2"
                        aria-label={`Mark ${topic.title} as completed`}
                      />
                    </div>
                    <AccordionTrigger className="flex-1 hover:no-underline py-5 text-left group">
                      <div className="flex flex-col gap-1">
                        <span className={cn(
                          "text-lg font-bold transition-all duration-300",
                          isCompleted ? "line-through text-muted-foreground opacity-60" : "text-foreground group-hover:text-primary"
                        )}>
                            {topic.title}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
                            <CheckCircle2 className="h-3 w-3" /> Mastered
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="pb-8">
                    <div className="pl-11 space-y-6">
                      {topic.resources.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                          {topic.resources.map((res, ridx) => {
                            const Icon = iconMap[res.type as keyof typeof iconMap] || ExternalLink;
                            return (
                              <motion.a
                                key={res.url}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-primary/[0.05] hover:border-primary/40 transition-all group"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: ridx * 0.05 }}
                              >
                                <div className="p-2.5 rounded-lg bg-background border border-border/50 group-hover:border-primary/30 transition-colors shadow-sm">
                                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-primary/70 transition-colors tracking-tighter">
                                      {res.type}
                                  </span>
                                  <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                                    {res.title}
                                  </span>
                                </div>
                                <ExternalLink className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                              </motion.a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 rounded-xl border border-dashed border-border/60 text-center">
                          <p className="text-sm text-muted-foreground italic font-medium">Resources for this challenge are emerging. Stay sharp.</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.section>
      ))}
    </div>
  )
}
