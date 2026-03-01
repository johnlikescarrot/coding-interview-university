/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardShell from '../DashboardShell';

// Correctly mock the UI providers and components that depend on complex context
vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: any) => <div>{children}</div>,
  Sidebar: ({ children }: any) => <div>{children}</div>,
  SidebarHeader: ({ children }: any) => <div>{children}</div>,
  SidebarContent: ({ children }: any) => <div>{children}</div>,
  SidebarFooter: ({ children }: any) => <div>{children}</div>,
  SidebarMenu: ({ children }: any) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: any) => <div>{children}</div>,
  SidebarMenuButton: ({ children }: any) => <div>{children}</div>,
  SidebarRail: () => null,
  SidebarTrigger: () => <button>Trigger</button>,
  useSidebar: () => ({ state: 'expanded', open: true, setOpen: vi.fn() }),
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => <div>{children}</div>,
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipTrigger: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}));

describe('DashboardShell', () => {
  it('renders children and basic structure', () => {
    render(
      <DashboardShell>
        <div data-testid="child">Test Child</div>
      </DashboardShell>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('CIU Academy')).toBeInTheDocument();
  });
});
