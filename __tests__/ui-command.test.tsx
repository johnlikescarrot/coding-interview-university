import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandDialog,
  CommandShortcut
} from '../components/ui/command';
import * as React from 'react';

// Mock cmdk to render simply for coverage
vi.mock('cmdk', () => ({
  Command: Object.assign(({ children, className }: any) => <div className={className}>{children}</div>, {
    Input: ({ className, ...props }: any) => <input className={className} {...props} />,
    List: ({ children, className }: any) => <div className={className}>{children}</div>,
    Empty: ({ children, className }: any) => <div className={className}>{children}</div>,
    Group: ({ children, className, heading }: any) => (
      <div className={className}>
        <div>{heading}</div>
        {children}
      </div>
    ),
    Item: ({ children, className, onSelect }: any) => (
      <div className={className} onClick={() => onSelect?.()}>
        {children}
      </div>
    ),
    Separator: ({ className }: any) => <div className={className} />,
  })
}));

describe('Command component', () => {
  it('renders and allows item selection', () => {
    const onSelect = vi.fn();
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Group">
            <CommandItem onSelect={onSelect}>
                Item 1 <CommandShortcut>CTRL+K</CommandShortcut>
            </CommandItem>
            <CommandSeparator />
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('CTRL+K')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Item 1'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('renders in a dialog correctly', () => {
      render(
          <CommandDialog open={true}>
              <CommandInput placeholder="Dialog Search" />
          </CommandDialog>
      );
      expect(screen.getByPlaceholderText('Dialog Search')).toBeInTheDocument();
  });
});
