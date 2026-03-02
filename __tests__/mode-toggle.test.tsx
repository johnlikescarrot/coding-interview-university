import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from '../components/mode-toggle';
import { useTheme } from 'next-themes';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Mock DropdownMenu UI since we already tested the actual component
vi.mock('../components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

describe('ModeToggle', () => {
  it('calls setTheme correctly', () => {
    const setTheme = vi.fn();
    (useTheme as any).mockReturnValue({ setTheme });

    render(<ModeToggle />);

    fireEvent.click(screen.getByText('Light'));
    expect(setTheme).toHaveBeenCalledWith('light');

    fireEvent.click(screen.getByText('Dark'));
    expect(setTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(screen.getByText('System'));
    expect(setTheme).toHaveBeenCalledWith('system');
  });
});
