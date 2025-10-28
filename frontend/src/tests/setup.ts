/**
 * Vitest Setup File
 * 
 * Global setup for unit and integration tests
 */

import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { customMatchers } from './utils/test-utils';

// Extend expect with custom matchers
expect.extend(customMatchers);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
    return setTimeout(callback, 16);
};

global.cancelAnimationFrame = (id: number) => {
    clearTimeout(id);
};

// Mock performance.now
Object.defineProperty(window, 'performance', {
    value: {
        now: () => Date.now(),
        mark: () => { },
        measure: () => { },
        getEntriesByType: () => [],
        getEntriesByName: () => [],
    },
});

// Mock localStorage
const localStorageMock = {
    getItem: (key: string) => localStorageMock[key] || null,
    setItem: (key: string, value: string) => {
        localStorageMock[key] = value;
    },
    removeItem: (key: string) => {
        delete localStorageMock[key];
    },
    clear: () => {
        Object.keys(localStorageMock).forEach(key => {
            if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
                delete localStorageMock[key];
            }
        });
    },
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
    getItem: (key: string) => sessionStorageMock[key] || null,
    setItem: (key: string, value: string) => {
        sessionStorageMock[key] = value;
    },
    removeItem: (key: string) => {
        delete sessionStorageMock[key];
    },
    clear: () => {
        Object.keys(sessionStorageMock).forEach(key => {
            if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
                delete sessionStorageMock[key];
            }
        });
    },
};

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});

// Mock URL.createObjectURL
global.URL.createObjectURL = () => 'mock-url';
global.URL.revokeObjectURL = () => { };

// Mock fetch
global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    return new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
};

// Setup and teardown
beforeAll(() => {
    // Global setup before all tests
});

afterEach(() => {
    // Cleanup after each test
    cleanup();

    // Clear all mocks
    vi.clearAllMocks();

    // Clear storage
    localStorage.clear();
    sessionStorage.clear();
});

afterAll(() => {
    // Global cleanup after all tests
});