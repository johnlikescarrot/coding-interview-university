import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../components/ui/badge';
import * as React from 'react';

describe('Badge component', () => {
  it('renders correctly with default props', () => {
    render(<Badge>New</Badge>);
    const badge = screen.getByText('New');
    expect(badge).toHaveClass('bg-primary');
  });

  it('handles different variants', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveClass('text-foreground');
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('renders as a child element when asChild is true', () => {
    render(
      <Badge asChild>
        <span data-testid="custom-child">Child</span>
      </Badge>
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByTestId('custom-child')).toHaveClass('bg-primary');
  });
});
