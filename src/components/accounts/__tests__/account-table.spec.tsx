import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AccountTable } from '../account-table'
import { type Account, Role } from '@/api/auth.api'

// Mock the dependencies
vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: vi.fn()
}))

vi.mock('@/components/error-table', () => ({
  ErrorTable: vi.fn(() => <div data-testid="error-table">Error Table Component</div>)
}))

vi.mock('@/components/full-page-skeleton', () => ({
  FullpageSkeleton: vi.fn(() => <div data-testid="full-page-skeleton">Loading Skeleton</div>)
}))

vi.mock('@/components/ui/table', () => ({
  Table: vi.fn(({ children }) => <table data-testid="table">{children}</table>),
  TableBody: vi.fn(({ children }) => <tbody data-testid="table-body">{children}</tbody>),
  TableCell: vi.fn(({ children, colSpan, className }) => (
    <td data-testid="table-cell" colSpan={colSpan} className={className}>
      {children}
    </td>
  )),
  TableHead: vi.fn(({ children }) => <th data-testid="table-head">{children}</th>),
  TableHeader: vi.fn(({ children }) => <thead data-testid="table-header">{children}</thead>),
  TableRow: vi.fn(({ children }) => <tr data-testid="table-row">{children}</tr>)
}))

// Import the mocked hook
import { useAccounts } from '@/hooks/useAccounts'

describe('AccountTable', () => {
  const mockUseAccounts = vi.mocked(useAccounts)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when loading', () => {
    it('should render FullpageSkeleton when isLoading is true', () => {
      // Arrange
      mockUseAccounts.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      expect(screen.getByTestId('full-page-skeleton')).toBeInTheDocument()
      expect(screen.getByText('Loading Skeleton')).toBeInTheDocument()
      expect(mockUseAccounts).toHaveBeenCalledTimes(1)
    })
  })

  describe('when error occurs', () => {
    it('should render ErrorTable when error is present', () => {
      // Arrange
      const mockError = new Error('Failed to fetch accounts')
      mockUseAccounts.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError
      })

      // Act
      render(<AccountTable />)

      // Assert
      expect(screen.getByTestId('error-table')).toBeInTheDocument()
      expect(screen.getByText('Error Table Component')).toBeInTheDocument()
      expect(mockUseAccounts).toHaveBeenCalledTimes(1)
    })
  })

  describe('when data is loaded successfully', () => {
    it('should render table with accounts when data is available', () => {
      // Arrange
      const mockAccounts: Account[] = [
        { username: 'admin1', role: Role.ADMIN },
        { username: 'developer1', role: Role.DEVELOPER },
        { username: 'readonly1', role: Role.READONLY }
      ]
      mockUseAccounts.mockReturnValue({
        data: mockAccounts,
        isLoading: false,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      expect(screen.getByTestId('table')).toBeInTheDocument()
      expect(screen.getByTestId('table-header')).toBeInTheDocument()
      expect(screen.getByTestId('table-body')).toBeInTheDocument()
      
      // Check headers
      expect(screen.getByText('Username')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      
      // Check account data
      expect(screen.getByText('admin1')).toBeInTheDocument()
      expect(screen.getByText('developer1')).toBeInTheDocument()
      expect(screen.getByText('readonly1')).toBeInTheDocument()
      expect(screen.getAllByText('admin')).toHaveLength(1)
      expect(screen.getByText('developer')).toBeInTheDocument()
      expect(screen.getByText('readonly')).toBeInTheDocument()
      
      expect(mockUseAccounts).toHaveBeenCalledTimes(1)
    })

    it('should render table with accounts when role is undefined (defaults to admin)', () => {
      // Arrange
      const mockAccounts: Account[] = [
        { username: 'user1' }, // role is undefined
        { username: 'user2', role: Role.ADMIN }
      ]
      mockUseAccounts.mockReturnValue({
        data: mockAccounts,
        isLoading: false,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      expect(screen.getByText('user1')).toBeInTheDocument()
      expect(screen.getByText('user2')).toBeInTheDocument()
      expect(screen.getAllByText('admin')).toHaveLength(2)
      
      expect(mockUseAccounts).toHaveBeenCalledTimes(1)
    })

    it('should render empty state when data is empty array', () => {
      // Arrange
      mockUseAccounts.mockReturnValue({
        data: [],
        isLoading: false,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      expect(screen.getByTestId('table')).toBeInTheDocument()
      expect(screen.getByText('No accounts found')).toBeInTheDocument()
      expect(screen.getByText('No accounts found')).toHaveClass('text-center')
      
      expect(mockUseAccounts).toHaveBeenCalledTimes(1)
    })

    it('should render empty table body when data is undefined', () => {
      // Arrange
      mockUseAccounts.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      expect(screen.getByTestId('table')).toBeInTheDocument()
      expect(screen.getByTestId('table-body')).toBeInTheDocument()
      // When data is undefined, no rows are rendered in table body
      expect(screen.queryByText('No accounts found')).not.toBeInTheDocument()
      
      expect(mockUseAccounts).toHaveBeenCalledTimes(1)
    })

    it('should apply correct CSS classes to container', () => {
      // Arrange
      const mockAccounts: Account[] = [
        { username: 'testuser', role: Role.ADMIN }
      ]
      mockUseAccounts.mockReturnValue({
        data: mockAccounts,
        isLoading: false,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      const container = screen.getByTestId('table').closest('div')?.parentElement?.parentElement
      expect(container).toHaveClass('@container/main', 'flex', 'flex-1', 'flex-col', 'gap-2')
    })

    it('should apply correct CSS classes to table wrapper', () => {
      // Arrange
      const mockAccounts: Account[] = [
        { username: 'testuser', role: Role.ADMIN }
      ]
      mockUseAccounts.mockReturnValue({
        data: mockAccounts,
        isLoading: false,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      const tableWrapper = screen.getByTestId('table').closest('div')
      expect(tableWrapper).toHaveClass('overflow-hidden', 'rounded-lg', 'border', 'm-2')
    })

    it('should apply correct CSS classes to content wrapper', () => {
      // Arrange
      const mockAccounts: Account[] = [
        { username: 'testuser', role: Role.ADMIN }
      ]
      mockUseAccounts.mockReturnValue({
        data: mockAccounts,
        isLoading: false,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      const contentWrapper = screen.getByTestId('table').closest('div')?.parentElement
      expect(contentWrapper).toHaveClass('flex', 'flex-col', 'gap-4', 'py-4', 'md:gap-6', 'md:py-2')
    })
  })

  describe('hook integration', () => {
    it('should call useAccounts hook exactly once', () => {
      // Arrange
      mockUseAccounts.mockReturnValue({
        data: [],
        isLoading: false,
        error: null
      })

      // Act
      render(<AccountTable />)

      // Assert
      expect(mockUseAccounts).toHaveBeenCalledTimes(1)
      expect(mockUseAccounts).toHaveBeenCalledWith()
    })
  })
})
