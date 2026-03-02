import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from '../components/ui/command';

vi.mock('cmdk', () => ({
  Command: Object.assign(({ children, className }: any) => <div className={className}>{children}</div>, {
    Input: ({ className, ...props }: any) => <input className={className} {...props} />,
    List: ({ children, className }: any) => <div className={className}>{children}</div>,
    Empty: ({ children, className }: any) => <div className={className}>{children}</div>,
    Group: ({ children, className, heading }: any) => (
      <div className={className}>
        {heading && <div>{heading}</div>}
        {children}
      </div>
    ),
    Item: ({ children, className, onSelect }: any) => (
      <div className={className} onClick={() => onSelect?.()}>
        {children}
      </div>
    ),
    Separator: ({ className }: any) => <hr className={className} />,
  }),
}));

describe('Command Component', () => {
  it('renders all subcomponents and handles selection', () => {
    const onSelect = vi.fn();
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>Empty</CommandEmpty>
          <CommandGroup heading="Group">
            <CommandItem onSelect={onSelect}>
              Item 1 <CommandShortcut>CTRL+K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Group')).toBeInTheDocument();
    // Fixed: use regex to handle text split across elements
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    expect(screen.getByText('CTRL+K')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Item 1/i));
    expect(onSelect).toHaveBeenCalled();
  });
});
