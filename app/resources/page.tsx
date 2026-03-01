import { parseLanguageResources } from "@/lib/parser";
import path from "path";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Video, FileText, Code2 } from "lucide-react";

export default function ResourcesPage() {
  const filePath = path.join(process.cwd(), "content/programming-language-resources.md");
  const languages = parseLanguageResources(filePath);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight">Language Resource Library</h1>
        <p className="text-xl text-muted-foreground">Deep dive into your chosen stack with curated high-quality resources.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(languages).map(([lang, resources]) => (
          <Card key={lang} className="flex flex-col h-full hover:shadow-lg transition-all border-muted/50 overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  {lang}
                </CardTitle>
                <Badge variant="secondary">{resources.length} items</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 flex-1">
              <ul className="space-y-3">
                {resources.slice(0, 6).map((res, ridx) => (
                  <li key={`${lang}-res-${ridx}`}>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-primary transition-colors group"
                    >
                      {res.type === 'video' ? <Video className="h-4 w-4 shrink-0 text-red-500" /> : <FileText className="h-4 w-4 shrink-0 text-blue-500" />}
                      <span className="truncate">{res.title}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                    </a>
                  </li>
                ))}
                {resources.length > 6 && (
                  <li className="text-xs text-muted-foreground pt-2 italic">
                    + {resources.length - 6} more resources
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
