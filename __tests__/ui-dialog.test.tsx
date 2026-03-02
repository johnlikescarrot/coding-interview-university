import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogPortal } from '../components/ui/dialog';
import * as React from 'react';

const DialogContext = React.createContext<{ isOpen: boolean; setIsOpen: (v: boolean) => void }>({
  isOpen: false,
  setIsOpen: () => {},
});

vi.mock('@radix-ui/react-dialog', () => {
  return {
    Root: ({ children, open, onOpenChange }: any) => {
      const [isOpen, setIsOpen] = React.useState(open || false);
      React.useEffect(() => {
        if (open !== undefined) setIsOpen(open);
      }, [open]);

      const handleOpenChange = (v: boolean) => {
        setIsOpen(v);
        onOpenChange?.(v);
      };

      return (
        <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
          {children}
        </DialogContext.Provider>
      );
    },
    Trigger: ({ children }: any) => {
      const { setIsOpen } = React.useContext(DialogContext);
      return <button onClick={() => setIsOpen(true)}>{children}</button>;
    },
    Portal: ({ children }: any) => {
        const { isOpen } = React.useContext(DialogContext);
        if (!isOpen) return null;
        return <div data-testid="dialog-portal-mock">{children}</div>;
    },
    Overlay: ({ className }: any) => {
        const { isOpen } = React.useContext(DialogContext);
        if (!isOpen) return null;
        return <div className={className} data-testid="dialog-overlay" />;
    },
    Content: ({ children, className }: any) => {
      const { isOpen, setIsOpen } = React.useContext(DialogContext);
      if (!isOpen) return null;
      return (
        <div className={className} data-testid="dialog-content-inner">
          {children}
          <button aria-label="Mock Close" onClick={() => setIsOpen(false)}>X</button>
        </div>
      );
    },
    Title: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
    Description: ({ children, className }: any) => <p className={className}>{children}</p>,
    Close: ({ children, asChild }: any) => {
      const { setIsOpen } = React.useContext(DialogContext);
      if (asChild && React.isValidElement(children)) {
          return React.cloneElement(children as any, { onClick: () => setIsOpen(false) });
      }
      return <button onClick={() => setIsOpen(false)}>{children}</button>;
    },
  };
});

describe('Dialog component', () => {
  it('opens and closes correctly', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Title</DialogTitle>
                <DialogDescription>Description</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton>
                <DialogClose>Close Manual</DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText('Open'));

    expect(screen.getByTestId('dialog-portal-mock')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-content-inner')).toBeInTheDocument();

    // Close via close button in footer (the one from showCloseButton)
    // We use getAllByRole to find the "Close" button among others
    const closeButtons = screen.getAllByRole('button', { name: /Close/i });
    const footerClose = closeButtons.find(b => b.textContent === 'Close');
    if (footerClose) fireEvent.click(footerClose);

    expect(screen.queryByTestId('dialog-content-inner')).toBeNull();

    // Re-open and close via manual Close component
    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Close Manual'));
    expect(screen.queryByTestId('dialog-content-inner')).toBeNull();
  });

  it('renders portal separately if needed', () => {
      render(
          <Dialog open={true}>
              <DialogPortal>
                  <div data-testid="separate-portal-child">Child</div>
              </DialogPortal>
          </Dialog>
      );
      expect(screen.getByTestId('dialog-portal-mock')).toBeInTheDocument();
      expect(screen.getByTestId('separate-portal-child')).toBeInTheDocument();
  });
});
