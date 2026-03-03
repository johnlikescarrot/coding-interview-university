import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ProgressProvider } from "@/components/progress-provider";
import { PageTransition } from "@/components/page-transition";
import { MotionConfig } from "framer-motion";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CIU Mastery | Ultimate Coding Interview Prep",
  description: "A transcendent, world-class study plan for software engineering mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body className={`${inter.variable} font-sans min-h-screen bg-background selection:bg-primary/10 selection:text-primary transition-colors duration-300`}>
        <ProgressProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MotionConfig reducedMotion="user">
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden relative">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
                    <div className="max-w-7xl mx-auto w-full relative">
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </div>
                  </main>
                  {/* Background Decor */}
                  <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </MotionConfig>
          </ThemeProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
