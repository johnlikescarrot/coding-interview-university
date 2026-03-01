"use client"

import * as React from "react"
import DashboardShell from "@/components/layout/DashboardShell";
import Roadmap from "@/components/curriculum/Roadmap";
import SofaWhiteboard from "@/components/whiteboard/SofaWhiteboard";
import Flashcards from "@/components/study/Flashcards";
import { CurriculumTopic } from "@/lib/parser";
import { useProgressStore } from "@/store/useProgressStore";

export default function Home() {
  const { language } = useProgressStore();
  const [topics, setTopics] = React.useState<CurriculumTopic[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    // Use the route for pre-generated JSON if it existed, or use a placeholder for now
    // Since we can't easily run ts in node above without ts-node, we'll fetch from a path
    // that will be populated during build.
    fetch(`/data/curriculum-${language}.json`)
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch curriculum", err);
        setIsLoading(false);
      });
  }, [language]);

  return (
    <DashboardShell>
      <div className="space-y-24 pb-24">
        <section id="curriculum">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Roadmap topics={topics.slice(0, 20)} />
          )}
        </section>

        <section id="whiteboard">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Practice Arena</h2>
            <p className="text-muted-foreground">Sharpen your logic with the Sofa Whiteboard.</p>
          </div>
          <div className="h-[600px]">
            <SofaWhiteboard />
          </div>
        </section>

        <section id="flashcards">
          <Flashcards />
        </section>
      </div>
    </DashboardShell>
  );
}
