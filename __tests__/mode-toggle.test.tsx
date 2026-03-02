import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModeToggle } from '../components/mode-toggle';
import { useTheme } from 'next-themes';
import * as React from 'react';

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Mock Dropdown with Slot support to fix nested button issues
vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: any) => <div data-slot="dropdown-menu">{children}</div>,
  Trigger: ({ children, asChild }: any) => <div data-slot="trigger">{children}</div>,
  Portal: ({ children }: any) => <div>{children}</div>,
  Content: ({ children }: any) => <div>{children}</div>,
  Item: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

describe('ModeToggle component', () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as any).mockReturnValue({ setTheme });
  });

  it('toggles themes correctly', () => {
    render(<ModeToggle />);

    // items should be visible due to simplified mock
    fireEvent.click(screen.getByText(/Light/i));
    expect(setTheme).toHaveBeenCalledWith('light');
    setTheme.mockClear();

    fireEvent.click(screen.getByText(/Dark/i));
    expect(setTheme).toHaveBeenCalledWith('dark');
    setTheme.mockClear();

    fireEvent.click(screen.getByText(/System/i));
    expect(setTheme).toHaveBeenCalledWith('system');
  });
});
