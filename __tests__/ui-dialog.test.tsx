import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent } from '../components/ui/dialog';
import * as React from 'react';

vi.mock('@radix-ui/react-dialog', () => {
  return {
    Root: ({ children }: any) => <div>{children}</div>,
    Trigger: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
    Portal: ({ children }: any) => <div>{children}</div>,
    Overlay: () => <div />,
    Content: ({ children, isOpen, setIsOpen }: any) => (
      isOpen ? <div data-testid="dialog-content">{children}<button aria-label="Close" onClick={() => setIsOpen(false)}>X</button></div> : null
    ),
    Header: ({ children }: any) => <div>{children}</div>,
    Footer: ({ children }: any) => <div>{children}</div>,
    Title: ({ children }: any) => <h2>{children}</h2>,
    Description: ({ children }: any) => <p>{children}</p>,
    Close: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  };
});

describe('Dialog Component', () => {
  it('opens and closes correctly', () => {
    const TestComp = () => {
        const [open, setOpen] = React.useState(false);
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger onClick={() => setOpen(true)}>Open</DialogTrigger>
                <DialogContent isOpen={open} setIsOpen={setOpen}><h2>Title</h2></DialogContent>
            </Dialog>
        );
    };
    render(<TestComp />);
    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(screen.queryByTestId('dialog-content')).toBeNull();
  });
});
