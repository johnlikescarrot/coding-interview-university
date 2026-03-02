import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress } from '../components/ui/progress';
import * as React from 'react';

describe('Progress component', () => {
  it('renders correctly with given value', () => {
    render(<Progress value={50} aria-label="test-progress" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '50');
  });

  it('handles null or undefined value by defaulting to 0', () => {
    render(<Progress value={undefined} aria-label="test-progress-empty" />);
    const progress = screen.getByRole('progressbar');
    expect(progress).toHaveAttribute('aria-valuenow', '0');
  });

  it('clamps values correctly', () => {
    const { rerender } = render(<Progress value={150} aria-label="test-progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    rerender(<Progress value={-50} aria-label="test-progress" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('applies custom className', () => {
    render(<Progress value={30} className="custom-progress" aria-label="test-progress" />);
    expect(screen.getByRole('progressbar')).toHaveClass('custom-progress');
  });
});
