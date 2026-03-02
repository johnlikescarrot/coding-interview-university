import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import FlashcardsPage from '../app/flashcards/page';
import ResourcesPage from '../app/resources/page';
import RootLayout from '../app/layout';
import { parseCurriculum, parseLanguageResources } from '../lib/parser';
import * as React from 'react';

vi.mock('../lib/parser', () => ({
  parseCurriculum: vi.fn(),
  parseLanguageResources: vi.fn(),
}));

vi.mock('../components/curriculum-view', () => ({
  CurriculumView: ({ sections }: any) => <div data-testid="curriculum-view">{sections.length} sections</div>,
}));

vi.mock('../components/flashcard', () => ({
  Flashcard: ({ front }: any) => <div data-testid="flashcard">{front}</div>,
}));

// Mock Next.js components
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => <div data-testid="not-found">Not Found</div>),
}));

vi.mock('next/font/google', () => ({
    Inter: () => ({ variable: 'inter' }),
}));

// Mock components used in Layout
vi.mock('../components/sidebar', () => ({
    Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock('../components/header', () => ({
    Header: () => <header data-testid="header">Header</header>,
}));
vi.mock('../components/progress-provider', () => ({
    ProgressProvider: ({ children }: any) => <div data-testid="progress-provider">{children}</div>,
}));
vi.mock('../components/theme-provider', () => ({
    ThemeProvider: ({ children }: any) => <div data-testid="theme-provider">{children}</div>,
}));

// Mock UI components for pages
vi.mock('../components/ui/tabs', () => ({
    Tabs: ({ children }: any) => <div>{children}</div>,
    TabsList: ({ children }: any) => <div>{children}</div>,
    TabsTrigger: ({ children }: any) => <button>{children}</button>,
    TabsContent: ({ children, value }: any) => <div data-testid={`tabs-content-${value}`}>{children}</div>,
}));

vi.mock('../components/ui/card', () => ({
    Card: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardHeader: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardTitle: ({ children, className }: any) => <div className={className}>{children}</div>,
    CardContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

vi.mock('../components/ui/badge', () => ({
    Badge: ({ children, className }: any) => <span className={className}>{children}</span>,
}));

// Mock Framer Motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
        header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('Pages', () => {
  it('renders Home page with curriculum', async () => {
    (parseCurriculum as any).mockReturnValue([{ title: 'S1', topics: [{ id: 't1' }] }]);
    const Result = await Home();
    render(Result);
    expect(screen.getByTestId('curriculum-view')).toBeInTheDocument();
  });

  it('renders Home page error state when curriculum is empty', async () => {
    (parseCurriculum as any).mockReturnValue([]);
    const Result = await Home();
    render(Result);
    expect(screen.getByText('Curriculum not found')).toBeInTheDocument();
  });

  it('renders Home page notFound on catch block', async () => {
      (parseCurriculum as any).mockImplementation(() => { throw new Error('Fail'); });
      const Result = await Home();
      render(Result);
      expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('renders Flashcards page', async () => {
    (parseCurriculum as any).mockReturnValue([
        { title: 'S1', topics: [{ id: 't1', title: 'Topic 1' }] }
    ]);
    const Result = await FlashcardsPage();
    render(Result);
    expect(screen.getByText((c, el) => el?.textContent === 'Active Recall')).toBeInTheDocument();
    expect(screen.getByTestId('flashcard')).toBeInTheDocument();
  });

  it('renders Flashcards empty state', async () => {
    (parseCurriculum as any).mockReturnValue([]);
    const Result = await FlashcardsPage();
    render(Result);
    expect(screen.getByText('Intelligence Not Found')).toBeInTheDocument();
  });

  it('renders Resources page with many items', async () => {
    const manyResources = Array.from({ length: 12 }, (_, i) => ({ title: `Res ${i}`, url: `u${i}`, type: 'unknown-type' as any as const }));
    (parseLanguageResources as any).mockReturnValue({
        'Python': manyResources
    });
    const Result = await ResourcesPage();
    render(Result);
    expect(screen.getByText('Language Lab')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    // Use flexible text matcher for laboratory count
    expect(screen.getByText((c) => c.includes('+ 2 Additional Data Protocols'))).toBeInTheDocument();
  });

  it('renders Resources page with few items', async () => {
    (parseLanguageResources as any).mockReturnValue({
        'Python': [{ title: 'Res 1', url: 'u1', type: 'article' as const }]
    });
    const Result = await ResourcesPage();
    render(Result);
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('renders Resources empty state', async () => {
    (parseLanguageResources as any).mockReturnValue({});
    const Result = await ResourcesPage();
    render(Result);
    expect(screen.getByText('Laboratory Empty')).toBeInTheDocument();
  });

  it('renders RootLayout correctly', () => {
      render(
          <RootLayout>
              <div data-testid="child">Child</div>
          </RootLayout>
      );
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
