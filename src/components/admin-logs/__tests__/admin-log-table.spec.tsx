import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/components/error-table', () => ({
  ErrorTable: vi.fn(() => <div data-testid="error-table">Error Table</div>),
}))

vi.mock('@/components/full-page-skeleton', () => ({
  FullpageSkeleton: vi.fn(() => <div data-testid="fullpage-skeleton">Loading...</div>),
}))

vi.mock('@/components/ui/table', () => ({
  Table: vi.fn(({ children, className }) => (
    <table data-testid="table" className={className}>{children}</table>
  )),
  TableBody: vi.fn(({ children }) => <tbody data-testid="table-body">{children}</tbody>),
}))

vi.mock('@/components/api-logs/empty-log-table-body', () => ({
  EmptyApiLogTableBody: vi.fn(() => <div data-testid="empty-log-table-body">No data</div>),
}))

vi.mock('@/components/admin-logs/admin-log-diff-viewer', () => ({
  AdminLogDiffViewer: vi.fn(({ isOpen, onOpenChange, diff }) => (
    <div data-testid="admin-log-diff-viewer" data-is-open={isOpen} data-diff={JSON.stringify(diff)}>
      <button data-testid="close-diff" onClick={() => onOpenChange(false)}>Close</button>
    </div>
  )),
}))

vi.mock('@/components/admin-logs/admin-log-table-item', () => ({
  AdminLogTableItem: vi.fn(({ dataItem, handleDiffDialogOpen }) => (
    <div data-testid="admin-log-table-item" data-item-id={dataItem.id}>
      <button data-testid="view-diff-button" onClick={() => handleDiffDialogOpen(dataItem)}>
        View diff
      </button>
    </div>
  )),
}))

vi.mock('@/components/admin-logs/admin-log-table-header', () => ({
  AdminLogTableHeader: vi.fn(() => <div data-testid="admin-log-table-header">Header</div>),
}))

import { AdminLogTable } from '../admin-log-table'
import type { AdminLogResponseItem } from '@/api/admin-log.api'

describe('AdminLogTable', () => {
  const mockData: AdminLogResponseItem[] = [
    {
      id: '1',
      author: 'admin',
      resource: 'operator',
      action: 'insert',
      timestamp: '2024-01-01T00:00:00.000Z',
      diff: {
        old: { name: 'old value' },
        new: { name: 'new value' }
      }
    },
    {
      id: '2',
      author: 'admin',
      resource: 'game-config',
      action: 'update',
      timestamp: '2024-01-01T01:00:00.000Z',
      diff: {
        old: { config: 'old config' },
        new: { config: 'new config' }
      }
    }
  ]

  it('should render the admin log table with correct structure', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)

    // Assert
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('admin-log-table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-body')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)

    // Assert
    const container = screen.getByTestId('table').closest('[class*="@container"]')
    expect(container).toHaveClass('@container/main', 'flex', 'flex-1', 'flex-col', 'gap-2')
  })

  it('should apply correct CSS classes to wrapper', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)

    // Assert
    const wrapper = screen.getByTestId('table').closest('.flex.flex-col.gap-4.py-4.md\\:gap-6.md\\:py-2')
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-4', 'py-4', 'md:gap-6', 'md:py-2')
  })

  it('should apply correct CSS classes to table wrapper', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)

    // Assert
    const tableWrapper = screen.getByTestId('table').closest('.overflow-hidden')
    expect(tableWrapper).toHaveClass('overflow-hidden', 'rounded-lg', 'border', 'm-2')
  })

  it('should apply correct CSS classes to table', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)

    // Assert
    expect(screen.getByTestId('table')).toHaveClass('w-full')
  })

  it('should render admin log table items for each data item', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)

    // Assert
    const tableItems = screen.getAllByTestId('admin-log-table-item')
    expect(tableItems).toHaveLength(2)
    expect(tableItems[0]).toHaveAttribute('data-item-id', '1')
    expect(tableItems[1]).toHaveAttribute('data-item-id', '2')
  })

  it('should render empty table body when no data', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={[]} isLoading={false} isError={false} />)

    // Assert
    expect(screen.getByTestId('empty-log-table-body')).toBeInTheDocument()
    expect(screen.queryAllByTestId('admin-log-table-item')).toHaveLength(0)
  })

  it('should show loading skeleton when isLoading is true', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={true} isError={false} />)

    // Assert
    expect(screen.getByTestId('fullpage-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('table')).not.toBeInTheDocument()
  })

  it('should show error table when isError is true', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={true} />)

    // Assert
    expect(screen.getByTestId('error-table')).toBeInTheDocument()
    expect(screen.queryByTestId('table')).not.toBeInTheDocument()
  })

  it('should open diff viewer when view diff button is clicked', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)
    
    const viewDiffButtons = screen.getAllByTestId('view-diff-button')
    fireEvent.click(viewDiffButtons[0])

    // Assert
    expect(screen.getByTestId('admin-log-diff-viewer')).toHaveAttribute('data-is-open', 'true')
    expect(screen.getByTestId('admin-log-diff-viewer')).toHaveAttribute('data-diff', JSON.stringify(mockData[0].diff))
  })

  it('should close diff viewer when close button is clicked', () => {
    // Arrange
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)
    
    const viewDiffButtons = screen.getAllByTestId('view-diff-button')
    fireEvent.click(viewDiffButtons[0])
    
    // Verify diff viewer is open
    expect(screen.getByTestId('admin-log-diff-viewer')).toHaveAttribute('data-is-open', 'true')

    // Act
    const closeButton = screen.getByTestId('close-diff')
    fireEvent.click(closeButton)

    // Assert
    expect(screen.getByTestId('admin-log-diff-viewer')).toHaveAttribute('data-is-open', 'false')
  })

  it('should pass correct diff data to diff viewer', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={false} isError={false} />)
    
    const viewDiffButtons = screen.getAllByTestId('view-diff-button')
    fireEvent.click(viewDiffButtons[1]) // Click second item

    // Assert
    expect(screen.getByTestId('admin-log-diff-viewer')).toHaveAttribute('data-diff', JSON.stringify(mockData[1].diff))
  })

  it('should handle data item without diff', () => {
    // Arrange
    const dataWithoutDiff: AdminLogResponseItem[] = [
      {
        id: '1',
        author: 'admin',
        resource: 'operator',
        action: 'insert',
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    ]

    // Act
    render(<AdminLogTable data={dataWithoutDiff} isLoading={false} isError={false} />)
    
    const viewDiffButtons = screen.getAllByTestId('view-diff-button')
    fireEvent.click(viewDiffButtons[0])

    // Assert
    expect(screen.getByTestId('admin-log-diff-viewer')).not.toHaveAttribute('data-diff')
  })

  it('should prioritize loading state over error state', () => {
    // Arrange
    // Act
    render(<AdminLogTable data={mockData} isLoading={true} isError={true} />)

    // Assert
    expect(screen.getByTestId('fullpage-skeleton')).toBeInTheDocument()
    expect(screen.queryByTestId('error-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('table')).not.toBeInTheDocument()
  })
})
