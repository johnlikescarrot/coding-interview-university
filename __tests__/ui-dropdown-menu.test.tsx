import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
  DropdownMenuPortal,
  DropdownMenuGroup
} from '../components/ui/dropdown-menu';
import * as React from 'react';

vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }: any) => <div>{children}</div>,
  Trigger: ({ children }: any) => <div>{children}</div>,
  Portal: ({ children }: any) => <div data-testid="dropdown-portal-mock">{children}</div>,
  Content: ({ children, className }: any) => <div className={className} data-testid="dropdown-content">{children}</div>,
  Group: ({ children }: any) => <div data-testid="dropdown-group">{children}</div>,
  Item: ({ children, className, onSelect }: any) => (
    <div className={className} onClick={onSelect} data-testid="dropdown-item">{children}</div>
  ),
  CheckboxItem: ({ children, className, checked }: any) => (
    <div className={className} data-checked={checked} data-testid="dropdown-checkbox-item">{children}</div>
  ),
  RadioGroup: ({ children, value }: any) => <div data-value={value} data-testid="dropdown-radio-group">{children}</div>,
  RadioItem: ({ children, className, value }: any) => (
    <div className={className} data-value={value} data-testid="dropdown-radio-item">{children}</div>
  ),
  Label: ({ children, className, ...props }: any) => <div className={className} data-testid="dropdown-label" {...props}>{children}</div>,
  Separator: ({ className }: any) => <div className={className} data-testid="dropdown-separator" />,
  Sub: ({ children }: any) => <div data-testid="dropdown-sub">{children}</div>,
  SubTrigger: ({ children, className, ...props }: any) => <div className={className} data-testid="dropdown-sub-trigger" {...props}>{children}</div>,
  SubContent: ({ children, className }: any) => <div className={className} data-testid="dropdown-sub-content">{children}</div>,
  ItemIndicator: ({ children }: any) => <div data-testid="dropdown-item-indicator">{children}</div>,
}));

describe('DropdownMenu component', () => {
  it('renders and handles item selection', async () => {
    const handleSelect = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
              <DropdownMenuLabel inset>Label</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSelect}>
                Item <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
              </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuCheckboxItem checked>Checkbox</DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value="a">
             <DropdownMenuRadioItem value="a">Radio A</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSub>
             <DropdownMenuSubTrigger inset>Sub</DropdownMenuSubTrigger>
             <DropdownMenuSubContent>SubContent</DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuPortal>
              <div data-testid="manual-portal">Manual</div>
          </DropdownMenuPortal>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    expect(screen.getByTestId('dropdown-label')).toHaveAttribute('data-inset', 'true');
    expect(screen.getByTestId('dropdown-item')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-radio-group')).toHaveAttribute('data-value', 'a');
    expect(screen.getByTestId('dropdown-separator')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-group')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('dropdown-item'));
    expect(handleSelect).toHaveBeenCalled();

    expect(screen.getByTestId('dropdown-checkbox-item')).toHaveAttribute('data-checked', 'true');
    expect(screen.getByTestId('dropdown-radio-item')).toHaveAttribute('data-value', 'a');
    expect(screen.getByTestId('dropdown-sub-trigger')).toHaveAttribute('data-inset', 'true');
    expect(screen.getByTestId('dropdown-sub-content')).toBeInTheDocument();

    const portals = screen.getAllByTestId('dropdown-portal-mock');
    expect(portals.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Manual')).toBeInTheDocument();
  });
});
