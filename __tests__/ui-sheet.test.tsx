import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '../components/ui/sheet';
import * as React from 'react';

vi.mock('@radix-ui/react-dialog', () => {
  return {
    Root: ({ children }: any) => <div>{children}</div>,
    Trigger: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    Portal: ({ children }: any) => <div>{children}</div>,
    Overlay: () => <div />,
    Content: ({ children, isOpen, setIsOpen }: any) => (
      isOpen ? <div data-testid="sheet-content">{children}<button aria-label="Close" onClick={() => setIsOpen(false)}>X</button></div> : null
    ),
    Close: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    Header: ({ children }: any) => <div>{children}</div>,
    Title: ({ children }: any) => <h2>{children}</h2>,
    Description: ({ children }: any) => <p>{children}</p>,
  };
});

describe('Sheet Component', () => {
  it('opens and closes correctly', () => {
    const TestComp = () => {
        const [open, setOpen] = React.useState(false);
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger onClick={() => setOpen(true)}>Open</SheetTrigger>
                <SheetContent isOpen={open} setIsOpen={setOpen}>
                    <SheetClose onClick={() => setOpen(false)}>Close</SheetClose>
                </SheetContent>
            </Sheet>
        );
    };
    render(<TestComp />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByTestId('sheet-content')).toBeNull();
  });
});
