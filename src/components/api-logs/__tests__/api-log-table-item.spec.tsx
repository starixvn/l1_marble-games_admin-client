import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiLogTableItem } from '../api-log-table-item'
import type { ApiLogResponseItem } from '@/api/api-log.api'

// Mock external dependencies
vi.mock('date-fns', () => ({
  format: vi.fn(),
}))

// Import mocked functions
import { format } from 'date-fns'

const mockFormat = vi.mocked(format)

const defaultApiQuery = {
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-01-01T23:59:59Z',
}

describe('ApiLogTableItem', () => {
  const mockDataItem: ApiLogResponseItem = {
    id: '1',
    request: {
      method: 'GET',
      path: '/api/test',
      query: { test: 'value' },
    },
    response: {
      statusCode: 200,
      responseBody: { success: true },
      responseTime: '2024-01-01T10:00:00Z',
    },
    user: {
      userId: 'user-1',
    },
    timestamp: '2024-01-01T10:00:00Z',
  }

  const mockHandleRequestDialogOpen = vi.fn()
  const mockHandleResponseDialogOpen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockFormat.mockReturnValue('01/01/2024 10:00:00')
  })

  it('should render all table cells with correct data', () => {
    // Arrange & Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={mockDataItem}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    expect(screen.getByText('01/01/2024 10:00:00')).toBeInTheDocument()
    expect(screen.getByText('user-1')).toBeInTheDocument()
    expect(screen.getByText('/api/test')).toBeInTheDocument()
    expect(screen.getByText('View full request')).toBeInTheDocument()
    expect(screen.getByText('View full response')).toBeInTheDocument()
  })

  it('should format timestamp correctly', () => {
    // Arrange & Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={mockDataItem}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    expect(mockFormat).toHaveBeenCalledWith('2024-01-01T10:00:00Z', 'MM/dd/yyyy HH:mm:ss')
  })

  it('should display "Unauthenticated" when user is not available', () => {
    // Arrange
    const dataItemWithoutUser = {
      ...mockDataItem,
      user: undefined,
    } as unknown as ApiLogResponseItem

    // Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={dataItemWithoutUser}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    expect(screen.getByText('Unauthenticated')).toBeInTheDocument()
  })

  it('should call handleRequestDialogOpen when request button is clicked', () => {
    // Arrange
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={mockDataItem}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Act
    fireEvent.click(screen.getByText('View full request'))

    // Assert
    expect(mockHandleRequestDialogOpen).toHaveBeenCalledWith(mockDataItem)
  })

  it('should call handleResponseDialogOpen when response button is clicked', () => {
    // Arrange
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={mockDataItem}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Act
    fireEvent.click(screen.getByText('View full response'))

    // Assert
    expect(mockHandleResponseDialogOpen).toHaveBeenCalledWith(mockDataItem)
  })

  it('should render request path with correct styling', () => {
    // Arrange & Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={mockDataItem}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    const pathElement = screen.getByText('/api/test')
    expect(pathElement).toHaveClass('text-amber-600')
  })

  it('should render buttons with correct styling', () => {
    // Arrange & Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={mockDataItem}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    const requestButton = screen.getByText('View full request')
    const responseButton = screen.getByText('View full response')
    
    expect(requestButton).toHaveClass('p-0')
    expect(responseButton).toHaveClass('p-0')
  })

  it('should handle different HTTP methods', () => {
    // Arrange
    const postDataItem: ApiLogResponseItem = {
      ...mockDataItem,
      request: {
        ...mockDataItem.request,
        method: 'POST',
        path: '/api/events',
      },
    }

    // Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={postDataItem}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    expect(screen.getByText('/api/events')).toBeInTheDocument()
  })

  it('should handle different response status codes', () => {
    // Arrange
    const errorDataItem: ApiLogResponseItem = {
      ...mockDataItem,
      response: {
        ...mockDataItem.response,
        statusCode: 404,
        responseBody: { error: 'Not found' },
      },
    }

    // Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={errorDataItem}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    // The component doesn't display status code directly, but it should still render
    expect(screen.getByText('View full response')).toBeInTheDocument()
  })

  it('should handle data with additional info', () => {
    // Arrange
    const dataItemWithAdditionalInfo: ApiLogResponseItem = {
      ...mockDataItem,
      request: {
        ...mockDataItem.request,
        additionalInfo: {
          eventId: 123,
          gameId: 456,
          roundId: 1,
        },
      },
    }

    // Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={dataItemWithAdditionalInfo}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    // The component doesn't display additional info directly, but it should still render
    expect(screen.getByText('View full request')).toBeInTheDocument()
    expect(screen.getByText('View full response')).toBeInTheDocument()
  })

  it('should handle empty query parameters', () => {
    // Arrange
    const dataItemWithEmptyQuery: ApiLogResponseItem = {
      ...mockDataItem,
      request: {
        ...mockDataItem.request,
        query: {},
      },
    }

    // Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={dataItemWithEmptyQuery}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    expect(screen.getByText('View full request')).toBeInTheDocument()
  })

  it('should handle complex query parameters', () => {
    // Arrange
    const dataItemWithComplexQuery: ApiLogResponseItem = {
      ...mockDataItem,
      request: {
        ...mockDataItem.request,
        query: {
          eventId: '123',
          gameId: '456',
          roundId: '1',
          filters: 'active',
        },
      },
    }

    // Act
    render(
      <ApiLogTableItem
        apiQuery={defaultApiQuery}
        dataItem={dataItemWithComplexQuery}
        handleRequestDialogOpen={mockHandleRequestDialogOpen}
        handleResponseDialogOpen={mockHandleResponseDialogOpen}
      />
    )

    // Assert
    expect(screen.getByText('View full request')).toBeInTheDocument()
  })

  it('should render Event ID and Game ID columns with correct values when endpoint is /api/events', () => {
    // Arrange
    const dataItemWithAdditionalInfo: ApiLogResponseItem = {
      ...mockDataItem,
      request: {
        ...mockDataItem.request,
        path: '/api/events',
        additionalInfo: {
          eventId: 123,
          gameId: 456,
        },
      },
    }
    // Act
    render(
      <table><tbody>
        <ApiLogTableItem
          apiQuery={{ ...defaultApiQuery, endpoint: '/api/events' }}
          dataItem={dataItemWithAdditionalInfo}
          handleRequestDialogOpen={mockHandleRequestDialogOpen}
          handleResponseDialogOpen={mockHandleResponseDialogOpen}
        />
      </tbody></table>
    )
    // Assert
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('456')).toBeInTheDocument()
  })

  it('should render N/A for Event ID and Game ID if missing in additionalInfo when endpoint is /api/events', () => {
    // Arrange
    const dataItemWithNoAdditionalInfo: ApiLogResponseItem = {
      ...mockDataItem,
      request: {
        ...mockDataItem.request,
        path: '/api/events',
        additionalInfo: {},
      },
    }
    // Act
    render(
      <table><tbody>
        <ApiLogTableItem
          apiQuery={{ ...defaultApiQuery, endpoint: '/api/events' }}
          dataItem={dataItemWithNoAdditionalInfo}
          handleRequestDialogOpen={mockHandleRequestDialogOpen}
          handleResponseDialogOpen={mockHandleResponseDialogOpen}
        />
      </tbody></table>
    )
    // Assert
    expect(screen.getAllByText('N/A').length).toBeGreaterThanOrEqual(2)
  })

  it('should not render Event ID and Game ID columns when endpoint is not /api/events', () => {
    // Arrange
    const dataItemWithAdditionalInfo: ApiLogResponseItem = {
      ...mockDataItem,
      request: {
        ...mockDataItem.request,
        additionalInfo: {
          eventId: 123,
          gameId: 456,
        },
      },
    }
    // Act
    render(
      <table><tbody>
        <ApiLogTableItem
          apiQuery={{ ...defaultApiQuery, endpoint: '/api/other' }}
          dataItem={dataItemWithAdditionalInfo}
          handleRequestDialogOpen={mockHandleRequestDialogOpen}
          handleResponseDialogOpen={mockHandleResponseDialogOpen}
        />
      </tbody></table>
    )
    // Assert
    expect(screen.queryByText('123')).not.toBeInTheDocument()
    expect(screen.queryByText('456')).not.toBeInTheDocument()
    expect(screen.queryByText('N/A')).not.toBeInTheDocument()
  })
})
