import { renderHook } from '@testing-library/react'
import { useProfile } from '../useProfile'

vi.mock('../useProfile', () => ({
  useProfile: vi.fn(),
}))

import { usePermission } from '../usePermission'
import { API_ENDPOINTS } from '@/api/api-endpoints'

describe('usePermission', () => {
  const mockUseProfile = vi.mocked(useProfile)

  const mockProfileData = {
    username: 'testuser',
    role: 'admin',
    allowedEndpoints: [
      API_ENDPOINTS.AUTH.PROFILE,
      API_ENDPOINTS.OPERATOR.LIST,
      API_ENDPOINTS.OPERATOR.GET,
      API_ENDPOINTS.GAME_CONFIG.LIST,
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when profile data is available', () => {
    it('should return true when user has all required permissions', () => {
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [API_ENDPOINTS.AUTH.PROFILE, API_ENDPOINTS.OPERATOR.LIST] 
      }))
      expect(result.current).toEqual({ isAllowed: true })
    })

    it('should return false when user lacks some permissions', () => {
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [API_ENDPOINTS.AUTH.PROFILE, API_ENDPOINTS.ADMIN_LOG] 
      }))
      expect(result.current).toEqual({ isAllowed: false })
    })

    it('should return true for single permission when user has it', () => {
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [API_ENDPOINTS.AUTH.PROFILE] 
      }))
      expect(result.current).toEqual({ isAllowed: true })
    })

    it('should return false for single permission when user lacks it', () => {
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [API_ENDPOINTS.ADMIN_LOG] 
      }))
      expect(result.current).toEqual({ isAllowed: false })
    })

    it('should return true for empty path array', () => {
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [] 
      }))
      expect(result.current).toEqual({ isAllowed: true })
    })
  })

  describe('when profile data is undefined', () => {
    it('should return false when profile data is undefined', () => {
      mockUseProfile.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [API_ENDPOINTS.AUTH.PROFILE] 
      }))
      expect(result.current).toEqual({ isAllowed: false })
    })

    it('should return false when profile data has no allowedEndpoints', () => {
      const profileWithoutEndpoints = {
        username: 'testuser',
        role: 'admin',
        allowedEndpoints: undefined,
      }
      mockUseProfile.mockReturnValue({
        data: profileWithoutEndpoints,
        isLoading: false,
        isError: false,
        error: null,
      } as unknown as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [API_ENDPOINTS.AUTH.PROFILE] 
      }))
      expect(result.current).toEqual({ isAllowed: false })
    })
  })

  describe('when profile is loading', () => {
    it('should return false when profile is loading', () => {
      mockUseProfile.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [API_ENDPOINTS.AUTH.PROFILE] 
      }))
      expect(result.current).toEqual({ isAllowed: false })
    })
  })

  describe('edge cases', () => {
    it('should handle multiple permissions correctly', () => {
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [
          API_ENDPOINTS.AUTH.PROFILE,
          API_ENDPOINTS.OPERATOR.LIST,
          API_ENDPOINTS.OPERATOR.GET,
          API_ENDPOINTS.GAME_CONFIG.LIST,
        ] 
      }))
      expect(result.current).toEqual({ isAllowed: true })
    })

    it('should return false when any permission is missing', () => {
      mockUseProfile.mockReturnValue({
        data: mockProfileData,
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useProfile>)
      const { result } = renderHook(() => usePermission({ 
        path: [
          API_ENDPOINTS.AUTH.PROFILE,
          API_ENDPOINTS.OPERATOR.LIST,
          API_ENDPOINTS.ADMIN_LOG, // This one is missing
        ] 
      }))
      expect(result.current).toEqual({ isAllowed: false })
    })
  })
})
