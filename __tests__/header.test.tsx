import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Header } from '../components/header';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('../components/nav-links', () => ({
  NavLinks: ({ onItemClick }: any) => (
      <button onClick={onItemClick} data-testid="nav-links-mock">NavLinks</button>
  ),
}));

vi.mock('../components/mode-toggle', () => ({
  ModeToggle: () => <div data-testid="mode-toggle-mock" />,
}));

// Mock Shadcn UI components
vi.mock('../components/ui/button', () => ({
    Button: ({ children, onClick, className, variant, size, ...props }: any) => (
        <button onClick={onClick} className={className} {...props}>{children}</button>
    ),
}));

vi.mock('../components/ui/sheet', () => ({
    Sheet: ({ children, open, onOpenChange }: any) => <div data-open={open}>{children}</div>,
    SheetTrigger: ({ children }: any) => <div>{children}</div>,
    SheetContent: ({ children }: any) => <div data-testid="sheet-content">{children}</div>,
    SheetHeader: ({ children }: any) => <div>{children}</div>,
    SheetTitle: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../components/ui/command', () => ({
    CommandDialog: ({ children, open, onOpenChange }: any) => open ? <div data-testid="command-dialog">{children}</div> : null,
    CommandInput: (props: any) => <input {...props} />,
    CommandList: ({ children }: any) => <div>{children}</div>,
    CommandEmpty: ({ children }: any) => <div>{children}</div>,
    CommandGroup: ({ children }: any) => <div>{children}</div>,
    CommandItem: ({ children, onSelect }: any) => <button onClick={onSelect} data-testid="command-item">{children}</button>,
}));

describe('Header', () => {
  it('opens search with Cmd+K', () => {
    render(<Header />);
    expect(screen.queryByTestId('command-dialog')).toBeNull();

    act(() => {
        fireEvent.keyDown(document, { key: 'k', metaKey: true });
    });
    expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
  });

  it('navigates when command item selected', () => {
    const push = vi.fn();
    (useRouter as any).mockReturnValue({ push });

    render(<Header />);

    // Syllabus
    act(() => {
        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });
    fireEvent.click(screen.getAllByTestId('command-item')[0]);
    expect(push).toHaveBeenCalledWith('/');

    // Resources
    act(() => {
        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });
    fireEvent.click(screen.getAllByTestId('command-item')[1]);
    expect(push).toHaveBeenCalledWith('/resources');

    // Flashcards
    act(() => {
        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    });
    fireEvent.click(screen.getAllByTestId('command-item')[2]);
    expect(push).toHaveBeenCalledWith('/flashcards');
  });

  it('toggles mobile menu', () => {
      render(<Header />);
      const navLinks = screen.getByTestId('nav-links-mock');
      fireEvent.click(navLinks);
  });

  it('opens search via click', () => {
      render(<Header />);
      fireEvent.click(screen.getByLabelText('Search topics'));
      expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
  });
});
