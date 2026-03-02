import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ProgressProvider } from "@/components/progress-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CIU Mastery | Ultimate Coding Interview Prep",
  description: "A transcendent, world-class study plan for software engineering mastery.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen bg-background antialiased selection:bg-primary selection:text-primary-foreground`}>
        <ProgressProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-screen overflow-hidden relative">
              {/* Background Effects */}
              <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
              </div>

              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden relative">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
                  <div className="max-w-5xl mx-auto w-full">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </ThemeProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
