import { parseCurriculum } from "@/lib/parser";
import path from "path";
import { Flashcard } from "@/components/flashcard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Sparkles } from "lucide-react";

export default function FlashcardsPage() {
  const filePath = path.join(process.cwd(), "content/README.md");
  const curriculum = parseCurriculum(filePath);

  const validSections = curriculum.filter(s => s.topics.length > 0).slice(0, 8);

  if (validSections.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-32 space-y-8">
        <div className="flex justify-center">
           <div className="p-4 rounded-3xl bg-muted/50 border border-border/40">
              <BrainCircuit className="h-12 w-12 text-muted-foreground opacity-20" />
           </div>
        </div>
        <div className="space-y-2">
           <h1 className="text-3xl font-black tracking-tight uppercase">Intelligence Not Found</h1>
           <p className="text-muted-foreground font-medium max-w-md mx-auto">Master core concepts once the syllabus is fully parsed and indexed by the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      <div className="space-y-4 text-center relative py-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex items-center justify-center gap-3 mb-2">
           <Sparkles className="h-5 w-5 text-primary" />
           <span className="text-xs font-black uppercase tracking-[0.4em] text-primary/80">Neuro-Sync Activated</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none">Active Recall</h1>
        <p className="text-xl text-muted-foreground font-bold tracking-tight max-w-2xl mx-auto">
          Deepen neural connections through high-intensity interactive memory retrieval.
        </p>
      </div>

      <Tabs defaultValue={validSections[0].title} className="w-full">
        <div className="flex justify-center mb-16 sticky top-24 z-30">
            <TabsList className="bg-background/40 backdrop-blur-2xl border border-border/40 h-auto p-1.5 flex-wrap justify-center rounded-2xl shadow-2xl">
                {validSections.map((section) => (
                    <TabsTrigger
                        key={section.title}
                        value={section.title}
                        className="text-xs font-black uppercase tracking-tight px-6 py-2.5 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all"
                    >
                        {section.title}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>

        {validSections.map((section) => (
            <TabsContent
              key={section.title}
              value={section.title}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 focus-visible:outline-hidden"
            >
                {section.topics.slice(0, 10).map((topic) => (
                    <Flashcard
                        key={topic.id}
                        front={topic.title}
                        back={`Deep dive into ${topic.title} by reviewing its resources in the syllabus. Focus on complexity, implementation, and edge cases.`}
                    />
                ))}
            </TabsContent>
        ))}
      </Tabs>

      <div className="pt-20 text-center">
         <div className="p-8 rounded-3xl bg-muted/10 border border-border/40 max-w-2xl mx-auto backdrop-blur-sm">
            <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest mt-4 text-primary opacity-60">— Beast Mode Axiom</p>
         </div>
      </div>
    </div>
  );
}
