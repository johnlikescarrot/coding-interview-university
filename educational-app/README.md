# CIU Academy

The best educational app for mastering Coding Interview fundamentals.

## Features
- Immersive Dashboard with Bento-grid layout.
- Hierarchical navigation with Shadcn UI Sidebar.
- Dynamic topic deep-dives with interactive Accordions.
- Persistent progress tracking using LocalStorage.
- 100% Code Coverage.
- Automated CI/CD deployment to GitHub Pages.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Vitest + v8 Coverage
- Playwright (Verification)

## Development
- \`pnpm install\`: Install dependencies.
- \`npx tsx scripts/parse-curriculum.ts\`: Update curriculum data from root README.
- \`pnpm vitest run --coverage\`: Run tests and verify 100% coverage.
- \`pnpm dev\`: Start development server.
