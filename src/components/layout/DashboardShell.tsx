"use client"

import * as React from "react"
import {
  BookOpen,
  CheckSquare,
  CreditCard,
  LayoutDashboard,
  PenTool,
  Settings
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LanguageSwitcher } from "./LanguageSwitcher"

const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Curriculum",
    url: "#curriculum",
    icon: BookOpen,
  },
  {
    title: "Sofa Whiteboard",
    url: "#whiteboard",
    icon: PenTool,
  },
  {
    title: "Flashcards",
    url: "#flashcards",
    icon: CreditCard,
  },
  {
    title: "Progress",
    url: "#progress",
    icon: CheckSquare,
  },
  {
    title: "Settings",
    url: "#settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-6">
        <div className="flex items-center gap-2 font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="text-xl tracking-tight">CIU Academy</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2 py-4">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 flex flex-col gap-4">
        <LanguageSwitcher />
        <div className="text-xs text-muted-foreground text-center">
          v0.1.0 • Built with Jules
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-6">
        <header className="flex h-16 items-center border-b px-4 lg:px-6 mb-6">
          <SidebarTrigger className="mr-4" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Scholar</h1>
        </header>
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
