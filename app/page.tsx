import path from "path";
import { parseCurriculum } from "@/lib/parser";
import { CurriculumView } from "@/components/curriculum-view";

export default function Home() {
  const filePath = path.join(process.cwd(), "content/README.md");
  const curriculum = parseCurriculum(filePath);

  if (curriculum.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 border-2 border-dashed rounded-xl border-muted/50 bg-muted/5">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Curriculum not found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The curriculum content could not be loaded. Please ensure &quot;content/README.md&quot; exists and is properly formatted.
        </p>
      </div>
    );
  }

  return <CurriculumView sections={curriculum} />;
}
