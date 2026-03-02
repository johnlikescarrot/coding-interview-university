import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';

vi.mock('@radix-ui/react-accordion', () => {
    return {
        Root: ({ children, className }: any) => <div className={className}>{children}</div>,
        Item: ({ children, className, value }: any) => <div className={className} data-testid="item">{children}</div>,
        Header: ({ children }: any) => <div>{children}</div>,
        Trigger: ({ children, className }: any) => <button className={className}>{children}</button>,
        Content: ({ children, className }: any) => <div className={className}>{children}</div>,
    };
});

describe('Accordion UI component', () => {
  it('renders correctly', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="item-class">
          <AccordionTrigger className="trigger-class">Trigger</AccordionTrigger>
          <AccordionContent className="content-class">Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByTestId('item')).toHaveClass('item-class');
  });
});
