import { render, screen, fireEvent, cleanup } from '@testing-library/react'

vi.mock('react-router', () => ({
  useNavigate: vi.fn(() => vi.fn()),
}))

vi.mock('@/components/ui/table', () => ({
  Table: vi.fn(({ children }) => <table data-testid="table">{children}</table>),
  TableHeader: vi.fn(({ children }) => <thead data-testid="table-header">{children}</thead>),
  TableRow: vi.fn(({ children, key }) => <tr data-testid="table-row" data-key={key}>{children}</tr>),
  TableHead: vi.fn(({ children, className }) => (
    <th data-testid="table-head" className={className}>
      {children}
    </th>
  )),
  TableBody: vi.fn(({ children }) => <tbody data-testid="table-body">{children}</tbody>),
  TableCell: vi.fn(({ children, className }) => (
    <td data-testid="table-cell" className={className}>
      {children}
    </td>
  )),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, className, variant, onClick }) => (
    <button data-testid="button" className={className} data-variant={variant} onClick={onClick}>
      {children}
    </button>
  )),
}))

import { GameConfigTable, GameConfigTableItem, NewGameConfigTableItem } from '../game-config-table'
import { useNavigate } from 'react-router'

describe('GameConfigTable', () => {
  const mockNavigate = vi.fn()
  const mockData = [
    { id: 1, gameId: 100, config: {}, gameConfigSchema: 'schema-1' },
    { id: 2, gameId: 200, config: {}, gameConfigSchema: 'schema-2' },
    { id: 3, gameId: 300, config: {}, gameConfigSchema: 'schema-3' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('should render the game config table with correct structure', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-body')).toBeInTheDocument()
  })

  it('should render table headers correctly', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    expect(headers).toHaveLength(2)
    expect(headers[0]).toHaveTextContent('Game Id')
    expect(headers[1]).toHaveTextContent('Action')
  })

  it('should apply correct CSS classes to game ID header', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    expect(headers[0]).toHaveClass('w-[300px]', 'px-6')
  })

  it('should apply correct CSS classes to action header', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    expect(headers[1]).toHaveClass('px-6')
  })

  it('should render game config table items for each game config', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    const tableRows = screen.getAllByTestId('table-row')
    // 1 header row + 3 game config items + 1 new game item
    expect(tableRows).toHaveLength(5)
  })

  it('should render game IDs in table cells', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('200')).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
  })

  it('should render config buttons for each game config', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    const configButtons = screen.getAllByText('Config')
    expect(configButtons).toHaveLength(3)
  })

  it('should render new game button', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    const container = screen.getByTestId('table').closest('.overflow-hidden')
    expect(container).toHaveClass('overflow-hidden', 'rounded-lg', 'border', 'm-2')
  })

  it('should navigate to game config page when config button is clicked', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)
    const configButtons = screen.getAllByText('Config')
    fireEvent.click(configButtons[0])

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/game-configs/100')
  })

  it('should navigate to new game page when new button is clicked', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)
    const newButton = screen.getByRole('button', { name: 'New' })
    fireEvent.click(newButton)

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/game-configs/new')
  })

  it('should handle empty data array', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={[]} />)

    // Assert
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-body')).toBeInTheDocument()
    // Should still render the new game row
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
  })

  it('should apply correct CSS classes to config buttons', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    const configButtons = screen.getAllByText('Config')
    configButtons.forEach(button => {
      expect(button).toHaveClass('w-[100px]')
      expect(button).toHaveAttribute('data-variant', 'outline')
    })
  })

  it('should apply correct CSS classes to new button', () => {
    // Arrange
    // Act
    render(<GameConfigTable data={mockData} />)

    // Assert
    const newButton = screen.getByRole('button', { name: 'New' })
    expect(newButton).toHaveClass('w-[100px]', 'text-green-500')
    expect(newButton).toHaveAttribute('data-variant', 'outline')
  })
})

describe('GameConfigTableItem', () => {
  const mockHandleConfigClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the game config table item with correct structure', () => {
    // Arrange
    // Act
    render(<GameConfigTableItem gameId={123} handleConfigClick={mockHandleConfigClick} />)

    // Assert
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('Config')).toBeInTheDocument()
  })

  it('should display the game ID in table cell', () => {
    // Arrange
    // Act
    render(<GameConfigTableItem gameId={456} handleConfigClick={mockHandleConfigClick} />)

    // Assert
    expect(screen.getByText('456')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to table cells', () => {
    // Arrange
    // Act
    render(<GameConfigTableItem gameId={123} handleConfigClick={mockHandleConfigClick} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[0]).toHaveClass('px-6')
    expect(cells[1]).not.toHaveClass()
  })

  it('should call handleConfigClick when config button is clicked', () => {
    // Arrange
    // Act
    render(<GameConfigTableItem gameId={789} handleConfigClick={mockHandleConfigClick} />)
    const configButton = screen.getByText('Config')
    fireEvent.click(configButton)

    // Assert
    expect(mockHandleConfigClick).toHaveBeenCalledWith(789)
  })

  it('should apply correct CSS classes to config button', () => {
    // Arrange
    // Act
    render(<GameConfigTableItem gameId={123} handleConfigClick={mockHandleConfigClick} />)

    // Assert
    const configButton = screen.getByText('Config')
    expect(configButton).toHaveClass('w-[100px]')
    expect(configButton).toHaveAttribute('data-variant', 'outline')
  })

  it('should handle different game IDs', () => {
    // Arrange
    const gameIds = [1, 999, 1000000]

    // Act & Assert
    gameIds.forEach(gameId => {
      render(<GameConfigTableItem gameId={gameId} handleConfigClick={mockHandleConfigClick} />)
      expect(screen.getByText(gameId.toString())).toBeInTheDocument()
      cleanup()
    })
  })
})

describe('NewGameConfigTableItem', () => {
  const mockHandleConfigClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the new game config table item with correct structure', () => {
    // Arrange
    // Act
    render(<NewGameConfigTableItem handleConfigClick={mockHandleConfigClick} />)

    // Assert
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
  })

  it('should display "New" text in table cell', () => {
    // Arrange
    // Act
    render(<NewGameConfigTableItem handleConfigClick={mockHandleConfigClick} />)

    // Assert
    expect(screen.getAllByTestId('table-cell')[0]).toHaveTextContent('New')
  })

  it('should apply correct CSS classes to table cells', () => {
    // Arrange
    // Act
    render(<NewGameConfigTableItem handleConfigClick={mockHandleConfigClick} />)

    // Assert
    const cells = screen.getAllByTestId('table-cell')
    expect(cells[0]).toHaveClass('px-6')
    expect(cells[1]).not.toHaveClass()
  })

  it('should call handleConfigClick when new button is clicked', () => {
    // Arrange
    // Act
    render(<NewGameConfigTableItem handleConfigClick={mockHandleConfigClick} />)
    const newButton = screen.getByRole('button', { name: 'New' })
    fireEvent.click(newButton)

    // Assert
    expect(mockHandleConfigClick).toHaveBeenCalledTimes(1)
  })

  it('should apply correct CSS classes to new button', () => {
    // Arrange
    // Act
    render(<NewGameConfigTableItem handleConfigClick={mockHandleConfigClick} />)

    // Assert
    const newButton = screen.getByRole('button', { name: 'New' })
    expect(newButton).toHaveClass('w-[100px]', 'text-green-500')
    expect(newButton).toHaveAttribute('data-variant', 'outline')
  })
}) 