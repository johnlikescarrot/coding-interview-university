import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ProgressProvider } from "@/context/ProgressContext";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CIU Academy - The Best Coding Interview Prep",
  description: "Immersive educational experience based on Coding Interview University",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ProgressProvider>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="w-full relative">
                <div className="flex items-center h-14 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                  <SidebarTrigger />
                  <div className="ml-4 font-semibold">CIU Academy</div>
                </div>
                <div className="p-6">
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </TooltipProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
