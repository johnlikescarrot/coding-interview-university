import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import * as React from 'react';

// Mock Radix UI Tabs
vi.mock('@radix-ui/react-tabs', () => {
    let activeValue: string = '';
    return {
        Root: ({ children, defaultValue }: any) => {
            const [active, setActive] = React.useState(defaultValue);
            return (
                <div data-active={active}>
                    {React.Children.map(children, child =>
                        React.cloneElement(child, { active, setActive })
                    )}
                </div>
            );
        },
        List: ({ children, active, setActive }: any) => (
            <div>
                {React.Children.map(children, child =>
                    React.cloneElement(child, { active, setActive })
                )}
            </div>
        ),
        Trigger: ({ children, value, active, setActive }: any) => (
            <button onClick={() => setActive(value)} data-state={active === value ? 'active' : 'inactive'}>
                {children}
            </button>
        ),
        Content: ({ children, value, active }: any) => (
            active === value ? <div>{children}</div> : null
        ),
    };
});

describe('Tabs component', () => {
  it('switches between tabs correctly', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });
});
