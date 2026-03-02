import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';
import * as React from 'react';

// Mock Radix UI ScrollArea
vi.mock('@radix-ui/react-scroll-area', () => ({
  Root: ({ children, className }: any) => <div className={className}>{children}</div>,
  Viewport: ({ children, className }: any) => <div className={className}>{children}</div>,
  ScrollAreaScrollbar: ({ children, className, orientation }: any) => (
    <div className={className} data-orientation={orientation} data-testid="scrollbar-element">
        {children}
    </div>
  ),
  ScrollAreaThumb: ({ className }: any) => <div className={className} />,
  Corner: () => <div />,
}));

describe('ScrollArea component', () => {
  it('renders correctly with vertical and horizontal scrollbars', () => {
    const { rerender } = render(
      <ScrollArea className="h-40">
        <div>Content</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );
    // Find all scrollbars and check orientation
    const scrollbarsV = screen.getAllByTestId('scrollbar-element');
    expect(scrollbarsV.some(s => s.getAttribute('data-orientation') === 'vertical')).toBe(true);

    rerender(
      <ScrollArea className="h-40">
        <div>Content</div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
    const scrollbarsH = screen.getAllByTestId('scrollbar-element');
    expect(scrollbarsH.some(s => s.getAttribute('data-orientation') === 'horizontal')).toBe(true);
  });
});
