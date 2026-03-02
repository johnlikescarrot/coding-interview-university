import path from "path";
import { parseLanguageResources } from "@/lib/parser.server";
import { Resource } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Video, FileText, Code2, Book, Zap, HelpCircle, type LucideIcon } from "lucide-react";

interface IconEntry { icon: LucideIcon; color: string; }

const IconMap: Record<Resource["type"], IconEntry> = {
  video: { icon: Video, color: "text-red-500" },
  article: { icon: FileText, color: "text-blue-500" },
  book: { icon: Book, color: "text-green-500" },
  interactive: { icon: Zap, color: "text-yellow-500" },
  other: { icon: HelpCircle, color: "text-muted-foreground" }
};

export default function ResourcesPage() {
  const filePath = path.join(process.cwd(), "content/programming-language-resources.md");
  const languages = parseLanguageResources(filePath);

  if (Object.keys(languages).length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <div className="p-12 border-2 border-dashed rounded-2xl border-muted/50 bg-muted/5">
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">No Resources Found</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Language-specific resources could not be loaded. Check "content/programming-language-resources.md" for content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Language Resource Library</h1>
        <p className="text-xl text-muted-foreground">Deep dive into your chosen stack with curated high-quality resources.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(languages).map(([lang, resources]) => (
          <Card key={lang} className="flex flex-col h-full hover:shadow-lg transition-all border-muted/50 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  {lang}
                </CardTitle>
                <Badge variant="secondary" className="font-mono">{resources.length} items</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-muted/50">
                {resources.slice(0, 10).map((res) => {
                  const TypeIcon = IconMap[res.type]?.icon || HelpCircle;
                  const iconColor = IconMap[res.type]?.color || "text-muted-foreground";

                  return (
                    <a
                      key={res.url}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors group"
                    >
                      <TypeIcon className={`h-4 w-4 mt-1 ${iconColor}`} />
                      <span className="text-sm font-medium leading-tight flex-1 group-hover:text-primary transition-colors">
                        {res.title}
                      </span>
                      <ExternalLink className="h-3 w-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>
              {resources.length > 10 && (
                <div className="p-3 text-center bg-muted/10">
                  <p className="text-xs text-muted-foreground italic">+ {resources.length - 10} more resources</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
