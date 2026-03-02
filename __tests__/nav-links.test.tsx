import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavLinks } from '../components/nav-links';
import { usePathname } from 'next/navigation';

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, onClick, className }: any) => (
    <a href={href} onClick={onClick} className={className}>{children}</a>
  ),
}));

describe('NavLinks', () => {
  it('renders all links and handles active state', () => {
    (usePathname as any).mockReturnValue('/');
    render(<NavLinks />);

    const studyPlanLink = screen.getByText('Study Plan').closest('a');
    expect(studyPlanLink).toHaveClass('bg-accent');

    const resourcesLink = screen.getByText('Language Resources').closest('a');
    expect(resourcesLink).not.toHaveClass('bg-accent');
  });

  it('calls onItemClick when a link is clicked', () => {
    (usePathname as any).mockReturnValue('/');
    const handleClick = vi.fn();
    render(<NavLinks onItemClick={handleClick} />);

    fireEvent.click(screen.getByText('Flashcards'));
    expect(handleClick).toHaveBeenCalled();
  });
});
