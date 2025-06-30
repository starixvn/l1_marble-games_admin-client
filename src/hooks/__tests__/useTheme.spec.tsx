import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../useTheme'

describe('useTheme', () => {
  const mockSetItem = vi.fn()
  const mockGetItem = vi.fn()
  const mockRemove = vi.fn()
  const mockClassList = {
    add: vi.fn(),
    remove: vi.fn(),
  }
  const mockDocumentElement = {
    classList: mockClassList,
  }
  const originalMatchMedia = window.matchMedia
  const originalDocumentElement = window.document.documentElement
  const originalLocalStorage = window.localStorage

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemove,
      },
      writable: true,
    })
    Object.defineProperty(window.document, 'documentElement', {
      value: mockDocumentElement,
      writable: true,
    })
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    Object.defineProperty(window.document, 'documentElement', {
      value: originalDocumentElement,
      writable: true,
    })
    window.localStorage = originalLocalStorage
  })

  it('should initialize theme from localStorage if present', () => {
    // Arrange
    mockGetItem.mockReturnValue('dark')

    // Act
    const { result } = renderHook(() => useTheme())

    // Assert
    expect(result.current.theme).toBe('dark')
  })

  it('should initialize theme from prefers-color-scheme if not in localStorage', () => {
    // Arrange
    mockGetItem.mockReturnValue(null)
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as ((query: string) => MediaQueryList)

    // Act
    const { result } = renderHook(() => useTheme())

    // Assert
    expect(result.current.theme).toBe('dark')
  })

  it('should set theme to light if prefers-color-scheme is not dark and not in localStorage', () => {
    // Arrange
    mockGetItem.mockReturnValue(null)
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as ((query: string) => MediaQueryList)

    // Act
    const { result } = renderHook(() => useTheme())

    // Assert
    expect(result.current.theme).toBe('light')
  })

  it('should update document class and localStorage when theme changes', () => {
    // Arrange
    mockGetItem.mockReturnValue('light')

    // Act
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.setTheme('dark')
    })

    // Assert
    expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark')
    expect(mockClassList.add).toHaveBeenCalledWith('dark')
    expect(mockSetItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should toggle theme between light and dark', () => {
    // Arrange
    mockGetItem.mockReturnValue('light')

    // Act
    const { result } = renderHook(() => useTheme())
    act(() => {
      result.current.toggleTheme()
    })

    // Assert
    expect(result.current.theme).toBe('dark')
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe('light')
  })
})
