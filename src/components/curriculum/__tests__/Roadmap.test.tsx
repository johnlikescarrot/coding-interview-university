/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Roadmap from '../Roadmap';
import { useProgressStore } from '../../../store/useProgressStore';

vi.mock('../../../store/useProgressStore', () => ({
  useProgressStore: vi.fn(),
}));

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: any) => <div>{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children, onClick }: any) => <button type="button" onClick={onClick}>{children}</button>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange, id }: any) => (
    <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} id={id} />
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>,
}));

describe('Roadmap', () => {
  let toggleCheckbox: any;

  beforeEach(() => {
    vi.clearAllMocks();
    toggleCheckbox = vi.fn();
    (useProgressStore as any).mockReturnValue({
      completedCheckboxes: {},
      toggleCheckbox,
      language: 'en'
    });
  });

  const mockTopics = [{
    id: 's1',
    title: 'Section 1',
    checkboxes: [{ id: 'check-1', text: 'Task 1', completed: false }],
    subtopics: [
      {
        id: 'sub1',
        title: 'Subtopic 1',
        links: [{ title: 'Link 1', url: 'https://test.com' }],
        subtopics: [],
        checkboxes: [{ id: 'sub-check-1', text: 'Sub Task 1', completed: false }]
      }
    ]
  }];

  it('renders complex curriculum and handles interactions', () => {
    render(<Roadmap topics={mockTopics} />);

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Subtopic 1')).toBeInTheDocument();
    expect(screen.getByText('Link 1')).toBeInTheDocument();

    const checkbox = screen.getByLabelText('Task 1');
    fireEvent.click(checkbox);
    expect(toggleCheckbox).toHaveBeenCalledWith('s1', 'check-1');
  });

  it('calculates progress correctly with namespaced keys', () => {
    (useProgressStore as any).mockReturnValue({
      completedCheckboxes: { 's1:check-1': true },
      toggleCheckbox,
      language: 'en'
    });

    render(<Roadmap topics={mockTopics} />);
    // 1 completed out of 2 total (Task 1 and Sub Task 1)
    expect(screen.getByText(/50% Complete/i)).toBeInTheDocument();
  });
});
