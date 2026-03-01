/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SofaWhiteboard from '../SofaWhiteboard';

// Mock shadcn components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, 'aria-label': ariaLabel, type = "button" }: any) => (
    <button type={type} onClick={onClick} aria-label={ariaLabel}>{children}</button>
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

  it('renders the canvas and controls', () => {
    render(<SofaWhiteboard />);
    expect(screen.getByRole('button', { name: /pen/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eraser/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('starts drawing on mouse down', () => {
    render(<SofaWhiteboard />);
    const canvas = document.querySelector('canvas')!;

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalledWith(10, 10);
  });

  it('draws on mouse move when mouse is down', () => {
    render(<SofaWhiteboard />);
    const canvas = document.querySelector('canvas')!;

    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 });
    fireEvent.mouseMove(canvas, { clientX: 20, clientY: 20 });

    expect(mockContext.lineTo).toHaveBeenCalledWith(20, 20);
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  it('clears the canvas', () => {
    render(<SofaWhiteboard />);
    const clearButton = screen.getByRole('button', { name: /clear/i });

    fireEvent.click(clearButton);
    expect(mockContext.clearRect).toHaveBeenCalled();
  });

  it('downloads the canvas as image', () => {
    const linkClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    render(<SofaWhiteboard />);
    const downloadButton = screen.getByRole('button', { name: /download/i });

    fireEvent.click(downloadButton);
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledWith('image/png');
    expect(linkClickSpy).toHaveBeenCalled();
  });
});
