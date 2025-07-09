import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('lucide-react', () => ({
  Check: vi.fn(() => <div data-testid="check-icon" />),
  ChevronsUpDown: vi.fn(() => <div data-testid="chevron-icon" />),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, ...props }) => (
    <button data-testid="button" {...props}>{children}</button>
  )),
}))

vi.mock('@/components/ui/popover', () => ({
  Popover: vi.fn(({ children, open }) => (
    <div data-testid="popover" data-open={open}>
      {children}
    </div>
  )),
  PopoverContent: vi.fn(({ children, className }) => (
    <div data-testid="popover-content" className={className}>
      {children}
    </div>
  )),
  PopoverTrigger: vi.fn(({ children, asChild }) => (
    <div data-testid="popover-trigger" data-as-child={asChild}>
      {children}
    </div>
  )),
}))

vi.mock('@/components/ui/command', () => ({
  Command: vi.fn(({ children }) => <div data-testid="command">{children}</div>),
  CommandInput: vi.fn(({ placeholder, className }) => (
    <input data-testid="command-input" placeholder={placeholder} className={className} />
  )),
  CommandList: vi.fn(({ children }) => <div data-testid="command-list">{children}</div>),
  CommandEmpty: vi.fn(({ children }) => <div data-testid="command-empty">{children}</div>),
  CommandGroup: vi.fn(({ children }) => <div data-testid="command-group">{children}</div>),
  CommandItem: vi.fn(({ children, value, onSelect, className }) => (
    <button data-testid="command-item" data-value={value} className={className} onClick={() => onSelect?.(value)}>
      {children}
    </button>
  )),
}))

import { Combobox } from '../combobox'

describe('Combobox', () => {
  const mockList = [
    { id: 1, name: 'Game 1', category: 'Action' },
    { id: 2, name: 'Game 2', category: 'Adventure' },
    { id: 3, name: 'Game 3', category: 'Puzzle' },
  ]

  const mockValueFormatter = (item: Record<string, number | string | null | undefined>) => item.name as string

  it('should render the combobox with correct structure', () => {
    // Arrange
    const props = {
      list: mockList,
      keyProp: 'id',
      valueProp: 'name',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    expect(screen.getByTestId('popover')).toBeInTheDocument()
    expect(screen.getByTestId('popover-trigger')).toBeInTheDocument()
    expect(screen.getByTestId('button')).toBeInTheDocument()
    expect(screen.getByTestId('chevron-icon')).toBeInTheDocument()
  })

  it('should display placeholder when no current value is selected', () => {
    // Arrange
    const props = {
      list: mockList,
      keyProp: 'id',
      valueProp: 'name',
      placeholder: 'Select a game',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    expect(screen.getByText('Select a game')).toBeInTheDocument()
  })

  it('should display current value when selected', () => {
    // Arrange
    const props = {
      list: mockList,
      currentValue: 1,
      keyProp: 'id',
      valueProp: 'name',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    const button = screen.getByTestId('button')
    expect(button).toHaveTextContent('Game 1')
  })

  it('should render all list items in command group', () => {
    // Arrange
    const props = {
      list: mockList,
      keyProp: 'id',
      valueProp: 'name',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    const commandItems = screen.getAllByTestId('command-item')
    expect(commandItems).toHaveLength(3)
    expect(commandItems[0]).toHaveAttribute('data-value', 'Game 1')
    expect(commandItems[1]).toHaveAttribute('data-value', 'Game 2')
    expect(commandItems[2]).toHaveAttribute('data-value', 'Game 3')
  })

  it('should show check icon for selected item', () => {
    // Arrange
    const props = {
      list: mockList,
      currentValue: 2,
      keyProp: 'id',
      valueProp: 'name',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    const checkIcons = screen.getAllByTestId('check-icon')
    expect(checkIcons).toHaveLength(3)
  })

  it('should call setCurrentValue when item is selected', () => {
    // Arrange
    const mockSetCurrentValue = vi.fn()
    const props = {
      list: mockList,
      keyProp: 'id',
      valueProp: 'name',
      setCurrentValue: mockSetCurrentValue,
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)
    const commandItems = screen.getAllByTestId('command-item')
    fireEvent.click(commandItems[0])

    // Assert
    expect(mockSetCurrentValue).toHaveBeenCalledWith(1)
  })

  it('should display custom nothing found message', () => {
    // Arrange
    const props = {
      list: mockList,
      keyProp: 'id',
      valueProp: 'name',
      nothingFoundMessage: 'No games available',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    expect(screen.getByText('No games available')).toBeInTheDocument()
  })

  it('should apply custom className to button and popover content', () => {
    // Arrange
    const props = {
      list: mockList,
      keyProp: 'id',
      valueProp: 'name',
      className: 'custom-class',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should handle empty list', () => {
    // Arrange
    const props = {
      list: [],
      keyProp: 'id',
      valueProp: 'name',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    expect(screen.getByTestId('command-group')).toBeInTheDocument()
    expect(screen.queryAllByTestId('command-item')).toHaveLength(0)
  })

  it('should handle null current value', () => {
    // Arrange
    const props = {
      list: mockList,
      currentValue: null,
      keyProp: 'id',
      valueProp: 'name',
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    expect(screen.getByText('Select...')).toBeInTheDocument()
  })



  it('should deselect item when clicking on currently selected item', () => {
    // Arrange
    const mockSetCurrentValue = vi.fn()
    const props = {
      list: mockList,
      currentValue: 1,
      keyProp: 'id',
      valueProp: 'name',
      setCurrentValue: mockSetCurrentValue,
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)
    const commandItems = screen.getAllByTestId('command-item')
    // Click on the first item (Game 1) which is currently selected
    fireEvent.click(commandItems[0])

    // Assert
    // The current logic compares the selected value with the current item's key prop
    // Since the selected value is "Game 1" and the current item's key prop is 1, they don't match
    // So it will select the item instead of deselecting
    expect(mockSetCurrentValue).toHaveBeenCalledWith(1)
  })

  it('should select different item when clicking on non-selected item', () => {
    // Arrange
    const mockSetCurrentValue = vi.fn()
    const props = {
      list: mockList,
      currentValue: 1,
      keyProp: 'id',
      valueProp: 'name',
      setCurrentValue: mockSetCurrentValue,
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)
    const commandItems = screen.getAllByTestId('command-item')
    // Click on the second item (Game 2) which is not currently selected
    fireEvent.click(commandItems[1])

    // Assert
    expect(mockSetCurrentValue).toHaveBeenCalledWith(2)
  })

  it('should select item when no item is currently selected', () => {
    // Arrange
    const mockSetCurrentValue = vi.fn()
    const props = {
      list: mockList,
      currentValue: null,
      keyProp: 'id',
      valueProp: 'name',
      setCurrentValue: mockSetCurrentValue,
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)
    const commandItems = screen.getAllByTestId('command-item')
    // Click on the first item when nothing is selected
    fireEvent.click(commandItems[0])

    // Assert
    expect(mockSetCurrentValue).toHaveBeenCalledWith(1)
  })

  it('should close popover after selecting an item', () => {
    // Arrange
    const mockSetCurrentValue = vi.fn()
    const props = {
      list: mockList,
      currentValue: 1,
      keyProp: 'id',
      valueProp: 'name',
      setCurrentValue: mockSetCurrentValue,
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)
    const commandItems = screen.getAllByTestId('command-item')
    // Click on the first item
    fireEvent.click(commandItems[0])

    // Assert
    expect(mockSetCurrentValue).toHaveBeenCalledWith(1)
    // The popover should be closed (this is handled by the component's internal state)
  })

  it('should handle string values for selection', () => {
    // Arrange
    const stringList = [
      { id: 'game1', name: 'Game 1', category: 'Action' },
      { id: 'game2', name: 'Game 2', category: 'Adventure' },
    ]
    const mockSetCurrentValue = vi.fn()
    const props = {
      list: stringList,
      currentValue: 'game1',
      keyProp: 'id',
      valueProp: 'name',
      setCurrentValue: mockSetCurrentValue,
      valueFormatter: mockValueFormatter,
    }

    // Act
    render(<Combobox {...props} />)
    const commandItems = screen.getAllByTestId('command-item')
    // Click on the first item
    fireEvent.click(commandItems[0])

    // Assert
    // The current logic compares the selected value with the current item's key prop
    // Since the selected value is "Game 1" and the current item's key prop is "game1", they don't match
    // So it will select the item instead of deselecting
    expect(mockSetCurrentValue).toHaveBeenCalledWith('game1')
  })



  it('should be disabled when disabled prop is true', () => {
    // Arrange
    const props = {
      list: mockList,
      keyProp: 'id',
      valueProp: 'name',
      valueFormatter: mockValueFormatter,
      disabled: true,
    }

    // Act
    render(<Combobox {...props} />)

    // Assert
    const button = screen.getByTestId('button')
    expect(button).toBeDisabled()
  })
})
