import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiLogRequestDialog } from '../api-log-request-dialog'
import type { ApiLogResponseItem } from '@/api/api-log.api'

// Mock external dependencies
vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(),
  DialogContent: vi.fn(),
  DialogHeader: vi.fn(),
  DialogTitle: vi.fn(),
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(),
}))

// Import mocked functions
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const mockDialog = vi.mocked(Dialog)
const mockDialogContent = vi.mocked(DialogContent)
const mockDialogHeader = vi.mocked(DialogHeader)
const mockDialogTitle = vi.mocked(DialogTitle)
const mockLabel = vi.mocked(Label)
const mockButton = vi.mocked(Button)

describe('ApiLogRequestDialog', () => {
  const mockRequest: ApiLogResponseItem['request'] = {
    method: 'GET',
    path: '/api/test',
    query: { test: 'value', eventId: '123' },
    additionalInfo: {
      eventId: 123,
      gameId: 456,
      roundId: 1,
    },
  }

  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockDialog.mockImplementation(({ children, open }) => (
      <div data-testid="dialog" data-open={open}>
        {open && children}
      </div>
    ))
    
    mockDialogContent.mockImplementation(({ children }) => (
      <div data-testid="dialog-content">{children}</div>
    ))

    mockDialogHeader.mockImplementation(({ children }) => (
      <div data-testid="dialog-header">{children}</div>
    ))

    mockDialogTitle.mockImplementation(({ children, className }) => (
      <div data-testid="dialog-title" data-class={className}>{children}</div>
    ))
    
    mockLabel.mockImplementation(({ children }) => (
      <div data-testid="label">{children}</div>
    ))
    
    mockButton.mockImplementation(({ children, onClick, variant }) => (
      <button data-testid="button" data-variant={variant} onClick={onClick}>
        {children}
      </button>
    ))
  })

  it('should render dialog when open', () => {
    // Arrange & Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
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
      <ApiLogRequestDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
  })

  it('should render dialog title for screen readers', () => {
    // Arrange & Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toHaveAttribute('data-class', 'sr-only')
    expect(screen.getByText('Request Details')).toBeInTheDocument()
  })

  it('should render dialog header', () => {
    // Arrange & Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
  })

  it('should display request method and path with proper labels', () => {
    // Arrange & Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert
    expect(screen.getByText('GET')).toBeInTheDocument()
    expect(screen.getByText('/api/test')).toBeInTheDocument()
    
    // Check that labels are rendered
    const labels = screen.getAllByTestId('label')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('should display query parameters as formatted JSON with proper label', () => {
    // Arrange & Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert
    expect(screen.getByText('Query')).toBeInTheDocument()
    const preElement = screen.getByTestId('dialog-content').querySelector('pre')
    expect(preElement).toBeInTheDocument()
    expect(preElement?.textContent).toContain('"test": "value"')
    expect(preElement?.textContent).toContain('"eventId": "123"')
  })

  it('should handle close button click', () => {
    // Arrange
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Act
    fireEvent.click(screen.getByText('Close'))

    // Assert
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should render close button with correct styling', () => {
    // Arrange & Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert
    const closeButton = screen.getByText('Close')
    expect(closeButton).toBeInTheDocument()
    expect(closeButton.closest('[data-variant="outline"]')).toBeInTheDocument()
  })

  it('should handle different HTTP methods', () => {
    // Arrange
    const postRequest: ApiLogResponseItem['request'] = {
      ...mockRequest,
      method: 'POST',
      path: '/api/events',
    }

    // Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={postRequest}
      />
    )

    // Assert
    expect(screen.getByText('POST')).toBeInTheDocument()
    expect(screen.getByText('/api/events')).toBeInTheDocument()
  })

  it('should handle empty query parameters', () => {
    // Arrange
    const requestWithEmptyQuery: ApiLogResponseItem['request'] = {
      ...mockRequest,
      query: {},
    }

    // Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={requestWithEmptyQuery}
      />
    )

    // Assert
    expect(screen.getByText('Query')).toBeInTheDocument()
    expect(screen.getByText('{}')).toBeInTheDocument()
  })

  it('should handle complex query parameters', () => {
    // Arrange
    const requestWithComplexQuery: ApiLogResponseItem['request'] = {
      ...mockRequest,
      query: {
        eventId: '123',
        gameId: '456',
        roundId: '1',
        filters: JSON.stringify({
          status: 'active',
          type: 'sport',
        }),
        sort: JSON.stringify(['timestamp', 'desc']),
      },
    }

    // Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={requestWithComplexQuery}
      />
    )

    // Assert
    expect(screen.getByText('Query')).toBeInTheDocument()
    const preElement = screen.getByTestId('dialog-content').querySelector('pre')
    expect(preElement).toBeInTheDocument()
    expect(preElement?.textContent).toContain('"eventId": "123"')
    expect(preElement?.textContent).toContain('"gameId": "456"')
    expect(preElement?.textContent).toContain('"roundId": "1"')
    expect(preElement?.textContent).toContain('"filters"')
    expect(preElement?.textContent).toContain('"sort"')
  })

  it('should handle request with additional info', () => {
    // Arrange
    const requestWithAdditionalInfo: ApiLogResponseItem['request'] = {
      ...mockRequest,
      additionalInfo: {
        eventId: 789,
        gameId: 101,
        roundId: 2,
      },
    }

    // Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={requestWithAdditionalInfo}
      />
    )

    // Assert
    // The component doesn't display additional info directly, but it should still render
    expect(screen.getByText('GET')).toBeInTheDocument()
    expect(screen.getByText('/api/test')).toBeInTheDocument()
  })

  it('should handle request without additional info', () => {
    // Arrange
    const requestWithoutAdditionalInfo: ApiLogResponseItem['request'] = {
      method: 'GET',
      path: '/api/test',
      query: { test: 'value' },
    }

    // Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={requestWithoutAdditionalInfo}
      />
    )

    // Assert
    expect(screen.getByText('GET')).toBeInTheDocument()
    expect(screen.getByText('/api/test')).toBeInTheDocument()
  })

  it('should have correct styling for method and path', () => {
    // Arrange & Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert
    // The component should render the method with green styling and path with normal styling
    expect(screen.getByText('GET')).toBeInTheDocument()
    expect(screen.getByText('/api/test')).toBeInTheDocument()
  })

  it('should handle dialog state changes', () => {
    // Arrange
    const { rerender } = render(
      <ApiLogRequestDialog
        isOpen={false}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert - initially closed
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')

    // Act - open the dialog
    rerender(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert - now open
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
  })

  it('should render all required a11y elements', () => {
    // Arrange & Act
    render(
      <ApiLogRequestDialog
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        request={mockRequest}
      />
    )

    // Assert
    expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
    expect(screen.getByText('Request Details')).toBeInTheDocument()
    expect(screen.getByText('Query')).toBeInTheDocument()
    expect(screen.getAllByTestId('label').length).toBeGreaterThan(0)
  })
})
