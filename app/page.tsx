import path from "path";
import { parseCurriculum } from "@/lib/parser";
import { CurriculumView } from "@/components/curriculum-view";
import { notFound } from "next/navigation";

export default function Home() {
  const filePath = path.join(process.cwd(), "content/README.md");

  try {
    const curriculum = parseCurriculum(filePath);

    if (curriculum.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 border-2 border-dashed rounded-xl border-muted/50 bg-muted/5">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Curriculum not found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The curriculum content could not be loaded. Please ensure "content/README.md" exists and is properly formatted.
          </p>
        </div>
      );
    }

    return <CurriculumView sections={curriculum} />;
  } catch (e) {
    console.error("Error loading curriculum:", e);
    return notFound();
  }
}
