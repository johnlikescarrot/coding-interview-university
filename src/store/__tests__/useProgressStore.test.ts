import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../useProgressStore';

describe('useProgressStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useProgressStore.setState({
      completedTopics: {},
      completedCheckboxes: {},
      language: 'en',
    });
  });

  it('should initialize with default values', () => {
    const state = useProgressStore.getState();
    expect(state.completedTopics).toEqual({});
    expect(state.completedCheckboxes).toEqual({});
    expect(state.language).toBe('en');
  });

  it('should toggle completion of a topic', () => {
    const topicId = 'test-topic-1';
    useProgressStore.getState().toggleTopic(topicId);
    expect(useProgressStore.getState().completedTopics[topicId]).toBe(true);

    useProgressStore.getState().toggleTopic(topicId);
    expect(useProgressStore.getState().completedTopics[topicId]).toBe(false);
  });

  it('should toggle a checkbox', () => {
    const checkboxId = 'check-1';
    useProgressStore.getState().toggleCheckbox(checkboxId);
    expect(useProgressStore.getState().completedCheckboxes[checkboxId]).toBe(true);

    useProgressStore.getState().toggleCheckbox(checkboxId);
    expect(useProgressStore.getState().completedCheckboxes[checkboxId]).toBe(false);
  });

  it('should set language', () => {
    useProgressStore.getState().setLanguage('es');
    expect(useProgressStore.getState().language).toBe('es');
  });
});
