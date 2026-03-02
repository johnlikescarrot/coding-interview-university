import "@testing-library/jest-dom/vitest"
import { expect, vi } from 'vitest'
import { queryAllByAttribute, screen } from '@testing-library/react'

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Add strict getByDataSlot helper
export const getByDataSlot = (container: HTMLElement, id: string) => {
  const elements = queryAllByAttribute('data-slot', container, id);
  if (elements.length === 0) {
    throw new Error(`Could not find element with data-slot="${id}"`);
  }
  if (elements.length > 1) {
    throw new Error(`Multiple elements found with data-slot="${id}"`);
  }
  return elements[0];
};

// Attach to screen object for convenience
(screen as any).getByDataSlot = (id: string) => getByDataSlot(document.body, id);
