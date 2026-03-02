import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../components/ui/checkbox';
import * as React from 'react';

describe('Checkbox component', () => {
  it('renders and toggles correctly', () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox id="test" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('is disabled when the disabled prop is true', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Checkbox className="custom-check" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom-check');
  });
});
