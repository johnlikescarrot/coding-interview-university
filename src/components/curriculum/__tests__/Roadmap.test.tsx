/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Roadmap from '../Roadmap';

vi.mock('../../../store/useProgressStore', () => ({
  useProgressStore: vi.fn((selector) => {
    const mockState = {
      completedCheckboxes: {},
      toggleCheckbox: vi.fn(),
    };
    return selector ? selector(mockState) : mockState;
  }),
}));

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: any) => <div>{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children, onClick }: any) => <button type="button" onClick={onClick}>{children}</button>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange }: any) => (
    <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>,
}));

describe('Roadmap', () => {
  const mockTopics = [{
    id: 's1',
    title: 'Section 1',
    checkboxes: [{ id: 'i1', text: 'Item 1', completed: false }],
    subtopics: []
  }];

  it('renders section', () => {
    render(<Roadmap topics={mockTopics} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
  });
});
