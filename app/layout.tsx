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
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "CIU Mastery | Ultimate Coding Interview Prep",
    template: "%s | CIU Mastery"
  },
  description: "A transcendent, world-class study plan for software engineering mastery. Based on the legendary Coding Interview University.",
  keywords: ["coding interview", "computer science", "software engineering", "study plan", "algorithms", "data structures"],
  authors: [{ name: "John Washam" }, { name: "Jules" }],
  creator: "CIU Community",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://johnlikescarrot.github.io/coding-interview-university/",
    title: "CIU Mastery - Transcendent CS Education",
    description: "Master the coding interview with a high-fidelity, interactive study engine.",
    siteName: "CIU Mastery",
  },
  twitter: {
    card: "summary_large_image",
    title: "CIU Mastery - Ultimate Prep",
    description: "The most beautiful way to master computer science fundamentals.",
    creator: "@jwasham",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/coding-interview-university/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen bg-background antialiased selection:bg-primary/20 selection:text-primary`}>
        <ProgressProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden relative">
                {/* Ambient Background Glow */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-30">
                   <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
                   <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
                </div>

                <Header />
                <main id="main-content" className="flex-1 overflow-y-auto p-6 md:p-12 relative z-10">
                  <div className="max-w-7xl mx-auto w-full">
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
