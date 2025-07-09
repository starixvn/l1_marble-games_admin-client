import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/hooks/useOperator', () => ({
  useOperator: vi.fn(),
}))

vi.mock('@/hooks/usePermission', () => ({
  usePermission: vi.fn(),
}))

vi.mock('@/components/operator-table', () => ({
  OperatorTable: vi.fn(({ data, readonly }) => (
    <div data-testid="operator-table">
      Operator Table with {data.length} items {readonly ? '(readonly)' : '(editable)'}
    </div>
  )),
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
import * as usePermissionModule from '@/hooks/usePermission'
import OperatorsPage from '../operators.page'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('Operators Page', () => {
  const mockUseOperator = useOperatorModule.useOperator as ReturnType<typeof vi.fn>
  const mockUsePermission = usePermissionModule.usePermission as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    // Default permission mock - allowed
    mockUsePermission.mockReturnValue({
      isAllowed: true,
    })
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
    renderWithRouter(<OperatorsPage />)

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
    renderWithRouter(<OperatorsPage />)

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
    renderWithRouter(<OperatorsPage />)

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
    renderWithRouter(<OperatorsPage />)
    const retryBtn = screen.getByTestId('retry-btn')
    retryBtn.click()

    // Assert
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it('should render success state with CreateOperatorSection and OperatorTable when permissions are allowed', () => {
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
    mockUsePermission.mockReturnValue({
      isAllowed: true,
    })

    // Act
    renderWithRouter(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('create-operator-section')).toBeInTheDocument()
    expect(screen.getByTestId('operator-table')).toBeInTheDocument()
    expect(screen.getByText('Create Operator Section')).toBeInTheDocument()
    expect(screen.getByText('Operator Table with 2 items (editable)')).toBeInTheDocument()
    expect(screen.queryByTestId('error-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('full-page-skeleton')).not.toBeInTheDocument()
  })

  it('should render success state without CreateOperatorSection and with readonly OperatorTable when permissions are not allowed', () => {
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
    mockUsePermission.mockReturnValue({
      isAllowed: false,
    })

    // Act
    renderWithRouter(<OperatorsPage />)

    // Assert
    expect(screen.queryByTestId('create-operator-section')).not.toBeInTheDocument()
    expect(screen.getByTestId('operator-table')).toBeInTheDocument()
    expect(screen.getByText('Operator Table with 2 items (readonly)')).toBeInTheDocument()
    expect(screen.queryByTestId('error-table')).not.toBeInTheDocument()
    expect(screen.queryByTestId('full-page-skeleton')).not.toBeInTheDocument()
  })

  it('should call usePermission with correct operator endpoints', () => {
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
    renderWithRouter(<OperatorsPage />)

    // Assert
    expect(mockUsePermission).toHaveBeenCalledWith({
      path: ['/operator/create', '/operator/generatePassword', '/operator/updateName'],
    })
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
    renderWithRouter(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('create-operator-section')).toBeInTheDocument()
    expect(screen.getByTestId('operator-table')).toBeInTheDocument()
    expect(screen.getByText('Operator Table with 0 items (editable)')).toBeInTheDocument()
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
    renderWithRouter(<OperatorsPage />)

    // Assert
    expect(screen.getByTestId('create-operator-section')).toBeInTheDocument()
    expect(screen.getByTestId('operator-table')).toBeInTheDocument()
    expect(screen.getByText('Operator Table with 0 items (editable)')).toBeInTheDocument()
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
    renderWithRouter(<OperatorsPage />)

    // Assert
    const loadingContainer = screen.getByTestId('full-page-skeleton').parentElement
    expect(loadingContainer).toHaveClass('flex', 'flex-1', 'flex-col', 'gap-2', 'm-2')
  })
})
