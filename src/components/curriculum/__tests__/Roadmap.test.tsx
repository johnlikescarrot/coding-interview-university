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
  Accordion: vi.fn(({ children }: any) => <div>{children}</div>),
  AccordionItem: vi.fn(({ children }: any) => <div>{children}</div>),
  AccordionTrigger: vi.fn(({ children, onClick }: any) => <button onClick={onClick}>{children}</button>),
  AccordionContent: vi.fn(({ children }: any) => <div>{children}</div>),
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: vi.fn(({ checked, onCheckedChange }: any) => (
    <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
  )),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: vi.fn(({ children }: any) => <span>{children}</span>),
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
