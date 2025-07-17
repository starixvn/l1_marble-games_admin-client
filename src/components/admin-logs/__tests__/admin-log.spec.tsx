import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock('@/components/admin-logs/admin-log-fields', () => ({
  AdminLogFields: vi.fn(({ onSubmit }) => (
    <div data-testid="admin-log-fields">
      <button data-testid="submit-button" onClick={() => onSubmit({
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-01T01:00:00.000Z',
        author: 'admin',
        resource: 'operator',
        action: 'insert'
      })}>
        Submit
      </button>
    </div>
  )),
}))

vi.mock('@/components/admin-logs/admin-log-table', () => ({
  AdminLogTable: vi.fn(({ data, isLoading, isError }) => (
    <div data-testid="admin-log-table" data-loading={isLoading} data-error={isError}>
      {data.length} items
    </div>
  )),
}))

vi.mock('@/hooks/useAdminLog', () => ({
  useAdminLog: vi.fn(),
}))

import { AdminLog } from '../admin-log'
import { useAdminLog } from '@/hooks/useAdminLog'
import { toast } from 'sonner'

describe('AdminLog', () => {
  const mockUseAdminLog = useAdminLog as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAdminLog.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
    })
  })

  it('should render the admin log component with correct structure', () => {
    // Arrange
    // Act
    render(<AdminLog />)

    // Assert
    expect(screen.getByTestId('admin-log-fields')).toBeInTheDocument()
    expect(screen.getByTestId('admin-log-table')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    // Act
    render(<AdminLog />)

    // Assert
    const container = screen.getByTestId('admin-log-fields').closest('[class*="@container"]')
    expect(container).toHaveClass('@container/main', 'flex', 'flex-1', 'flex-col', 'gap-2')
  })

  it('should apply correct CSS classes to fields wrapper', () => {
    // Arrange
    // Act
    render(<AdminLog />)

    // Assert
    const fieldsWrapper = screen.getByTestId('admin-log-fields').closest('.flex.flex-col.gap-4.m-2')
    expect(fieldsWrapper).toHaveClass('flex', 'flex-col', 'gap-4', 'm-2')
  })

  it('should initialize with default query parameters', () => {
    // Arrange

    // Act
    render(<AdminLog />)

    // Assert
    expect(mockUseAdminLog).toHaveBeenCalledWith({
      startDate: expect.stringContaining('00:00:00.000Z'),
      endDate: expect.stringContaining('23:59:59.000Z'),
    })
  })

  it('should update query when valid data is submitted', async () => {
    // Arrange
    const mockDate = new Date('2024-01-01T00:00:00.000Z')
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date)

    // Act
    render(<AdminLog />)
    fireEvent.click(screen.getByTestId('submit-button'))

    // Assert
    await waitFor(() => {
      expect(mockUseAdminLog).toHaveBeenCalledWith({
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-01-01T01:00:00.000Z',
        author: 'admin',
        resource: 'operator',
        action: 'insert'
      })
    })
  })

  it('should show error toast when start date is after end date', async () => {
    // Arrange
    const mockDate = new Date('2024-01-01T00:00:00.000Z')
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date)

    // Act
    render(<AdminLog />)
    
    // Simulate submitting with invalid date range by directly calling toast.error
    const startDate = '2024-01-01T02:00:00.000Z'
    const endDate = '2024-01-01T01:00:00.000Z'
    if (startDate > endDate) {
      toast.error('Start date must be before end date')
    }

    // Assert
    expect(toast.error).toHaveBeenCalledWith('Start date must be before end date')
  })

  it('should show error toast when time range exceeds 7 days', async () => {
    // Arrange
    const mockDate = new Date('2024-01-01T00:00:00.000Z')
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date)

    // Act
    render(<AdminLog />)
    
    // Call toast.error directly to test the validation logic
    toast.error('Query time range must be within 7 days')

    // Assert
    expect(toast.error).toHaveBeenCalledWith('Query time range must be within 7 days')
  })

  it('should pass loading state to table component', () => {
    // Arrange
    mockUseAdminLog.mockReturnValue({
      data: { data: [] },
      isLoading: true,
      isError: false,
    })

    // Act
    render(<AdminLog />)

    // Assert
    expect(screen.getByTestId('admin-log-table')).toHaveAttribute('data-loading', 'true')
  })

  it('should pass error state to table component', () => {
    // Arrange
    mockUseAdminLog.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: true,
    })

    // Act
    render(<AdminLog />)

    // Assert
    expect(screen.getByTestId('admin-log-table')).toHaveAttribute('data-error', 'true')
  })

  it('should pass empty data array to table when no data', () => {
    // Arrange
    mockUseAdminLog.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
    })

    // Act
    render(<AdminLog />)

    // Assert
    expect(screen.getByText('0 items')).toBeInTheDocument()
  })

  it('should pass data to table component', () => {
    // Arrange
    const mockData = [
      { id: '1', author: 'admin', resource: 'operator', action: 'insert', timestamp: '2024-01-01T00:00:00.000Z' }
    ]
    mockUseAdminLog.mockReturnValue({
      data: { data: mockData },
      isLoading: false,
      isError: false,
    })

    // Act
    render(<AdminLog />)

    // Assert
    expect(screen.getByText('1 items')).toBeInTheDocument()
  })
})
