import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';

vi.mock('@radix-ui/react-accordion', () => {
    return {
        Root: ({ children, className, collapsible, ...props }: any) => <div className={className} {...props}>{children}</div>,
        Item: ({ children, className, value, ...props }: any) => <div className={className} data-value={value} {...props}>{children}</div>,
        Header: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        Trigger: ({ children, className, ...props }: any) => <button type="button" className={className} {...props}>{children}</button>,
        Content: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    };
});

describe('Accordion UI component', () => {
  it('renders and supports prop forwarding', () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1" className="item-class" data-testid="accordion-item">
          <AccordionTrigger className="trigger-class">Trigger</AccordionTrigger>
          <AccordionContent className="content-class">Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-item')).toHaveClass('item-class');
    expect(screen.getByText('Trigger')).toHaveAttribute('type', 'button');
  });
});
