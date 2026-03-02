import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurriculumView } from '../components/curriculum-view';
import { useProgress } from '../components/progress-provider';
import * as React from 'react';

vi.mock('../components/progress-provider', () => ({
  useProgress: vi.fn(),
}));

// Mock Radix Accordion
vi.mock('@radix-ui/react-accordion', () => ({
    Root: ({ children }: any) => <div data-testid="accordion-root">{children}</div>,
    Item: ({ children, value }: any) => <div data-testid="accordion-item" data-value={value}>{children}</div>,
    Header: ({ children }: any) => <h3>{children}</h3>,
    Trigger: ({ children, className }: any) => <button className={className}>{children}</button>,
    Content: ({ children }: any) => <div data-testid="accordion-content">{children}</div>,
}));

// Proxy Mock for Framer Motion to handle any component
vi.mock('framer-motion', () => {
    const motionProxy = new Proxy({}, {
        get: (target, prop) => {
            return ({ children, ...props }: any) => {
                const Tag = prop as any;
                return <Tag {...props}>{children}</Tag>;
            };
        }
    });
    return {
        motion: motionProxy,
        AnimatePresence: ({ children }: any) => <>{children}</>
    };
});

const mockSections = [
  {
    title: 'Section 1',
    topics: [
      { id: 't1', title: 'Topic 1', completed: false, resources: [{ title: 'Res 1', url: 'u1', type: 'unknown-type' as any as const }] },
      { id: 't2', title: 'Topic 2', completed: false, resources: [] },
    ]
  },
  {
    title: 'Empty Section',
    topics: []
  }
];

describe('CurriculumView', () => {
  it('renders sections and handles progress toggling', async () => {
    const toggleTopic = vi.fn();
    const setTotalTopics = vi.fn();
    (useProgress as any).mockReturnValue({
      completed: ['t1'],
      toggleTopic,
      setTotalTopics,
    });

    render(<CurriculumView sections={mockSections} />);

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.queryByText('Empty Section')).toBeNull();
    expect(setTotalTopics).toHaveBeenCalledWith(2);

    // Topic 1 check
    const topic1 = screen.getByText((c, el) => el?.textContent === 'Topic 1');
    expect(topic1).toHaveClass('line-through');

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(toggleTopic).toHaveBeenCalledWith('t2');

    expect(screen.getByText((c, el) => el?.textContent === 'Res 1')).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes('Resources for this challenge are emerging'))).toBeInTheDocument();
  });
});
