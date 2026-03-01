import { parseCurriculum } from "@/lib/parser";
import path from "path";
import { Flashcard } from "@/components/flashcard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FlashcardsPage() {
  const filePath = path.join(process.cwd(), "content/README.md");
  const curriculum = parseCurriculum(filePath);

  // Filter for sections that have actual topics
  const validSections = curriculum.filter(s => s.topics.length > 0).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Active Recall Review</h1>
        <p className="text-xl text-muted-foreground">Master core concepts through interactive flashcards.</p>
      </div>

      <Tabs defaultValue={validSections[0]?.title} className="w-full">
        <div className="flex justify-center mb-8">
            <TabsList className="bg-muted/50">
                {validSections.map((section, idx) => (
                    <TabsTrigger key={idx} value={section.title} className="text-xs sm:text-sm">
                        {section.title}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>

        {validSections.map((section, idx) => (
            <TabsContent key={idx} value={section.title} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {section.topics.slice(0, 6).map((topic, tidx) => (
                    <Flashcard
                        key={tidx}
                        front={topic.title}
                        back={`Deep dive into ${topic.title} by reviewing its resources in the syllabus. Focus on complexity, implementation, and edge cases.`}
                    />
                ))}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
