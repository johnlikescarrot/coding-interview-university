import { parseCurriculum } from "@/lib/parser";
import path from "path";
import { CurriculumView } from "@/components/curriculum-view";

export default function Home() {
  const filePath = path.join(process.cwd(), "content/README.md");
  const curriculum = parseCurriculum(filePath);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Computer Science Mastery
        </h1>
        <p className="text-xl text-muted-foreground">
            A transcendent study plan for becoming a software engineer.
        </p>
      </div>

      <CurriculumView sections={curriculum} />
    </div>
  );
}
