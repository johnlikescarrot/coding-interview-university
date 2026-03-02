import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from '../components/ui/sheet';
import * as React from 'react';

// Mock Radix UI Dialog (used by Sheet)
vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open, onOpenChange }: any) => {
    const [isOpen, setIsOpen] = React.useState(open || false);
    return (
        <div data-state={isOpen ? 'open' : 'closed'}>
            {React.Children.map(children, child =>
                React.isValidElement(child) ? React.cloneElement(child as any, { isOpen, setIsOpen, onOpenChange }) : child
            )}
        </div>
    );
  },
  Trigger: ({ children, asChild, setIsOpen }: any) => (
    <div onClick={() => setIsOpen(true)}>{children}</div>
  ),
  Portal: ({ children }: any) => <>{children}</>,
  Overlay: ({ className, isOpen }: any) => isOpen ? <div className={className} /> : null,
  Content: ({ children, className, isOpen, setIsOpen }: any) => (
    isOpen ? (
        <div className={className} data-testid="sheet-content">
            {children}
            <button aria-label="Close" onClick={() => setIsOpen(false)}>X</button>
        </div>
    ) : null
  ),
  Title: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
  Description: ({ children, className }: any) => <p className={className}>{children}</p>,
  Close: ({ children, asChild, setIsOpen }: any) => <div onClick={() => setIsOpen(false)}>{children}</div>,
}));

describe('Sheet component', () => {
  it('opens and displays content', () => {
    render(
      <Sheet>
        <SheetTrigger>Open Sheet</SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <div>Body</div>
          <SheetFooter>Footer</SheetFooter>
        </SheetContent>
      </Sheet>
    );

    fireEvent.click(screen.getByText('Open Sheet'));
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
    expect(screen.getByText('Sheet Title')).toBeInTheDocument();
    expect(screen.getByText('Sheet Description')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
