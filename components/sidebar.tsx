"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useProgress } from "@/components/progress-provider"
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Layers,

  Zap,
  SquareStack
} from "lucide-react"

const menuItems = [
  { title: "Syllabus", icon: BookOpen, href: "/" },
  { title: "Study Plan", icon: Layers, href: "/plan" },
  { title: "Data Structures", icon: Code2, href: "/data-structures" },
  { title: "Algorithms", icon: Zap, href: "/algorithms" },
  { title: "Resources", icon: CheckCircle2, href: "/resources" },
  { title: "Flashcards", icon: SquareStack, href: "/flashcards" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { completed, totalTopics } = useProgress()

  const progressPercent = totalTopics > 0
    ? Math.min(Math.max(Math.round((completed.length / totalTopics) * 100), 0), 100)
    : 0

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className="flex flex-col h-full border-r bg-card w-64 fixed left-0 top-0 pt-16">
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main Menu
            </h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive(item.href) && "bg-secondary font-medium"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>

      <div className="mt-auto p-6 border-t bg-muted/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Overall Mastery</span>
          <span className="text-xs font-bold text-primary">{progressPercent}%</span>
        </div>
        <div
          className="h-2 w-full rounded-full bg-primary/20 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          aria-label="Curriculum mastery progress"
        >
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
