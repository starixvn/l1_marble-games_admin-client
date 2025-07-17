import { renderHook } from '@testing-library/react'
import { useProfile } from '../useProfile'

vi.mock('../useProfile', () => ({
  useProfile: vi.fn(),
}))

import { useMenu } from '../useMenu'
import { API_ENDPOINTS } from '@/api/api-endpoints'

describe('useMenu', () => {
  const mockUseProfile = vi.mocked(useProfile)

  const mockProfileData = {
    username: 'testuser',
    role: 'admin',
    allowedEndpoints: [
      API_ENDPOINTS.AUTH.PROFILE,
      API_ENDPOINTS.OPERATOR.LIST,
      API_ENDPOINTS.OPERATOR.GET,
      API_ENDPOINTS.GAME_CONFIG.LIST,
      API_ENDPOINTS.GAME_CONFIG.GET,
      API_ENDPOINTS.GAME_CONFIG_SCHEMA.LIST,
      API_ENDPOINTS.API_LOG,
      API_ENDPOINTS.ADMIN_LOG,
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when profile is loading', () => {
    it('should return loading state', () => {
      // Arrange
      mockUseProfile.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)

      // Act
      const { result } = renderHook(() => useMenu())

      // Assert
      expect(result.current).toEqual(expect.objectContaining({
        menu: [],
        isLoading: true,
        profile: undefined,
      }))
    })
  })

  describe('when profile data is available', () => {
    it('should return all menus when user has all permissions', () => {
      // Arrange
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)

      // Act
      const { result } = renderHook(() => useMenu())

      // Assert
      const expectedMenu = [
        { title: 'Home', url: '/', icon: expect.any(Object), loader: [API_ENDPOINTS.AUTH.PROFILE] },
        { title: 'Operators', url: '/operators', icon: expect.any(Object), loader: [API_ENDPOINTS.OPERATOR.LIST, API_ENDPOINTS.OPERATOR.GET] },
        { title: 'Game Configs', url: '/game-configs', icon: expect.any(Object), loader: [API_ENDPOINTS.GAME_CONFIG.LIST, API_ENDPOINTS.GAME_CONFIG.GET] },
        { title: 'Game Integrations', url: '/game-integrations', icon: expect.any(Object), loader: [API_ENDPOINTS.GAME_CONFIG.LIST, API_ENDPOINTS.OPERATOR.LIST] },
        { title: 'Game Config Schemas', url: '/game-config-schemas', icon: expect.any(Object), loader: [API_ENDPOINTS.GAME_CONFIG_SCHEMA.LIST] },
        { title: 'Api Logs', url: '/logs-api', icon: expect.any(Object), loader: [API_ENDPOINTS.API_LOG] },
        { title: 'Admin Log', url: '/admin-log', icon: expect.any(Object), loader: [API_ENDPOINTS.ADMIN_LOG] },
      ]
      expect(result.current).toEqual({
        menu: expectedMenu,
        isLoading: false,
        profile: 'testuser',
      })
    })

    it('should filter menus based on user permissions', () => {
      // Arrange
      const limitedProfileData = {
        ...mockProfileData,
        allowedEndpoints: [
          API_ENDPOINTS.AUTH.PROFILE,
          API_ENDPOINTS.OPERATOR.LIST,
          API_ENDPOINTS.OPERATOR.GET,
        ],
      }
      mockUseProfile.mockReturnValue({
        data: limitedProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)

      // Act
      const { result } = renderHook(() => useMenu())

      // Assert
      const expectedMenu = [
        { title: 'Home', url: '/', icon: expect.any(Object), loader: [API_ENDPOINTS.AUTH.PROFILE] },
        { title: 'Operators', url: '/operators', icon: expect.any(Object), loader: [API_ENDPOINTS.OPERATOR.LIST, API_ENDPOINTS.OPERATOR.GET] },
      ]
      expect(result.current).toEqual({
        menu: expectedMenu,
        isLoading: false,
        profile: 'testuser',
      })
    })

    it('should return only Home menu when user has minimal permissions', () => {
      // Arrange
      const minimalProfileData = {
        ...mockProfileData,
        allowedEndpoints: [API_ENDPOINTS.AUTH.PROFILE],
      }
      mockUseProfile.mockReturnValue({
        data: minimalProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)

      // Act
      const { result } = renderHook(() => useMenu())

      // Assert
      const expectedMenu = [
        { title: 'Home', url: '/', icon: expect.any(Object), loader: [API_ENDPOINTS.AUTH.PROFILE] },
      ]
      expect(result.current).toEqual({
        menu: expectedMenu,
        isLoading: false,
        profile: 'testuser',
      })
    })

    it('should return empty menu when user has no permissions', () => {
      // Arrange
      const noPermissionProfileData = {
        ...mockProfileData,
        allowedEndpoints: [],
      }
      mockUseProfile.mockReturnValue({
        data: noPermissionProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)

      // Act
      const { result } = renderHook(() => useMenu())

      // Assert
      expect(result.current).toEqual({
        menu: [],
        isLoading: false,
        profile: 'testuser',
      })
    })
  })

  describe('when profile data is undefined', () => {
    it('should return empty menu and undefined profile', () => {
      // Arrange
      mockUseProfile.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)

      // Act
      const { result } = renderHook(() => useMenu())

      // Assert
      expect(result.current).toEqual({
        menu: [],
        isLoading: false,
        profile: undefined,
      })
    })
  })

  describe('menu structure', () => {
    it('should return menus with correct structure', () => {
      // Arrange
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)

      // Act
      const { result } = renderHook(() => useMenu())

      // Assert
      const expectedMenu = [
        { title: 'Home', url: '/', icon: expect.any(Object), loader: [API_ENDPOINTS.AUTH.PROFILE] },
        { title: 'Operators', url: '/operators', icon: expect.any(Object), loader: [API_ENDPOINTS.OPERATOR.LIST, API_ENDPOINTS.OPERATOR.GET] },
        { title: 'Game Configs', url: '/game-configs', icon: expect.any(Object), loader: [API_ENDPOINTS.GAME_CONFIG.LIST, API_ENDPOINTS.GAME_CONFIG.GET] },
        { title: 'Game Integrations', url: '/game-integrations', icon: expect.any(Object), loader: [API_ENDPOINTS.GAME_CONFIG.LIST, API_ENDPOINTS.OPERATOR.LIST] },
        { title: 'Game Config Schemas', url: '/game-config-schemas', icon: expect.any(Object), loader: [API_ENDPOINTS.GAME_CONFIG_SCHEMA.LIST] },
        { title: 'Api Logs', url: '/logs-api', icon: expect.any(Object), loader: [API_ENDPOINTS.API_LOG] },
        { title: 'Admin Log', url: '/admin-log', icon: expect.any(Object), loader: [API_ENDPOINTS.ADMIN_LOG] },
      ]
      expect(result.current).toEqual({
        menu: expectedMenu,
        isLoading: false,
        profile: 'testuser',
      })
    })
  })
})
