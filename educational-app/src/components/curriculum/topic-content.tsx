"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, PlayCircle, FileText, Book, Circle } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'other';
}

interface SubTopic {
  title: string;
  slug: string;
  items: string[];
  resources: Resource[];
}

interface Topic {
  title: string;
  slug: string;
  subtopics: SubTopic[];
}

export function TopicContent({ topic }: { topic: Topic }) {
  const { isSubTopicCompleted, toggleSubTopic, getProgressForTopic } = useProgress();

  const subTopicSlugs = topic.subtopics.map(s => s.slug);
  const completedCount = topic.subtopics.filter(s => isSubTopicCompleted(s.slug)).length;
  const progress = getProgressForTopic(subTopicSlugs);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <Badge variant="secondary" className="mb-2">Module Mastery ({progress}%)</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">{topic.title}</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full">
          <div className="flex items-center gap-1 font-medium">
             <CheckCircle2 className="h-4 w-4 text-green-500" />
             <span>{completedCount} / {topic.subtopics.length} Completed</span>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {topic.subtopics.map((subtopic) => {
          const isDone = isSubTopicCompleted(subtopic.slug);

          return (
            <AccordionItem key={subtopic.slug} value={subtopic.slug} className={`border rounded-xl px-4 transition-colors ${isDone ? 'bg-green-500/5 border-green-500/20' : 'bg-card/50 hover:bg-card'}`}>
              <div className="flex items-center gap-4 w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubTopic(subtopic.slug);
                  }}
                >
                  {isDone ? <CheckCircle2 className="h-6 w-6 text-green-500 fill-green-500/20" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                </Button>
                <AccordionTrigger className="hover:no-underline py-6 flex-1">
                  <div className="flex items-center gap-3 text-left">
                    <div>
                      <div className={`font-bold text-lg ${isDone ? 'text-green-500 line-through decoration-2' : ''}`}>{subtopic.title}</div>
                      <div className="text-xs text-muted-foreground font-normal">
                        {subtopic.resources.length} resources available
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
              </div>
              <AccordionContent className="pb-6 pt-2 pl-14">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Key Concepts
                    </h3>
                    <ScrollArea className="h-48 rounded-md border p-4 bg-muted/20">
                      <ul className="space-y-2">
                        {subtopic.items.map((item, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Learning Resources
                    </h3>
                    <div className="grid gap-2">
                      {subtopic.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-primary/5 hover:border-primary/50 transition-all"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {res.type === 'video' ? <PlayCircle className="h-4 w-4 text-red-500 shrink-0" /> : res.type === 'book' ? <Book className="h-4 w-4 text-blue-500 shrink-0" /> : <FileText className="h-4 w-4 text-green-500 shrink-0" />}
                            <span className="text-sm font-medium truncate">{res.title}</span>
                          </div>
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
