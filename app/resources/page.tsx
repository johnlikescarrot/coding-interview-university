import path from "path";
import { parseLanguageResources, Resource } from "@/lib/parser";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Video, FileText, Code2, Book, Zap, HelpCircle, type LucideIcon, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconEntry { icon: LucideIcon; color: string; bgColor: string; }

const IconMap: Record<Resource["type"], IconEntry> = {
  video: { icon: Video, color: "text-red-500", bgColor: "bg-red-500/10" },
  article: { icon: FileText, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  book: { icon: Book, color: "text-green-500", bgColor: "bg-green-500/10" },
  interactive: { icon: Zap, color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  other: { icon: HelpCircle, color: "text-muted-foreground", bgColor: "bg-muted/10" }
};

export default function ResourcesPage() {
  const filePath = path.join(process.cwd(), "content/programming-language-resources.md");
  const languages = parseLanguageResources(filePath);

  if (Object.keys(languages).length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center">
        <div className="p-20 border-2 border-dashed rounded-[3rem] border-muted/50 bg-muted/5 backdrop-blur-sm">
          <FlaskConical className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-4">Laboratory Empty</h1>
          <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto">
            Language-specific assets are being synthesized. Check back soon for the latest protocols.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-32">
      <div className="space-y-6 text-center lg:text-left relative py-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
           <FlaskConical className="h-5 w-5 text-primary" />
           <span className="text-xs font-black uppercase tracking-[0.4em] text-primary/80">Central Asset Repository</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-none">Language Lab</h1>
        <p className="text-xl text-muted-foreground font-bold tracking-tight max-w-2xl">
          High-fidelity specialized knowledge for elite cross-stack proficiency.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(languages).map(([lang, resources], lidx) => (
          <Card key={lang} className="flex flex-col h-full bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-all duration-500 border-border/40 hover:border-primary/30 rounded-[2rem] shadow-2xl hover:shadow-primary/5 overflow-hidden group">
            <CardHeader className="bg-muted/30 border-b border-border/40 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 rounded-2xl bg-background border border-border/50 group-hover:border-primary/20 transition-colors">
                     <Code2 className="h-6 w-6 text-primary" />
                   </div>
                   <CardTitle className="text-2xl font-black tracking-tighter leading-none">
                     {lang}
                   </CardTitle>
                </div>
                <Badge variant="outline" className="font-black border-border/60 bg-background/50 rounded-lg py-1">{resources.length} Units</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col">
              <div className="divide-y divide-border/20 flex-1">
                {resources.slice(0, 10).map((res) => {
                  const info = IconMap[res.type] || IconMap.other;
                  const TypeIcon = info.icon;

                  return (
                    <a
                      key={res.url}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 hover:bg-primary/[0.03] transition-all group/item"
                    >
                      <div className={cn("p-2 rounded-lg transition-colors group-hover/item:bg-white dark:group-hover/item:bg-black border border-transparent group-hover/item:border-border/40 shadow-sm", info.bgColor)}>
                        <TypeIcon className={cn("h-4 w-4", info.color)} />
                      </div>
                      <span className="text-sm font-bold leading-tight flex-1 truncate group-hover/item:text-primary transition-colors">
                        {res.title}
                      </span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                    </a>
                  );
                })}
              </div>
              {resources.length > 10 ? (
                <div className="p-4 text-center bg-muted/20 border-t border-border/20 mt-auto">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 italic">+ {resources.length - 10} Additional Data Protocols</p>
                </div>
              ) : (
                <div className="p-4 mt-auto border-t border-border/10" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
