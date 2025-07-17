import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'


describe('Base Axios Configuration', () => {
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
    const { apiClient } = await import('../base.axios')

    // Assert
    expect(apiClient.defaults.baseURL).toBe('https://test-api.com')
  })

  it('should set correct default headers', async () => {
    // Arrange
    window.appConfig = { apiBaseUrl: 'https://test-api.com' }
    const { apiClient } = await import('../base.axios')

    // Assert
    expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('should throw if appConfig is missing', async () => {
    // Arrange
    window.appConfig = undefined
    const { getApiUrl } = await import('../../lib/url')

    // Assert
    expect(() => getApiUrl()).toThrow('Missing app config base api url')
  })

  it('should maintain axios instance across imports', async () => {
    // Arrange
    window.appConfig = { apiBaseUrl: 'https://test-api.com' }
    const { apiClient: client1 } = await import('../base.axios')
    const { apiClient: client2 } = await import('../base.axios')

    // Assert
    expect(client1).toBe(client2)
  })
})
