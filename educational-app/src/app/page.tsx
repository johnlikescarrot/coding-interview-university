"use client"

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import curriculum from "@/data/curriculum.json";
import { BookOpen, Code2, GraduationCap, Link2, PlayCircle } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

export default function Dashboard() {
  const { getProgressForTopic } = useProgress();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
          Your Mastery Journey
        </h1>
        <p className="text-muted-foreground text-lg">
          Master the fundamentals of Computer Science and ace your technical interviews.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {curriculum.map((topic, index) => {
          const progress = getProgressForTopic(topic.subtopics.map(s => s.slug));

          return (
            <Link key={topic.slug} href={`/topic/${topic.slug}`} className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold">{topic.title}</CardTitle>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {index % 3 === 0 ? <Code2 className="h-4 w-4" /> : index % 3 === 1 ? <GraduationCap className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    Explore {topic.subtopics.length} specialized modules.
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-3 w-3" />
                      <span>Videos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      <span>Articles</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
