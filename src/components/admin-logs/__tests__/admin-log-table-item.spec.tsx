import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('date-fns', () => ({
  format: vi.fn((date, formatString) => {
    if (formatString === 'MM/dd/yyyy HH:mm:ss') {
      return '01/01/2024 00:00:00'
    }
    return date.toISOString()
  }),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, className, variant, onClick }) => (
    <button data-testid="button" className={className} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/table', () => ({
  TableCell: vi.fn(({ children, className }) => <td data-testid="table-cell" className={className}>{children}</td>),
  TableRow: vi.fn(({ children }) => <tr data-testid="table-row">{children}</tr>),
}))

import { AdminLogTableItem } from '../admin-log-table-item'
import type { AdminLogResponseItem } from '@/api/admin-log.api'

describe('AdminLogTableItem', () => {
  const mockDataItem: AdminLogResponseItem = {
    id: '1',
    author: 'admin',
    resource: 'operator',
    action: 'insert',
    timestamp: '2024-01-01T00:00:00.000Z',
    diff: {
      old: { name: 'old value' },
      new: { name: 'new value' }
    }
  }

  const mockHandleDiffDialogOpen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the admin log table item with correct structure', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
    expect(screen.getAllByTestId('table-cell')).toHaveLength(5)
  })

  it('should render formatted timestamp in first cell', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[0]).toHaveTextContent('01/01/2024 00:00:00')
  })

  it('should render author in second cell', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[1]).toHaveTextContent('admin')
  })

  it('should render resource in third cell', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[2]).toHaveTextContent('operator')
  })

  it('should render action in fourth cell', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[3]).toHaveTextContent('insert')
  })

  it('should render view diff button in fifth cell', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[4]).toContainElement(screen.getByTestId('button'))
    expect(screen.getByTestId('button')).toHaveTextContent('View diff')
  })

  it('should apply correct attributes to view diff button', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const viewDiffButton = screen.getByTestId('button')
    expect(viewDiffButton).toHaveClass('p-0')
    expect(viewDiffButton).toHaveAttribute('data-variant', 'link')
  })

  it('should call handleDiffDialogOpen with dataItem when view diff button is clicked', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)
    
    const viewDiffButton = screen.getByTestId('button')
    fireEvent.click(viewDiffButton)

    // Assert
    expect(mockHandleDiffDialogOpen).toHaveBeenCalledWith(mockDataItem)
  })

  it('should render cells in correct order', () => {
    // Arrange
    // Act
    render(<AdminLogTableItem dataItem={mockDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[0]).toHaveTextContent('01/01/2024 00:00:00') // Time
    expect(cells[1]).toHaveTextContent('admin') // Author
    expect(cells[2]).toHaveTextContent('operator') // Resource
    expect(cells[3]).toHaveTextContent('insert') // Action
    expect(cells[4]).toContainElement(screen.getByTestId('button')) // Diff button
  })

  it('should handle different data item values', () => {
    // Arrange
    const differentDataItem: AdminLogResponseItem = {
      id: '2',
      author: 'user123',
      resource: 'game-config',
      action: 'update',
      timestamp: '2024-01-02T12:30:45.000Z'
    }

    // Act
    render(<AdminLogTableItem dataItem={differentDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[1]).toHaveTextContent('user123')
    expect(cells[2]).toHaveTextContent('game-config')
    expect(cells[3]).toHaveTextContent('update')
  })

  it('should call handleDiffDialogOpen with correct dataItem for different items', () => {
    // Arrange
    const differentDataItem: AdminLogResponseItem = {
      id: '2',
      author: 'user123',
      resource: 'game-config',
      action: 'update',
      timestamp: '2024-01-02T12:30:45.000Z'
    }

    // Act
    render(<AdminLogTableItem dataItem={differentDataItem} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)
    
    const viewDiffButton = screen.getByTestId('button')
    fireEvent.click(viewDiffButton)

    // Assert
    expect(mockHandleDiffDialogOpen).toHaveBeenCalledWith(differentDataItem)
  })

  it('should handle data item without diff property', () => {
    // Arrange
    const dataItemWithoutDiff: AdminLogResponseItem = {
      id: '3',
      author: 'admin',
      resource: 'operator',
      action: 'delete',
      timestamp: '2024-01-03T00:00:00.000Z'
    }

    // Act
    render(<AdminLogTableItem dataItem={dataItemWithoutDiff} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toHaveTextContent('View diff')
  })

  it('should call handleDiffDialogOpen with dataItem without diff', () => {
    // Arrange
    const dataItemWithoutDiff: AdminLogResponseItem = {
      id: '3',
      author: 'admin',
      resource: 'operator',
      action: 'delete',
      timestamp: '2024-01-03T00:00:00.000Z'
    }

    // Act
    render(<AdminLogTableItem dataItem={dataItemWithoutDiff} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)
    
    const viewDiffButton = screen.getByTestId('button')
    fireEvent.click(viewDiffButton)

    // Assert
    expect(mockHandleDiffDialogOpen).toHaveBeenCalledWith(dataItemWithoutDiff)
  })

  it('should render author cell with red text when author is null', () => {
    // Arrange
    const dataItemWithNullAuthor: AdminLogResponseItem = {
      id: '4',
      author: undefined,
      resource: 'operator',
      action: 'insert',
      timestamp: '2024-01-04T00:00:00.000Z'
    }

    // Act
    render(<AdminLogTableItem dataItem={dataItemWithNullAuthor} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    const authorCell = cells[1]
    expect(authorCell).toHaveTextContent('Unknown')
    expect(authorCell).toHaveClass('text-red-400')
  })

  it('should render author cell with red text when author is undefined', () => {
    // Arrange
    const dataItemWithUndefinedAuthor: AdminLogResponseItem = {
      id: '5',
      author: undefined,
      resource: 'operator',
      action: 'insert',
      timestamp: '2024-01-05T00:00:00.000Z'
    }

    // Act
    render(<AdminLogTableItem dataItem={dataItemWithUndefinedAuthor} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    const authorCell = cells[1]
    expect(authorCell).toHaveTextContent('Unknown')
    expect(authorCell).toHaveClass('text-red-400')
  })

  it('should render author cell with red text when author is empty string', () => {
    // Arrange
    const dataItemWithEmptyAuthor: AdminLogResponseItem = {
      id: '6',
      author: '',
      resource: 'operator',
      action: 'insert',
      timestamp: '2024-01-06T00:00:00.000Z'
    }

    // Act
    render(<AdminLogTableItem dataItem={dataItemWithEmptyAuthor} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    const authorCell = cells[1]
    expect(authorCell).toHaveTextContent('')
    expect(authorCell).toHaveClass('text-red-400')
  })

  it('should render author cell without red text when author is provided', () => {
    // Arrange
    const dataItemWithAuthor: AdminLogResponseItem = {
      id: '7',
      author: 'valid-user',
      resource: 'operator',
      action: 'insert',
      timestamp: '2024-01-07T00:00:00.000Z'
    }

    // Act
    render(<AdminLogTableItem dataItem={dataItemWithAuthor} handleDiffDialogOpen={mockHandleDiffDialogOpen} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    const authorCell = cells[1]
    expect(authorCell).toHaveTextContent('valid-user')
    expect(authorCell).not.toHaveClass('text-red-400')
  })
})
