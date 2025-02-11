
import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Jest matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

/**
 * Mock window.matchMedia
 * Required for components that use media queries
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Mock ResizeObserver
 * Required for components that observe element dimensions
 */
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = ResizeObserverMock;

/**
 * Mock Intersection Observer
 * Required for components that use intersection observer API
 * Implements the IntersectionObserver interface
 */
class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: readonly number[] = [0];
  
  constructor(
    private callback: IntersectionObserverCallback,
    private options?: IntersectionObserverInit
  ) {}

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

// Override the native IntersectionObserver with our mock
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock
});

/**
 * Mock Supabase client
 * Provides mock implementations for Supabase auth and database operations
 */
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
    })),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

