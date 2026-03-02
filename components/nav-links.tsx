"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookOpen, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const links = [
  { name: "Study Plan", href: "/", icon: LayoutDashboard },
  { name: "Language Resources", href: "/resources", icon: BookOpen },
  { name: "Flashcards", href: "/flashcards", icon: BrainCircuit },
]

export function NavLinks({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onItemClick}
            className={cn(
              "group relative isolate flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-nav"
                className="absolute inset-0 bg-primary/5 border border-primary/10 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className={cn(
              "h-4 w-4 transition-transform group-hover:scale-110",
              isActive ? "text-primary" : "opacity-70"
            )} />
            {link.name}
          </Link>
        )
      })}
    </nav>
  )
}
