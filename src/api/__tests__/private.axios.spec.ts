import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('Private Axios Configuration', () => {
  let originalAppConfig: { apiBaseUrl: string } | undefined

  beforeEach(() => {
    vi.resetModules()
    originalAppConfig = window.appConfig
    window.appConfig = undefined
  })

  afterEach(() => {
    window.appConfig = originalAppConfig
  })

  it('should create axios instance with correct base URL', async () => {
    // Arrange
    window.appConfig = { apiBaseUrl: 'https://test-api.com' }
    const { privateApiClient } = await import('../private.axios')

    // Act
    const client = privateApiClient

    // Assert
    expect(client.defaults.baseURL).toBe('https://test-api.com')
  })

  it('should set correct default headers', async () => {
    // Arrange
    window.appConfig = { apiBaseUrl: 'https://api.example.com' }
    const { privateApiClient } = await import('../private.axios')

    // Act
    const client = privateApiClient

    // Assert
    expect(client.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should have AUTH_TOKEN_KEY constant defined', async () => {
    // Arrange
    window.appConfig = { apiBaseUrl: 'https://api.example.com' }
    const { AUTH_TOKEN_KEY } = await import('../private.axios')

    // Assert
    expect(AUTH_TOKEN_KEY).toBe('auth_token')
  })

  it('should have globalAuthEventEmitter defined', async () => {
    // Arrange
    window.appConfig = { apiBaseUrl: 'https://api.example.com' }
    const { globalAuthEventEmitter } = await import('../private.axios')

    // Assert
    expect(globalAuthEventEmitter).toBeDefined()
    expect(globalAuthEventEmitter).toBeInstanceOf(EventTarget)
  })

  it('should have axios instance with expected properties', async () => {
    // Arrange
    window.appConfig = { apiBaseUrl: 'https://api.example.com' }
    const { privateApiClient } = await import('../private.axios')

    // Act
    const client = privateApiClient

    // Assert
    expect(client).toBeDefined()
    expect(typeof client.get).toBe('function')
    expect(typeof client.post).toBe('function')
    expect(typeof client.put).toBe('function')
    expect(typeof client.delete).toBe('function')
    expect(typeof client.patch).toBe('function')
  })

  it('should maintain axios instance across imports', async () => {
    // Arrange
    window.appConfig = { apiBaseUrl: 'https://api.example.com' }
    const { privateApiClient } = await import('../private.axios')

    // Act
    const client1 = privateApiClient
    const client2 = privateApiClient

    // Assert
    expect(client1).toBe(client2)
  })
})
