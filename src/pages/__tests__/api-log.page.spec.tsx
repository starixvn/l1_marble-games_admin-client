import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiLogsPage } from '../api-log.page'

// Mock external dependencies
vi.mock('@/components/layouts/admin.layout', () => ({
  AdminLayout: vi.fn(),
}))

vi.mock('@/components/api-logs/api-log', () => ({
  ApiLog: vi.fn(),
}))

// Import mocked functions
import { AdminLayout } from '@/components/layouts/admin.layout'
import { ApiLog } from '@/components/api-logs/api-log'

const mockAdminLayout = vi.mocked(AdminLayout)
const mockApiLog = vi.mocked(ApiLog)

describe('ApiLogsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    mockAdminLayout.mockImplementation(({ children }) => (
      <div data-testid="admin-layout">
        <header data-testid="admin-header">Admin Header</header>
        <main data-testid="admin-main">{children}</main>
      </div>
    ))
    
    mockApiLog.mockImplementation(() => (
      <div data-testid="api-log-component">
        <div data-testid="api-log-fields">API Log Fields</div>
        <div data-testid="api-log-table">API Log Table</div>
      </div>
    ))
  })

  it('should render the page with admin layout', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
    expect(mockAdminLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.any(Object),
      }),
      undefined
    )
  })

  it('should render the ApiLog component inside admin layout', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    expect(screen.getByTestId('api-log-component')).toBeInTheDocument()
    expect(mockApiLog).toHaveBeenCalledWith({}, undefined)
  })

  it('should have correct page structure', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    expect(screen.getByTestId('admin-header')).toBeInTheDocument()
    expect(screen.getByTestId('admin-main')).toBeInTheDocument()
    expect(screen.getByTestId('api-log-fields')).toBeInTheDocument()
    expect(screen.getByTestId('api-log-table')).toBeInTheDocument()
  })

  it('should pass children to AdminLayout correctly', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    const adminMain = screen.getByTestId('admin-main')
    expect(adminMain).toContainElement(screen.getByTestId('api-log-component'))
  })

  it('should render without errors', () => {
    // Arrange & Act
    const { container } = render(<ApiLogsPage />)

    // Assert
    expect(container).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })

  it('should have proper component hierarchy', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    const adminLayout = screen.getByTestId('admin-layout')
    const apiLogComponent = screen.getByTestId('api-log-component')
    
    expect(adminLayout).toContainElement(apiLogComponent)
    expect(apiLogComponent).toBeInTheDocument()
  })

  it('should render all expected child components', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    expect(screen.getByTestId('api-log-fields')).toBeInTheDocument()
    expect(screen.getByTestId('api-log-table')).toBeInTheDocument()
  })

  it('should maintain component isolation', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    expect(mockAdminLayout).toHaveBeenCalledTimes(1)
    expect(mockApiLog).toHaveBeenCalledTimes(1)
  })

  it('should handle component re-renders correctly', () => {
    // Arrange
    const { rerender } = render(<ApiLogsPage />)

    // Act
    rerender(<ApiLogsPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
    expect(screen.getByTestId('api-log-component')).toBeInTheDocument()
  })

  it('should render with minimal props', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    expect(mockAdminLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.any(Object),
      }),
      undefined
    )
    expect(mockApiLog).toHaveBeenCalledWith({}, undefined)
  })

  it('should have correct component structure', () => {
    // Arrange & Act
    render(<ApiLogsPage />)

    // Assert
    const adminLayout = screen.getByTestId('admin-layout')
    const adminMain = screen.getByTestId('admin-main')
    const apiLogComponent = screen.getByTestId('api-log-component')
    
    expect(adminLayout).toContainElement(adminMain)
    expect(adminMain).toContainElement(apiLogComponent)
  })
})
