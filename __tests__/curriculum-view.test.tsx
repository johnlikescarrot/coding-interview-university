import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurriculumView } from '../components/curriculum-view';
import { useProgress } from '../components/progress-provider';

vi.mock('../components/progress-provider', () => ({
  useProgress: vi.fn(),
}));

// Fixed: Destructure and discard framer-motion props to avoid React unknown-prop warnings
vi.mock('framer-motion', () => {
    const motionProxy = new Proxy({}, {
        get: (target, prop) => {
            return ({ children, initial, whileInView, viewport, transition, animate, ...props }: any) => {
                const Tag = prop as any;
                return <Tag {...props}>{children}</Tag>;
            };
        }
    });
    return {
        motion: motionProxy,
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

describe('CurriculumView', () => {
  const toggleTopic = vi.fn();
  const setTotalTopics = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useProgress as any).mockReturnValue({
      completed: [],
      toggleTopic,
      setTotalTopics,
    });
  });

  it('renders sections and handles progress toggling', () => {
    const sections = [
      {
        title: 'Section 1',
        topics: [
          { id: 't1', title: 'Topic 1', completed: false, resources: [{ title: 'R1', url: 'u1', type: 'article' as const }] },
          { id: 't2', title: 'Topic 2', completed: false, resources: [] },
        ]
      },
      { title: 'Empty Section', topics: [] }
    ];

    render(<CurriculumView sections={sections} />);

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.queryByText('Empty Section')).toBeNull();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(toggleTopic).toHaveBeenCalledWith('t2');
    expect(setTotalTopics).toHaveBeenCalledWith(2);
  });
});
