"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, CheckCircle2, Code2, Layers, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProgress } from "@/components/progress-provider"

const menuItems = [
  { title: "Syllabus", icon: BookOpen, href: "/" },
  { title: "Study Plan", icon: Layers, href: "/study-plan" },
  { title: "Data Structures", icon: Code2, href: "/data-structures" },
  { title: "Algorithms", icon: Zap, href: "/algorithms" },
  { title: "Resources", icon: CheckCircle2, href: "/resources" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { completed, totalTopics } = useProgress()

  const progressPercent = Math.min(Math.round((completed.length / totalTopics) * 100), 100)

  return (
    <div className="hidden border-r bg-muted/20 md:block md:w-64 lg:w-72">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="text-lg">Coding Interview Uni</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Main Menu
              </h2>
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
                      pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="mt-auto border-t p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-primary">
                <span>Overall Mastery</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-primary/20 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progressPercent}%` }}
                  />
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
