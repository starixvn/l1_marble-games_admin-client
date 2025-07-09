import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useLocation: vi.fn(() => ({
      pathname: '/game-integrations',
      search: '',
      hash: '',
      state: null,
    })),
  }
})

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, className, variant, onClick, disabled }) => (
    <button data-testid="button" className={className} data-variant={variant} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/table', () => ({
  Table: vi.fn(({ children }) => <table data-testid="table">{children}</table>),
  TableHeader: vi.fn(({ children }) => <thead data-testid="table-header">{children}</thead>),
  TableRow: vi.fn(({ children, key }) => <tr data-testid="table-row" data-key={key}>{children}</tr>),
  TableCell: vi.fn(({ children, className }) => (
    <td data-testid="table-cell" className={className}>
      {children}
    </td>
  )),
  TableBody: vi.fn(({ children }) => <tbody data-testid="table-body">{children}</tbody>),
}))

vi.mock('@/components/combobox', () => ({
  Combobox: vi.fn(({ list, currentValue, setCurrentValue, keyProp, valueProp, className, valueFormatter }) => (
    <div data-testid="combobox" data-current-value={currentValue} data-key-prop={keyProp} data-value-prop={valueProp} className={className}>
      <div data-testid="combobox-props">
        {JSON.stringify({ list, valueFormatter: valueFormatter ? valueFormatter(list.find((item: { id: string | number }) => item.id === currentValue) ?? list[0]) : 'No formatter' })}
      </div>
      <button data-testid="mock-set-value" onClick={() => setCurrentValue(list[0]?.id ?? 'test-value')}>
        Set Value
      </button>
    </div>
  )),
}))

vi.mock('@tabler/icons-react', () => ({
  IconSettings: vi.fn(() => <div data-testid="settings-icon" />),
  IconTrash: vi.fn(() => <div data-testid="trash-icon" />),
}))

// Mock usePermission hook
vi.mock('@/hooks/usePermission', () => ({
  usePermission: vi.fn(),
}))

// Mock useProfile hook
vi.mock('@/hooks/useProfile', () => ({
  useProfile: vi.fn(),
}))

import {
  GameIntegrationTable,
  GameIntegrationTableHeader,
  GameIntegrationTableItem,
  NewGameIntegrationTableItem,
  GameIdCombobox,
  OperatorIdCombobox,
} from '../game-integration-table'
import { usePermission } from '@/hooks/usePermission'
import { useProfile } from '@/hooks/useProfile'

// Helper function to render with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('GameIntegrationTable', () => {
  const mockData = [
    { gameId: 100, operatorId: 'operator-1', operatorName: 'Operator One' },
    { gameId: 200, operatorId: 'operator-2', operatorName: 'Operator Two' },
    { gameId: 300, operatorId: 'operator-3' },
  ]

  const mockGameIds = [100, 200, 300, 400, 500]
  const mockOperatorIds = [
    { id: 'operator-1', name: 'Operator One' },
    { id: 'operator-2', name: 'Operator Two' },
    { id: 'operator-3' },
  ]

  const mockHandleConfigClick = vi.fn()
  const mockHandleDeleteClick = vi.fn()
  const mockSetCurrentGameId = vi.fn()
  const mockSetCurrentOperatorId = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Default permission mock - user has upsert permission
    vi.mocked(usePermission).mockReturnValue({ isAllowed: true })
    vi.mocked(useProfile).mockReturnValue({
      data: {
        username: 'test-user',
        allowedEndpoints: ['/gameIntegration/upsert', '/gameIntegration/delete']
      },
      isLoading: false,
      isError: false,
      error: null
    })
  })

  it('should render the game integration table with correct structure', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,   
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-body')).toBeInTheDocument()
  })

  it('should call usePermission with correct path for upsert permission', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(usePermission).toHaveBeenCalledWith({
      path: ['/gameIntegration/upsert']
    })
  })

  it('should render new game integration row when user has upsert permission', () => {
    // Arrange
    vi.mocked(usePermission).mockReturnValue({ isAllowed: true })
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('should not render new game integration row when user lacks upsert permission', () => {
    // Arrange
    vi.mocked(usePermission).mockReturnValue({ isAllowed: false })
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(screen.queryByText('New')).not.toBeInTheDocument()
  })

  it('should not render new game integration row when readonly is true', () => {
    // Arrange
    vi.mocked(usePermission).mockReturnValue({ isAllowed: true })
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
      readonly: true,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(screen.queryByText('New')).not.toBeInTheDocument()
  })

  it('should render table headers correctly', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(screen.getByText('Game ID')).toBeInTheDocument()
    expect(screen.getByText('Operator ID')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('should render game integration table items for each item in data', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    const tableRows = screen.getAllByTestId('table-row')
    // 3 data items + 1 header + 1 new item row
    expect(tableRows).toHaveLength(5)
  })

  it('should render game IDs in table cells', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
  })

  it('should render operator IDs with names when available', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(screen.getByText('operator-1 (Operator One)')).toBeInTheDocument()
    expect(screen.getByText('operator-2 (Operator Two)')).toBeInTheDocument()
    expect(screen.getByText('operator-3')).toBeInTheDocument()
  })

  it('should render config and delete buttons for each item', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    const settingsIcons = screen.getAllByTestId('settings-icon')
    const trashIcons = screen.getAllByTestId('trash-icon')
    expect(settingsIcons).toHaveLength(3)
    expect(trashIcons).toHaveLength(3)
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    const container = screen.getByTestId('table').closest('.overflow-hidden')
    expect(container).toHaveClass('overflow-hidden', 'rounded-lg', 'border', 'm-2')
  })

  it('should call handleConfigClick when config button is clicked', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)
    const configButtons = screen.getAllByTestId('button')
    const configButton = configButtons.find(button => button.querySelector('[data-testid="settings-icon"]'))
    if (configButton) {
      fireEvent.click(configButton)
    }

    // Assert
    expect(mockHandleConfigClick).toHaveBeenCalledWith({ gameId: 100, operatorId: 'operator-1' })
  })

  it('should call handleDeleteClick when delete button is clicked', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
      allowDelete: true,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)
    const deleteButton = screen.getAllByTestId('button')
    const deleteButtonElement = deleteButton.find(button => button.querySelector('[data-testid="trash-icon"]'))
    expect(deleteButtonElement).toBeTruthy()
    expect(deleteButtonElement).not.toBeDisabled()
    fireEvent.click(deleteButtonElement!)

    // Assert
    expect(mockHandleDeleteClick).toHaveBeenCalledWith({ gameId: 100, operatorId: 'operator-1' })
  })

  it('should handle empty data array', () => {
    // Arrange
    const props = {
      data: [],
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-body')).toBeInTheDocument()
    // Should still render the new item row when permission is granted
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to config buttons', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    const configButtons = screen.getAllByTestId('button')
    const configButton = configButtons.find(button => button.querySelector('[data-testid="settings-icon"]'))
    expect(configButton).toHaveClass('h-9', 'w-9', 'p-0')
    expect(configButton).toHaveAttribute('data-variant', 'outline')
  })

  it('should apply correct CSS classes to delete buttons', () => {
    // Arrange
    const props = {
      data: mockData,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<GameIntegrationTable {...props} />)

    // Assert
    const deleteButtons = screen.getAllByTestId('button')
    const deleteButton = deleteButtons.find(button => button.querySelector('[data-testid="trash-icon"]'))
    expect(deleteButton).toHaveClass('h-9', 'w-9', 'p-0', 'text-red-600', 'hover:text-red-700', 'hover:bg-red-50')
    expect(deleteButton).toHaveAttribute('data-variant', 'outline')
  })
})

describe('GameIntegrationTableHeader', () => {
  it('should render the table header with correct structure', () => {
    // Arrange
    // Act
    renderWithRouter(<GameIntegrationTableHeader />)

    // Assert
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
    expect(screen.getByText('Game ID')).toBeInTheDocument()
    expect(screen.getByText('Operator ID')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to header cells', () => {
    // Arrange
    // Act
    renderWithRouter(<GameIntegrationTableHeader />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[0]).toHaveClass('px-6', 'font-bold')
    expect(cells[1]).toHaveClass('px-6', 'font-bold')
    expect(cells[2]).toHaveClass('font-bold')
  })
})

describe('GameIntegrationTableItem', () => {
  const mockHandleConfigClick = vi.fn()
  const mockHandleDeleteClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the table item with correct structure', () => {
    // Arrange
    const props = {
      gameId: 123,
      operatorId: 'operator-123',
      operatorName: 'Test Operator',
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
    }

    // Act
    renderWithRouter(<GameIntegrationTableItem {...props} />)

    // Assert
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('operator-123 (Test Operator)')).toBeInTheDocument()
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument()
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
  })

  it('should render operator ID without name when operatorName is not provided', () => {
    // Arrange
    const props = {
      gameId: 123,
      operatorId: 'operator-123',
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
    }

    // Act
    renderWithRouter(<GameIntegrationTableItem {...props} />)

    // Assert
    expect(screen.getByText('operator-123')).toBeInTheDocument()
  })

  it('should call handleConfigClick when config button is clicked', () => {
    // Arrange
    const props = {
      gameId: 123,
      operatorId: 'operator-123',
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
    }

    // Act
    renderWithRouter(<GameIntegrationTableItem {...props} />)
    const configButton = screen.getByTestId('settings-icon').closest('button')
    fireEvent.click(configButton!)

    // Assert
    expect(mockHandleConfigClick).toHaveBeenCalledWith({ gameId: 123, operatorId: 'operator-123' })
  })

  it('should call handleDeleteClick when delete button is clicked', () => {
    // Arrange
    const props = {
      gameId: 123,
      operatorId: 'operator-123',
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      allowDelete: true,
    }

    // Act
    renderWithRouter(<GameIntegrationTableItem {...props} />)
    const deleteButton = screen.getAllByTestId('button')[1]
    expect(deleteButton).not.toBeDisabled()
    fireEvent.click(deleteButton)

    // Assert
    expect(mockHandleDeleteClick).toHaveBeenCalledWith({ gameId: 123, operatorId: 'operator-123' })
  })

  it('should apply correct CSS classes to action cell', () => {
    // Arrange
    const props = {
      gameId: 123,
      operatorId: 'operator-123',
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
    }

    // Act
    renderWithRouter(<GameIntegrationTableItem {...props} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[2]).toHaveClass('flex', 'gap-2')
  })

  it('should not render action buttons when readonly is true', () => {
    // Arrange
    const props = {
      gameId: 123,
      operatorId: 'operator-123',
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      readonly: true,
    }

    // Act
    renderWithRouter(<GameIntegrationTableItem {...props} />)

    // Assert
    expect(screen.queryByTestId('settings-icon')).not.toBeInTheDocument()
    expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument()
  })

  it('should disable delete button when allowDelete is false', () => {
    // Arrange
    const props = {
      gameId: 123,
      operatorId: 'operator-123',
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      allowDelete: false,
    }

    // Act
    renderWithRouter(<GameIntegrationTableItem {...props} />)

    // Assert
    const deleteButton = screen.getAllByTestId('button')[1]
    expect(deleteButton).toBeDisabled()
  })

  it('should enable delete button when allowDelete is true', () => {
    // Arrange
    const props = {
      gameId: 123,
      operatorId: 'operator-123',
      handleConfigClick: mockHandleConfigClick,
      handleDeleteClick: mockHandleDeleteClick,
      allowDelete: true,
    }

    // Act
    renderWithRouter(<GameIntegrationTableItem {...props} />)

    // Assert
    const deleteButton = screen.getAllByTestId('button')[1]
    expect(deleteButton).not.toBeDisabled()
  })
})

describe('NewGameIntegrationTableItem', () => {
  const mockHandleConfigClick = vi.fn()
  const mockSetCurrentGameId = vi.fn()
  const mockSetCurrentOperatorId = vi.fn()

  const mockGameIds = [100, 200, 300]
  const mockOperatorIds = [
    { id: 'operator-1', name: 'Operator One' },
    { id: 'operator-2', name: 'Operator Two' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the new game integration table item with correct structure', () => {
    // Arrange
    const props = {
      handleConfigClick: mockHandleConfigClick,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<NewGameIntegrationTableItem {...props} />)

    // Assert
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
    expect(screen.getAllByTestId('combobox')).toHaveLength(2)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('should call handleConfigClick when New button is clicked with valid selections', () => {
    // Arrange
    const props = {
      handleConfigClick: mockHandleConfigClick,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      currentGameId: 100,
      currentOperatorId: 'operator-1',
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<NewGameIntegrationTableItem {...props} />)
    const newButton = screen.getByText('New')
    fireEvent.click(newButton)

    // Assert
    expect(mockHandleConfigClick).toHaveBeenCalledWith({ gameId: 100, operatorId: 'operator-1' })
  })

  it('should not call handleConfigClick when New button is clicked without selections', () => {
    // Arrange
    const props = {
      handleConfigClick: mockHandleConfigClick,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<NewGameIntegrationTableItem {...props} />)
    const newButton = screen.getByText('New')
    fireEvent.click(newButton)

    // Assert
    expect(mockHandleConfigClick).not.toHaveBeenCalled()
  })

  it('should apply correct CSS classes to New button', () => {
    // Arrange
    const props = {
      handleConfigClick: mockHandleConfigClick,
      gameIds: mockGameIds,
      operatorIds: mockOperatorIds,
      currentGameId: null,
      currentOperatorId: null,
      setCurrentGameId: mockSetCurrentGameId,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<NewGameIntegrationTableItem {...props} />)

    // Assert
    const newButton = screen.getByText('New')
    expect(newButton).toHaveClass('w-[5rem]')
    expect(newButton).toHaveAttribute('data-variant', 'outline')
  })
})

describe('GameIdCombobox', () => {
  const mockSetCurrentGameId = vi.fn()
  const mockGameIds = [100, 200, 300]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the game ID combobox with correct structure', () => {
    // Arrange
    const props = {
      gameIds: mockGameIds,
      currentGameId: 100,
      setCurrentGameId: mockSetCurrentGameId,
    }

    // Act
    renderWithRouter(<GameIdCombobox {...props} />)

    // Assert
    expect(screen.getByTestId('combobox')).toBeInTheDocument()
  })

  it('should pass correct props to Combobox component', () => {
    // Arrange
    const props = {
      gameIds: mockGameIds,
      currentGameId: 200,
      setCurrentGameId: mockSetCurrentGameId,
    }

    // Act
    renderWithRouter(<GameIdCombobox {...props} />)

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).toHaveAttribute('data-current-value', '200')
    expect(combobox).toHaveAttribute('data-key-prop', 'id')
    expect(combobox).toHaveAttribute('data-value-prop', 'id')
    expect(combobox).toHaveClass('w-[100px]')
  })

  it('should transform game IDs correctly for combobox', () => {
    // Arrange
    const props = {
      gameIds: mockGameIds,
      currentGameId: 100,
      setCurrentGameId: mockSetCurrentGameId,
    }

    // Act
    renderWithRouter(<GameIdCombobox {...props} />)

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const comboboxProps = JSON.parse(propsElement.textContent ?? '{}')
    expect(comboboxProps.list).toEqual([
      { id: 100 },
      { id: 200 },
      { id: 300 },
    ])
  })

  it('should handle null current game ID', () => {
    // Arrange
    const props = {
      gameIds: mockGameIds,
      currentGameId: null,
      setCurrentGameId: mockSetCurrentGameId,
    }

    // Act
    renderWithRouter(<GameIdCombobox {...props} />)

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).not.toHaveAttribute('data-current-value')
  })
})

describe('OperatorIdCombobox', () => {
  const mockSetCurrentOperatorId = vi.fn()
  const mockOperatorIds = [
    { id: 'operator-1', name: 'Operator One' },
    { id: 'operator-2', name: 'Operator Two' },
    { id: 'operator-3' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the operator ID combobox with correct structure', () => {
    // Arrange
    const props = {
      operatorIds: mockOperatorIds,
      currentOperatorId: 'operator-1',
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<OperatorIdCombobox {...props} />)

    // Assert
    expect(screen.getByTestId('combobox')).toBeInTheDocument()
  })

  it('should pass correct props to Combobox component', () => {
    // Arrange
    const props = {
      operatorIds: mockOperatorIds,
      currentOperatorId: 'operator-2',
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<OperatorIdCombobox {...props} />)

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).toHaveAttribute('data-current-value', 'operator-2')
    expect(combobox).toHaveAttribute('data-key-prop', 'id')
    expect(combobox).toHaveAttribute('data-value-prop', 'id')
    expect(combobox).toHaveClass('w-[300px]')
  })

  it('should transform operator IDs correctly for combobox', () => {
    // Arrange
    const props = {
      operatorIds: mockOperatorIds,
      currentOperatorId: 'operator-1',
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<OperatorIdCombobox {...props} />)

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const comboboxProps = JSON.parse(propsElement.textContent ?? '{}')
    expect(comboboxProps.list).toEqual([
      { id: 'operator-1', name: 'Operator One' },
      { id: 'operator-2', name: 'Operator Two' },
      { id: 'operator-3', name: '' },
    ])
  })

  it('should handle null current operator ID', () => {
    // Arrange
    const props = {
      operatorIds: mockOperatorIds,
      currentOperatorId: null,
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<OperatorIdCombobox {...props} />)

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).not.toHaveAttribute('data-current-value')
  })

  it('should format operator names correctly', () => {
    // Arrange
    const props = {
      operatorIds: mockOperatorIds,
      currentOperatorId: 'operator-1',
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<OperatorIdCombobox {...props} />)

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const comboboxProps = JSON.parse(propsElement.textContent ?? '{}')
    expect(comboboxProps.valueFormatter).toBe('operator-1 (Operator One)')
  })

  it('should handle operators without names', () => {
    // Arrange
    const props = {
      operatorIds: mockOperatorIds,
      currentOperatorId: 'operator-3',
      setCurrentOperatorId: mockSetCurrentOperatorId,
    }

    // Act
    renderWithRouter(<OperatorIdCombobox {...props} />)

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const comboboxProps = JSON.parse(propsElement.textContent ?? '{}')
    expect(comboboxProps.valueFormatter).toBe('operator-3 ')
  })
}) 