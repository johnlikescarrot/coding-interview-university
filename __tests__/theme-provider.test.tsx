import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../components/theme-provider';
import * as React from 'react';

vi.mock('next-themes', () => ({
    ThemeProvider: ({ children }: any) => <div data-testid="next-themes-provider">{children}</div>,
}));

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <div data-testid="child">Child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('next-themes-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
