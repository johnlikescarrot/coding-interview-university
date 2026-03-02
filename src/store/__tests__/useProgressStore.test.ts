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
      useProgressStore.getState().setLanguage('en');
    });

    it('should set language', () => {
      useProgressStore.getState().setLanguage('es');
      expect(useProgressStore.getState().language).toBe('es');
    });

    it('should toggle a checkbox with namespacing', () => {
      const topicId = 'topic-1';
      const checkboxId = 'check-1';
      const namespacedKey = `${topicId}:${checkboxId}`;

      useProgressStore.getState().toggleCheckbox(topicId, checkboxId);
      expect(useProgressStore.getState().completedCheckboxes[namespacedKey]).toBe(true);

      useProgressStore.getState().toggleCheckbox(topicId, checkboxId);
      expect(useProgressStore.getState().completedCheckboxes[namespacedKey]).toBe(false);
    });
  });
});
