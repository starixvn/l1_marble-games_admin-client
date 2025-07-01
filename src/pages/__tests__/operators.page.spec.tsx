import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/hooks/useOperator', () => ({
  useOperator: vi.fn(),
}))

vi.mock('@/components/operator-table', () => ({
  OperatorTable: vi.fn(({ data }) => <div data-testid="operator-table">Operator Table with {data.length} items</div>),
}))

vi.mock('@/components/layouts/admin.layout', () => ({
  AdminLayout: vi.fn(({ children }) => <div data-testid="admin-layout">{children}</div>),
}))

vi.mock('@/components/create-operator-section', () => ({
  CreateOperatorSection: vi.fn(() => <div data-testid="create-operator-section">Create Operator Section</div>),
}))

vi.mock('@/components/error-table', () => ({
  ErrorTable: vi.fn(({ onClick }) => (
    <div data-testid="error-table">
      <button data-testid="retry-btn" onClick={onClick}>
        Retry
      </button>
    </div>
  )),
}))

vi.mock('@/components/full-page-skeleton', () => ({
  FullpageSkeleton: vi.fn(() => <div data-testid="full-page-skeleton">Loading...</div>),
}))

import * as useOperatorModule from '@/hooks/useOperator'
import OperatorsPage from '../operators.page'

describe('Operators Page', () => {
  const mockUseOperator = useOperatorModule.useOperator as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the operators page with AdminLayout', () => {
    // Arrange
    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: { data: [] },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
  })

  it('should render loading state with FullpageSkeleton', () => {
    // Arrange
    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('full-page-skeleton')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByTestId('operator-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('error-table')).not.toBeInTheDocument()
  })

  it('should render error state with ErrorTable', () => {
    // Arrange
    const mockRefetch = vi.fn()
    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch operators'),
        refetch: mockRefetch,
      },
    })

    // Act
    render(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('error-table')).toBeInTheDocument()
    expect(screen.getByTestId('retry-btn')).toBeInTheDocument()
    expect(screen.queryByTestId('operator-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('full-page-skeleton')).not.toBeInTheDocument()
  })

  it('should call refetch when retry button is clicked', () => {
    // Arrange
    const mockRefetch = vi.fn()
    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: null,
        isLoading: false,
        error: new Error('Failed to fetch operators'),
        refetch: mockRefetch,
      },
    })

    // Act
    render(<OperatorsPage />)
    const retryBtn = screen.getByTestId('retry-btn')
    retryBtn.click()

    // Assert
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should render success state with CreateOperatorSection and OperatorTable', () => {
    // Arrange
    const mockOperators = [
      { id: 1, name: 'Operator 1' },
      { id: 2, name: 'Operator 2' },
    ]
    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: { data: mockOperators },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('create-operator-section')).toBeInTheDocument()
    expect(screen.getByTestId('operator-table')).toBeInTheDocument()
    expect(screen.getByText('Create Operator Section')).toBeInTheDocument()
    expect(screen.getByText('Operator Table with 2 items')).toBeInTheDocument()
    expect(screen.queryByTestId('error-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('full-page-skeleton')).not.toBeInTheDocument()
  })

  it('should render empty operator table when no data is available', () => {
    // Arrange
    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: { data: [] },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('create-operator-section')).toBeInTheDocument()
    expect(screen.getByTestId('operator-table')).toBeInTheDocument()
    expect(screen.getByText('Operator Table with 0 items')).toBeInTheDocument()
  })

  it('should render empty operator table when data is null', () => {
    // Arrange
    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('create-operator-section')).toBeInTheDocument()
    expect(screen.getByTestId('operator-table')).toBeInTheDocument()
    expect(screen.getByText('Operator Table with 0 items')).toBeInTheDocument()
  })

  it('should apply correct styling to loading container', () => {
    // Arrange
    mockUseOperator.mockReturnValue({
      operatorsQuery: {
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<OperatorsPage />)

    // Assert
    const loadingContainer = screen.getByTestId('full-page-skeleton').parentElement
    expect(loadingContainer).toHaveClass('flex', 'flex-1', 'flex-col', 'gap-2', 'm-2')
  })
})
