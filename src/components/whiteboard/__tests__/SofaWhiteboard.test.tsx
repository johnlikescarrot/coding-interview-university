/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SofaWhiteboard from '../SofaWhiteboard';

// Mock shadcn components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, 'aria-label': ariaLabel, type = "button", variant }: any) => (
    <button type={type} onClick={onClick} aria-label={ariaLabel} data-variant={variant}>{children}</button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Trash2: () => <span>Trash2</span>,
  Download: () => <span>Download</span>,
  Eraser: () => <span>Eraser</span>,
  Pen: () => <span>Pen</span>,
}));

// Mock Canvas API
const mockContext = {
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  clearRect: vi.fn(),
  strokeStyle: '',
  lineWidth: 0,
  lineCap: '',
  lineJoin: '',
  globalCompositeOperation: 'source-over',
};

describe('SofaWhiteboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockContext);
    HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,test');
    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 1000,
        height: 600,
    });
  });

  it('handles tool switching and eraser semantics', () => {
    render(<SofaWhiteboard />);

    const eraserBtn = screen.getByRole('button', { name: /eraser tool/i });
    fireEvent.click(eraserBtn);

    const canvas = document.querySelector('canvas')!;
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });

    expect(mockContext.globalCompositeOperation).toBe('destination-out');
  });

  it('handles touch events and cancellation', () => {
    render(<SofaWhiteboard />);
    const canvas = document.querySelector('canvas')!;

    fireEvent.touchStart(canvas, { touches: [{ clientX: 10, clientY: 10 }] });
    fireEvent.touchMove(canvas, { touches: [{ clientX: 20, clientY: 20 }] });
    expect(mockContext.lineTo).toHaveBeenCalled();

    fireEvent.touchCancel(canvas);
    fireEvent.touchMove(canvas, { touches: [{ clientX: 30, clientY: 30 }] });
    // Should not call lineTo after cancel
    expect(mockContext.lineTo).not.toHaveBeenCalledWith(30, 30);
  });

  it('clears based on real dimensions', () => {
    render(<SofaWhiteboard />);
    const canvas = document.querySelector('canvas')!;
    (canvas as any).width = 1000;
    (canvas as any).height = 600;

    const clearButton = screen.getByRole('button', { name: /clear canvas/i });
    fireEvent.click(clearButton);
    expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 1000, 600);
  });
});
