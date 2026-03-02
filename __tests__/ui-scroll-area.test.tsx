import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';

vi.mock('@radix-ui/react-scroll-area', () => ({
    Root: ({ children, className }: any) => <div className={className} data-slot="scroll-area">{children}</div>,
    Viewport: ({ children, className }: any) => <div className={className} data-slot="scroll-area-viewport">{children}</div>,
    Scrollbar: ({ children, className, orientation }: any) => <div className={className} data-slot="scroll-area-scrollbar" data-orientation={orientation}>{children}</div>,
    ScrollAreaScrollbar: ({ children, className, orientation }: any) => <div className={className} data-slot="scroll-area-scrollbar" data-orientation={orientation}>{children}</div>,
    Thumb: ({ className }: any) => <div className={className} data-slot="scroll-area-thumb" />,
    ScrollAreaThumb: ({ className }: any) => <div className={className} data-slot="scroll-area-thumb" />,
    Corner: ({ className }: any) => <div className={className} data-slot="scroll-area-corner" />,
    ScrollAreaCorner: ({ className }: any) => <div className={className} data-slot="scroll-area-corner" />,
}));

describe('ScrollArea component', () => {
  it('renders correctly', () => {
    render(
      <ScrollArea className="h-40">
        <div style={{ height: '1000px' }}>Big content</div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );
    const scrollbars = document.querySelectorAll('[data-slot="scroll-area-scrollbar"]');
    expect(scrollbars.length).toBeGreaterThan(0);
  });
});
