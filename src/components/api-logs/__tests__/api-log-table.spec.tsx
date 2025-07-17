import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiLogTable } from '../api-log-table'
import type { ApiLogResponseItem } from '@/api/api-log.api'

// Mock external dependencies
vi.mock('@/components/error-table', () => ({
  ErrorTable: vi.fn(),
}))

vi.mock('@/components/full-page-skeleton', () => ({
  FullpageSkeleton: vi.fn(),
}))

vi.mock('@/components/api-logs/api-log-request-dialog', () => ({
  ApiLogRequestDialog: vi.fn(),
}))

vi.mock('@/components/api-logs/api-log-response-dialog', () => ({
  ApiLogResponseDialog: vi.fn(),
}))

vi.mock('@/components/api-logs/api-log-table-header', () => ({
  ApiLogTableHeader: vi.fn(),
}))

vi.mock('@/components/api-logs/api-log-table-item', () => ({
  ApiLogTableItem: vi.fn(),
}))

vi.mock('@/components/api-logs/empty-log-table-body', () => ({
  EmptyApiLogTableBody: vi.fn(),
}))

// Import mocked functions
import { ErrorTable } from '@/components/error-table'
import { FullpageSkeleton } from '@/components/full-page-skeleton'
import { ApiLogRequestDialog } from '@/components/api-logs/api-log-request-dialog'
import { ApiLogResponseDialog } from '@/components/api-logs/api-log-response-dialog'
import { ApiLogTableHeader } from '@/components/api-logs/api-log-table-header'
import { ApiLogTableItem } from '@/components/api-logs/api-log-table-item'
import { EmptyApiLogTableBody } from '@/components/api-logs/empty-log-table-body'

const mockErrorTable = vi.mocked(ErrorTable)
const mockFullpageSkeleton = vi.mocked(FullpageSkeleton)
const mockApiLogRequestDialog = vi.mocked(ApiLogRequestDialog)
const mockApiLogResponseDialog = vi.mocked(ApiLogResponseDialog)
const mockApiLogTableHeader = vi.mocked(ApiLogTableHeader)
const mockApiLogTableItem = vi.mocked(ApiLogTableItem)
const mockEmptyApiLogTableBody = vi.mocked(EmptyApiLogTableBody)

describe('ApiLogTable', () => {
  const defaultApiQuery = {
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-01T23:59:59Z',
  }
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    mockErrorTable.mockImplementation(() => <div data-testid="error-table">Error Table</div>)
    mockFullpageSkeleton.mockImplementation(() => <div data-testid="fullpage-skeleton">Loading...</div>)
    mockApiLogRequestDialog.mockImplementation(({ isOpen, onOpenChange, request }) => (
      <div data-testid="request-dialog" data-open={isOpen ?? false}>
        <button onClick={() => onOpenChange(false)}>Close Request</button>
        <span data-testid="request-method">{request.method}</span>
        <span data-testid="request-path">{request.path}</span>
      </div>
    ))
    mockApiLogResponseDialog.mockImplementation(({ isOpen, onOpenChange, response }) => (
      <div data-testid="response-dialog" data-open={isOpen ?? false}>
        <button onClick={() => onOpenChange(false)}>Close Response</button>
        <span data-testid="response-status">{response.statusCode}</span>
      </div>
    ))
    mockApiLogTableHeader.mockImplementation(() => <div data-testid="table-header">Table Header</div>)
    mockApiLogTableItem.mockImplementation(({ dataItem, handleRequestDialogOpen, handleResponseDialogOpen }) => (
      <div data-testid={`table-item-${dataItem.id}`}>
        <button onClick={() => handleRequestDialogOpen(dataItem)}>View Request</button>
        <button onClick={() => handleResponseDialogOpen(dataItem)}>View Response</button>
        <span data-testid="item-id">{dataItem.id}</span>
      </div>
    ))
    mockEmptyApiLogTableBody.mockImplementation(() => <div data-testid="empty-table-body">No logs found</div>)
  })

  it('should render loading skeleton when isLoading is true', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = []

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={true} isError={false} />)

    // Assert
    expect(screen.getByTestId('fullpage-skeleton')).toBeInTheDocument()
    expect(mockFullpageSkeleton).toHaveBeenCalled()
  })

  it('should render error table when isError is true', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = []

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={false} isError={true} />)

    // Assert
    expect(screen.getByTestId('error-table')).toBeInTheDocument()
    expect(mockErrorTable).toHaveBeenCalled()
  })

  it('should render empty table body when data is empty', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = []

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={false} isError={false} />)

    // Assert
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('empty-table-body')).toBeInTheDocument()
    expect(mockApiLogTableHeader).toHaveBeenCalled()
    expect(mockEmptyApiLogTableBody).toHaveBeenCalled()
  })

  it('should render table items when data is provided', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = [
      {
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
      },
      {
        id: '2',
        request: {
          method: 'POST',
          path: '/api/events',
          query: { eventId: '123' },
        },
        response: {
          statusCode: 201,
          responseBody: { created: true },
          responseTime: '2024-01-01T11:00:00Z',
        },
        user: {
          userId: 'user-2',
        },
        timestamp: '2024-01-01T11:00:00Z',
      },
    ]

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={false} isError={false} />)

    // Assert
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('table-item-2')).toBeInTheDocument()
    expect(screen.getAllByTestId('item-id')[0]).toHaveTextContent('1')
    expect(screen.getAllByTestId('item-id')[1]).toHaveTextContent('2')
    expect(mockApiLogTableItem).toHaveBeenCalledTimes(2)
  })

  it('should handle request dialog opening', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = [
      {
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
      },
    ]

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={false} isError={false} />)
    fireEvent.click(screen.getByText('View Request'))

    // Assert
    expect(screen.getByTestId('request-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('request-dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('request-method')).toHaveTextContent('GET')
    expect(screen.getByTestId('request-path')).toHaveTextContent('/api/test')
  })

  it('should handle response dialog opening', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = [
      {
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
      },
    ]

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={false} isError={false} />)
    fireEvent.click(screen.getByText('View Response'))

    // Assert
    expect(screen.getByTestId('response-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('response-dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('response-status')).toHaveTextContent('200')
  })

  it('should handle dialog closing', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = [
      {
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
      },
    ]

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={false} isError={false} />)
    fireEvent.click(screen.getByText('View Request'))
    fireEvent.click(screen.getByText('Close Request'))

    // Assert
    expect(screen.getByTestId('request-dialog')).toHaveAttribute('data-open', 'false')
  })

  it('should handle multiple items with different data', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = [
      {
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
      },
      {
        id: '2',
        request: {
          method: 'POST',
          path: '/api/events',
          query: { eventId: '123' },
        },
        response: {
          statusCode: 201,
          responseBody: { created: true },
          responseTime: '2024-01-01T11:00:00Z',
        },
        user: {
          userId: 'user-2',
        },
        timestamp: '2024-01-01T11:00:00Z',
      },
    ]

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={false} isError={false} />)

    // Assert
    expect(screen.getByTestId('table-item-1')).toBeInTheDocument()
    expect(screen.getByTestId('table-item-2')).toBeInTheDocument()
    
    // Check that table items were called with correct data
    expect(mockApiLogTableItem).toHaveBeenCalledWith(
      expect.objectContaining({
        dataItem: mockData[0],
        handleRequestDialogOpen: expect.any(Function),
        handleResponseDialogOpen: expect.any(Function),
      }),
      undefined
    )
    expect(mockApiLogTableItem).toHaveBeenCalledWith(
      expect.objectContaining({
        dataItem: mockData[1],
        handleRequestDialogOpen: expect.any(Function),
        handleResponseDialogOpen: expect.any(Function),
      }),
      undefined
    )
  })

  it('should handle items with additional info', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = [
      {
        id: '1',
        request: {
          method: 'GET',
          path: '/api/test',
          query: { test: 'value' },
          additionalInfo: {
            eventId: 456,
            gameId: 123,
            roundId: 1,
          },
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
      },
    ]

    // Act
    render(<ApiLogTable apiQuery={defaultApiQuery} data={mockData} isLoading={false} isError={false} />)

    // Assert
    expect(screen.getByTestId('table-item-1')).toBeInTheDocument()
    expect(mockApiLogTableItem).toHaveBeenCalledWith(
      expect.objectContaining({
        dataItem: mockData[0],
      }),
      undefined
    )
  })

  it('should pass /api/events endpoint to header and items for event/game ID columns', () => {
    // Arrange
    const mockData: ApiLogResponseItem[] = [
      {
        id: '1',
        request: {
          method: 'GET',
          path: '/api/events',
          query: {},
          additionalInfo: { eventId: 123, gameId: 456 },
        },
        response: {
          statusCode: 200,
          responseBody: {},
          responseTime: '2024-01-01T10:00:00Z',
        },
        user: { userId: 'user-1' },
        timestamp: '2024-01-01T10:00:00Z',
      },
    ]
    const apiQuery = { ...defaultApiQuery, endpoint: '/api/events' }
    render(<ApiLogTable apiQuery={apiQuery} data={mockData} isLoading={false} isError={false} />)
    // Assert
    expect(mockApiLogTableHeader).toHaveBeenCalledWith(
      expect.objectContaining({ apiQuery }),
      undefined
    )
    expect(mockApiLogTableItem).toHaveBeenCalledWith(
      expect.objectContaining({ apiQuery, dataItem: mockData[0] }),
      undefined
    )
  })
})
