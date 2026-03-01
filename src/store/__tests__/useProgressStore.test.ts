import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../useProgressStore';

describe('useProgressStore', () => {
  it('should initialize with default values', () => {
    const state = useProgressStore.getState();
    expect(state.completedCheckboxes).toEqual({});
    expect(state.language).toBe('en');
  });

  describe('mutations', () => {
    beforeEach(() => {
      useProgressStore.getState().resetProgress();
    });

    it('should set language', () => {
      useProgressStore.getState().setLanguage('es');
      expect(useProgressStore.getState().language).toBe('es');
    });

    it('should toggle a checkbox', () => {
      const topicId = 'topic-1';
      const checkboxId = 'check-1';

      useProgressStore.getState().toggleCheckbox(topicId, checkboxId);
      expect(useProgressStore.getState().completedCheckboxes[checkboxId]).toBe(true);

      useProgressStore.getState().toggleCheckbox(topicId, checkboxId);
      expect(useProgressStore.getState().completedCheckboxes[checkboxId]).toBe(false);
    });
  });
});
