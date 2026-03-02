import "@testing-library/jest-dom/vitest"
import { vi } from 'vitest'
import { screen, queryByAttribute } from '@testing-library/react'

// Polyfill ResizeObserver for tests (needed for cmdk/Command)
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

// Custom helper for data-slot (shadcn/ui v4 uses data-slot extensively)
const getByDataSlot = (id: string) => {
  const el = queryByAttribute('data-slot', document.body, id);
  if (!el) throw new Error(`Could not find element with data-slot="${id}"`);
  return el;
};

// Extend screen
Object.assign(screen, { getByDataSlot });
