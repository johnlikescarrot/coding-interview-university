import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import DashboardShell from '../DashboardShell';

// Correctly mock the UI providers and components that depend on complex context
vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Sidebar: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SidebarHeader: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SidebarContent: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SidebarFooter: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SidebarMenu: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SidebarMenuButton: ({ children }: PropsWithChildren) => <div>{children}</div>,
  SidebarRail: () => null,
  SidebarTrigger: () => <button type="button">Trigger</button>,
  useSidebar: () => ({ state: 'expanded', open: true, setOpen: vi.fn() }),
}));

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: PropsWithChildren) => <div>{children}</div>,
  Tooltip: ({ children }: PropsWithChildren) => <div>{children}</div>,
  TooltipTrigger: ({ children }: PropsWithChildren) => <div>{children}</div>,
  TooltipContent: ({ children }: PropsWithChildren) => <div>{children}</div>,
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
