import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurriculumView } from '../components/curriculum-view';
import { useProgress } from '../components/progress-provider';

vi.mock('../components/progress-provider', () => ({
  useProgress: vi.fn(),
}));

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

  it('renders all resource types and handles empty path', () => {
    const sections = [
      {
        title: 'Section 1',
        topics: [
          {
            id: 't1',
            title: 'Topic 1',
            completed: false,
            resources: [
                { title: 'R1', url: 'u1', type: 'video' as const },
                { title: 'R2', url: 'u2', type: 'book' as const },
                { title: 'R3', url: 'u3', type: 'interactive' as const },
                { title: 'R4', url: 'u4', type: 'article' as const },
                { title: 'R5', url: 'u5', type: 'other' as const }
            ]
          },
        ]
      },
    ];

    render(<CurriculumView sections={sections} />);
    const trigger = screen.getByText('Topic 1');
    fireEvent.click(trigger);

    expect(screen.getByText('R1')).toBeInTheDocument();
    expect(screen.getByText('R2')).toBeInTheDocument();
    expect(screen.getByText('R3')).toBeInTheDocument();
    expect(screen.getByText('R4')).toBeInTheDocument();
    expect(screen.getByText('R5')).toBeInTheDocument();
  });
});
