import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import * as React from 'react';

describe('Accordion component', () => {
  it('renders and allows toggling items', async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('data-state', 'closed');

    // Toggle open
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(screen.getByText(/Yes. It adheres/)).toBeInTheDocument();

    // Toggle closed
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'closed');
  });

  it('applies custom classNames correctly', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="item-class">
          <AccordionTrigger className="trigger-class">Trigger</AccordionTrigger>
          <AccordionContent className="content-class">Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByTestId('accordion-item-container')).toHaveClass('item-class');
    // Note: Radix UI primitives might wrap or use different data-slots.
    // I will check the actual rendered output if this fails.
  });
});
