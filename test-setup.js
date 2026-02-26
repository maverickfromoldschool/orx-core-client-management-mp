/* eslint-disable max-classes-per-file */
/* global jest */
/* eslint-disable global-require */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* eslint-disable lines-between-class-members */

const noop = () => {};
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', {value: noop, writable: true});
}

// Mock axios globally in tests to prevent accidental real network calls
try {
  // jest is available in the test environment; guard in case this file is executed elsewhere
  if (typeof jest !== 'undefined' && jest && typeof jest.mock === 'function') {
    jest.mock('axios');
  }
} catch (e) {
  // ignore — if jest isn't available yet, tests may mock axios locally
}

// Add TextEncoder and TextDecoder polyfills for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const {TextEncoder, TextDecoder} = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock IntersectionObserver for DataGrid
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver for DataGrid
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock getComputedStyle for DataGrid
if (typeof window !== 'undefined') {
  window.getComputedStyle = () => ({
    getPropertyValue: () => ''
  });
}
