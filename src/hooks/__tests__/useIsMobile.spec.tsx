import { renderHook } from '@testing-library/react'
import { useIsMobile } from '../useIsMobile'

describe('useIsMobile', () => {
  const mockAddEventListener = vi.fn()
  const mockRemoveEventListener = vi.fn()
  const originalInnerWidth = window.innerWidth
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    })
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    }) as unknown as typeof window.matchMedia
  })

  afterEach(() => {
    window.innerWidth = originalInnerWidth
    window.matchMedia = originalMatchMedia
  })

  it('should return false when window width is greater than mobile breakpoint', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      value: 1024,
      writable: true,
    })

    // Act
    const { result } = renderHook(() => useIsMobile())

    // Assert
    expect(result.current).toBe(false)
  })

  it('should return true when window width is less than mobile breakpoint', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      value: 500,
      writable: true,
    })

    // Act
    const { result } = renderHook(() => useIsMobile())

    // Assert
    expect(result.current).toBe(true)
  })

  it('should return true when window width equals mobile breakpoint minus 1', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      value: 767,
      writable: true,
    })

    // Act
    const { result } = renderHook(() => useIsMobile())

    // Assert
    expect(result.current).toBe(true)
  })

  it('should return false when window width equals mobile breakpoint', () => {
    // Arrange
    Object.defineProperty(window, 'innerWidth', {
      value: 768,
      writable: true,
    })

    // Act
    const { result } = renderHook(() => useIsMobile())

    // Assert
    expect(result.current).toBe(false)
  })

  it('should add event listener for media query changes', () => {
    // Arrange

    // Act
    renderHook(() => useIsMobile())

    // Assert
    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)')
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('should remove event listener on cleanup', () => {
    // Arrange
    const { unmount } = renderHook(() => useIsMobile())

    // Act
    unmount()

    // Assert
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
