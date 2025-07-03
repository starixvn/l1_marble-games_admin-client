import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiLogResponseDialog } from '../api-log-response-dialog'
import type { ApiLogResponseItem } from '@/api/api-log.api'

// Mock external dependencies
vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(),
  DialogContent: vi.fn(),
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(),
}))

// Import mocked functions
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const mockDialog = vi.mocked(Dialog)
const mockDialogContent = vi.mocked(DialogContent)
const mockLabel = vi.mocked(Label)

describe('ApiLogResponseDialog', () => {
  const mockResponse: ApiLogResponseItem['response'] = {
    statusCode: 200,
    responseBody: { success: true, data: { id: 123, name: 'test' } },
    responseTime: '2024-01-01T10:00:00Z',
  }

  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    mockDialog.mockImplementation(({ children, open }) => (
      <div data-testid="dialog" data-open={open}>
        {open && children}
      </div>
    ))
    
    mockDialogContent.mockImplementation(({ children }) => (
      <div data-testid="dialog-content">{children}</div>
    ))
    
    mockLabel.mockImplementation(({ children }) => (
      <div data-testid="label">{children}</div>
    ))
  })

  it('should render dialog when open', () => {
    // Arrange & Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={mockResponse}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
  })

  it('should not render dialog when closed', () => {
    // Arrange & Act
    render(
      <ApiLogResponseDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        response={mockResponse}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
  })

  it('should display response status code and response time', () => {
    // Arrange & Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={mockResponse}
      />
    )

    // Assert
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01T10:00:00Z')).toBeInTheDocument()
  })

  it('should display response body as formatted JSON', () => {
    // Arrange & Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={mockResponse}
      />
    )

    // Assert
    const preElement = screen.getByTestId('dialog-content').querySelector('pre')
    expect(preElement).toBeInTheDocument()
    expect(preElement?.textContent).toContain('"success": true')
    expect(preElement?.textContent).toContain('"data"')
    expect(preElement?.textContent).toContain('"id": 123')
    expect(preElement?.textContent).toContain('"name": "test"')
  })

  it('should handle different status codes', () => {
    // Arrange
    const errorResponse: ApiLogResponseItem['response'] = {
      statusCode: 404,
      responseBody: { error: 'Not found', message: 'Resource not found' },
      responseTime: '2024-01-01T10:00:00Z',
    }

    // Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={errorResponse}
      />
    )

    // Assert
    expect(screen.getByText('404')).toBeInTheDocument()
    const preElement = screen.getByTestId('dialog-content').querySelector('pre')
    expect(preElement).toBeInTheDocument()
    expect(preElement?.textContent).toContain('"error": "Not found"')
    expect(preElement?.textContent).toContain('"message": "Resource not found"')
  })

  it('should handle empty response body', () => {
    // Arrange
    const emptyResponse: ApiLogResponseItem['response'] = {
      statusCode: 204,
      responseBody: {},
      responseTime: '2024-01-01T10:00:00Z',
    }

    // Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={emptyResponse}
      />
    )

    // Assert
    expect(screen.getByText('204')).toBeInTheDocument()
    expect(screen.getByText('{}')).toBeInTheDocument()
  })

  it('should handle complex response body', () => {
    // Arrange
    const complexResponse: ApiLogResponseItem['response'] = {
      statusCode: 200,
      responseBody: {
        success: true,
        data: {
          events: [
            { id: 1, name: 'Event 1', status: 'active' },
            { id: 2, name: 'Event 2', status: 'inactive' },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 2,
          },
          metadata: {
            timestamp: '2024-01-01T10:00:00Z',
            version: '1.0.0',
          },
        },
      },
      responseTime: '2024-01-01T10:00:00Z',
    }

    // Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={complexResponse}
      />
    )

    // Assert
    expect(screen.getByText('200')).toBeInTheDocument()
    const preElement = screen.getByTestId('dialog-content').querySelector('pre')
    expect(preElement).toBeInTheDocument()
    expect(preElement?.textContent).toContain('"success": true')
    expect(preElement?.textContent).toContain('"events"')
    expect(preElement?.textContent).toContain('"pagination"')
    expect(preElement?.textContent).toContain('"metadata"')
  })

  it('should handle null response body', () => {
    // Arrange
    const nullResponse = {
      statusCode: 200,
      responseBody: null,
      responseTime: '2024-01-01T10:00:00Z',
    } as unknown as ApiLogResponseItem['response']

    // Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={nullResponse}
      />
    )

    // Assert
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('should handle different response times', () => {
    // Arrange
    const responseWithDifferentTime: ApiLogResponseItem['response'] = {
      ...mockResponse,
      responseTime: '2024-01-01T15:30:45.123Z',
    }

    // Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={responseWithDifferentTime}
      />
    )

    // Assert
    expect(screen.getByText('2024-01-01T15:30:45.123Z')).toBeInTheDocument()
  })

  it('should handle dialog state changes', () => {
    // Arrange
    const { rerender } = render(
      <ApiLogResponseDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        response={mockResponse}
      />
    )

    // Assert - initially closed
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')

    // Act - open the dialog
    rerender(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={mockResponse}
      />
    )

    // Assert - now open
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
  })

  it('should handle large response bodies', () => {
    // Arrange
    const largeResponse: ApiLogResponseItem['response'] = {
      statusCode: 200,
      responseBody: {
        success: true,
        data: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
          description: `This is a long description for item ${i + 1}`,
          metadata: {
            created: '2024-01-01T10:00:00Z',
            updated: '2024-01-01T10:00:00Z',
            tags: ['tag1', 'tag2', 'tag3'],
          },
        })),
      },
      responseTime: '2024-01-01T10:00:00Z',
    }

    // Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={largeResponse}
      />
    )

    // Assert
    expect(screen.getByText('200')).toBeInTheDocument()
    const preElement = screen.getByTestId('dialog-content').querySelector('pre')
    expect(preElement).toBeInTheDocument()
    expect(preElement?.textContent).toContain('"success": true')
    expect(preElement?.textContent).toContain('"data"')
    expect(preElement?.textContent).toContain('"Item 1"')
    expect(preElement?.textContent).toContain('"Item 100"')
  })

  it('should handle error responses with stack traces', () => {
    // Arrange
    const errorResponse: ApiLogResponseItem['response'] = {
      statusCode: 500,
      responseBody: {
        error: 'Internal Server Error',
        message: 'Something went wrong',
        stack: 'Error: Something went wrong\n    at processRequest (/app/server.js:123:45)\n    at handleRequest (/app/server.js:67:89)',
        timestamp: '2024-01-01T10:00:00Z',
      },
      responseTime: '2024-01-01T10:00:00Z',
    }

    // Act
    render(
      <ApiLogResponseDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        response={errorResponse}
      />
    )

    // Assert
    expect(screen.getByText('500')).toBeInTheDocument()
    const preElement = screen.getByTestId('dialog-content').querySelector('pre')
    expect(preElement).toBeInTheDocument()
    expect(preElement?.textContent).toContain('"error": "Internal Server Error"')
    expect(preElement?.textContent).toContain('"message": "Something went wrong"')
    expect(preElement?.textContent).toContain('"stack"')
  })
})
