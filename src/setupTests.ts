import '@testing-library/jest-dom'
import { vi } from 'vitest'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

Object.defineProperty(window, 'appConfig', {
  value: {
    apiBaseUrl: 'http://localhost:3000/api',
  },
  writable: true,
})

globalThis.EventTarget = EventTarget
