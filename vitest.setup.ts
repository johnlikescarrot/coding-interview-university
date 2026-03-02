import "@testing-library/jest-dom/vitest"
import { vi } from 'vitest'

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

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});
