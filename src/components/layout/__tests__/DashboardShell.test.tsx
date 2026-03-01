import { render, screen } from '@testing-library/react'
import DashboardShell from '../DashboardShell'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { describe, it, expect } from 'vitest'

describe('DashboardShell', () => {
  it('renders the sidebar and children', () => {
    render(
      <TooltipProvider>
        <SidebarProvider>
          <DashboardShell>
            <div>Test Child</div>
          </DashboardShell>
        </SidebarProvider>
      </TooltipProvider>
    )
    expect(screen.getByText('CIU Academy')).toBeInTheDocument()
    expect(screen.getByText('Test Child')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})
