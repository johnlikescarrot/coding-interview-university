import { render, screen } from '@testing-library/react'
import { AppSidebar } from './app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { expect, it, describe, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('AppSidebar', () => {
  it('renders the sidebar with curriculum links', () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    )
    expect(screen.getByText('CIU Academy')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getAllByText(/Data Structures/i).length).toBeGreaterThan(0)
  })
})
