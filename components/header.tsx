"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle";
import { Search, Menu, Command as CommandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NavLinks } from "./nav-links";
import { motion } from "framer-motion";

export function Header() {
  const [open, setOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const router = useRouter()

  const navigate = React.useCallback((href: string) => {
    router.push(href)
    setOpen(false)
  }, [router])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <motion.header
      className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-20 items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 flex-1">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden rounded-xl bg-muted/50 border border-border/40">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-card/95 backdrop-blur-2xl border-r-border/40">
              <SheetHeader className="pb-6 border-b border-border/40">
                <SheetTitle className="text-left text-2xl font-black tracking-tight uppercase">Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                <NavLinks onItemClick={() => setMobileMenuOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            className="relative h-11 w-full justify-start rounded-xl bg-muted/30 border-border/40 text-sm font-medium text-muted-foreground shadow-sm hover:bg-muted/50 hover:border-primary/30 transition-all sm:pr-12 md:w-48 lg:w-80 group"
            onClick={() => setOpen(true)}
            aria-label="Search topics"
          >
            <Search aria-hidden="true" className="mr-3 h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline-flex opacity-70">Search mastery topics...</span>
            <span className="inline-flex lg:hidden opacity-70">Search...</span>
            <kbd className="pointer-events-none absolute right-2 top-2 hidden h-7 select-none items-center gap-1 rounded-lg border border-border/60 bg-background px-2 font-mono text-[10px] font-black opacity-100 sm:flex shadow-xs">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 mr-4">
             <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-tighter text-primary/80">System Stable</span>
          </div>
          <ModeToggle />
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-card/95 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl border border-border/40">
          <CommandInput placeholder="Search for your next challenge..." className="h-14" />
          <CommandList className="max-h-[450px]">
            <CommandEmpty>No results found for your search.</CommandEmpty>
            <CommandGroup heading="System Navigation">
              <CommandItem onSelect={() => navigate("/")} className="gap-3 py-3 px-4 rounded-xl cursor-pointer">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                   <CommandIcon className="h-4 w-4" />
                </div>
                <span>Syllabus Home</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate("/resources")} className="gap-3 py-3 px-4 rounded-xl cursor-pointer">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                   <CommandIcon className="h-4 w-4" />
                </div>
                <span>Language Resource Lab</span>
              </CommandItem>
              <CommandItem onSelect={() => navigate("/flashcards")} className="gap-3 py-3 px-4 rounded-xl cursor-pointer">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                   <CommandIcon className="h-4 w-4" />
                </div>
                <span>Active Recall (Flashcards)</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
    </motion.header>
  );
}
