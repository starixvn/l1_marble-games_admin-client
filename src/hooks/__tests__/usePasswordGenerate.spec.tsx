import { renderHook } from '@testing-library/react'
import { usePasswordGenerate } from '@/hooks/usePasswordGenerate'
import { useErrorHandledMutationCall } from '@/hooks/useErrorHandledMutationCall'
import { changePassword } from '@/api/auth.api'

// Mock the dependencies
vi.mock('@/hooks/useErrorHandledMutationCall')
vi.mock('@/api/auth.api')

const mockUseErrorHandledMutationCall = useErrorHandledMutationCall as ReturnType<typeof vi.fn>
const mockChangePassword = changePassword as ReturnType<typeof vi.fn>

describe('usePasswordGenerate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock the return value of useErrorHandledMutationCall
    mockUseErrorHandledMutationCall.mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
      data: undefined,
    })
  })

  it('should use useErrorHandledMutationCall with changePassword function', () => {
    renderHook(() => usePasswordGenerate())

    expect(mockUseErrorHandledMutationCall).toHaveBeenCalledWith({
      mutationFn: mockChangePassword,
    })
  })

  it('should return the expected properties from useErrorHandledMutationCall', () => {
    const mockMutate = vi.fn()
    const mockData = { username: 'test', password: 'newpass' }
    
    mockUseErrorHandledMutationCall.mockReturnValue({
      isPending: true,
      mutate: mockMutate,
      data: mockData,
    })

    const { result } = renderHook(() => usePasswordGenerate())

    expect(result.current).toEqual({
      isPending: true,
      mutate: mockMutate,
      data: mockData,
    })
  })
})
