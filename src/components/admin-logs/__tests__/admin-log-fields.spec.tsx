import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/components/datetime-picker', () => ({
  DateTimePicker24h: vi.fn(({ label, date, setDate }) => (
    <div data-testid="datetime-picker" data-label={label}>
      <input 
        data-testid="datetime-input" 
        value={date.toISOString()} 
        onChange={(e) => setDate(new Date(e.target.value))}
      />
    </div>
  )),
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(({ children, className }) => (
    <label data-testid="label" className={className}>{children}</label>
  )),
}))

vi.mock('@/components/combobox', () => ({
  Combobox: vi.fn(({ list, currentValue, setCurrentValue, keyProp, valueProp, valueFormatter }) => (
    <div data-testid="combobox" data-current-value={currentValue}>
      <select 
        data-testid="combobox-select" 
        value={currentValue ?? ''} 
        onChange={(e) => setCurrentValue(e.target.value ?? undefined)}
      >
        {list.map((item: Record<string, unknown>) => (
          <option key={item[keyProp] as string} value={(item[valueProp] as string) || item[keyProp] as string}>
            {valueFormatter(item)}
          </option>
        ))}
      </select>
    </div>
  )),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, className, variant, type }) => (
    <button data-testid="button" className={className} data-variant={variant} type={type}>
      {children}
    </button>
  )),
}))

import { AdminLogFields } from '../admin-log-fields'

describe('AdminLogFields', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the admin log fields form with correct structure', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    expect(screen.getAllByTestId('datetime-picker')).toHaveLength(2)
    expect(screen.getAllByTestId('combobox')).toHaveLength(3)
    expect(screen.getByTestId('button')).toBeInTheDocument()
  })

  it('should render datetime pickers with correct labels', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const datetimePickers = screen.getAllByTestId('datetime-picker')
    expect(datetimePickers[0]).toHaveAttribute('data-label', 'Start Time (UTC)')
    expect(datetimePickers[1]).toHaveAttribute('data-label', 'End Time (UTC)')
  })

  it('should render comboboxes with correct labels', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const labels = screen.getAllByTestId('label')
    expect(labels[0]).toHaveTextContent('Author')
    expect(labels[1]).toHaveTextContent('Resource')
    expect(labels[2]).toHaveTextContent('Action')
  })

  it('should render search button with correct attributes', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const searchButton = screen.getByTestId('button')
    expect(searchButton).toHaveTextContent('Search')
    expect(searchButton).toHaveAttribute('type', 'submit')
    expect(searchButton).toHaveAttribute('data-variant', 'outline')
    expect(searchButton).toHaveClass('w-24')
  })

  it('should apply correct CSS classes to form', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const form = screen.getAllByTestId('datetime-picker')[0].closest('form')
    expect(form).toHaveClass('flex', 'flex-col', 'lg:flex-row', 'lg:items-center', 'gap-3')
  })

  it('should apply correct CSS classes to label containers', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const labelContainers = screen.getAllByTestId('label').map(label => label.closest('.flex.flex-col.gap-3'))
    labelContainers.forEach(container => {
      expect(container).toHaveClass('flex', 'flex-col', 'gap-3')
    })
  })

  it('should apply correct CSS classes to labels', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const labels = screen.getAllByTestId('label')
    labels.forEach(label => {
      expect(label).toHaveClass('text-sm', 'font-medium')
    })
  })

  it('should initialize with default date values', () => {
    // Arrange
    const mockDate = new Date('2024-01-01T00:00:00.000Z')
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date)

    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const datetimeInputs = screen.getAllByTestId('datetime-input')
    expect(datetimeInputs[0]).toHaveValue(mockDate.toISOString())
    expect(datetimeInputs[1]).toHaveValue(new Date(mockDate.getTime() + 1000 * 60 * 60).toISOString())
  })

  it('should call onSubmit with form data when form is submitted', async () => {
    // Arrange
    const mockDate = new Date('2024-01-01T00:00:00.000Z')
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date)

    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)
    
    const form = screen.getAllByTestId('datetime-picker')[0].closest('form')
    expect(form).toBeInTheDocument()
    
    if (form) {
      fireEvent.submit(form)
    }

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        startDate: mockDate.toISOString(),
        endDate: new Date(mockDate.getTime() + 1000 * 60 * 60).toISOString(),
        author: undefined,
        resource: undefined,
        action: undefined,
      })
    })
  })

  it('should call onSubmit with selected values when form is submitted', async () => {
    // Arrange
    const mockDate = new Date('2024-01-01T00:00:00.000Z')
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date)

    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)
    
    // Select values in comboboxes
    const comboboxSelects = screen.getAllByTestId('combobox-select')
    fireEvent.change(comboboxSelects[0], { target: { value: 'admin' } }) // Author
    fireEvent.change(comboboxSelects[1], { target: { value: 'operator' } }) // Resource
    fireEvent.change(comboboxSelects[2], { target: { value: 'insert' } }) // Action
    
    const form = screen.getAllByTestId('datetime-picker')[0].closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        startDate: mockDate.toISOString(),
        endDate: new Date(mockDate.getTime() + 1000 * 60 * 60).toISOString(),
        author: 'admin',
        resource: 'operator',
        action: 'insert',
      })
    })
  })

  it('should render author combobox with correct options', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const comboboxSelects = screen.getAllByTestId('combobox-select')
    const authorSelect = comboboxSelects[0]
    expect(authorSelect).toBeInTheDocument()
    
    const options = Array.from(authorSelect.querySelectorAll('option'))
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('admin')
    expect(options[0]).toHaveValue('admin')
  })

  it('should render resource combobox with correct options', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const comboboxSelects = screen.getAllByTestId('combobox-select')
    const resourceSelect = comboboxSelects[1]
    expect(resourceSelect).toBeInTheDocument()
    
    const options = Array.from(resourceSelect.querySelectorAll('option'))
    expect(options).toHaveLength(5)
    expect(options[0]).toHaveTextContent('ALL')
    expect(options[0]).toHaveValue('ALL')
    expect(options[1]).toHaveTextContent('operator')
    expect(options[1]).toHaveValue('operator')
    expect(options[2]).toHaveTextContent('game-config')
    expect(options[2]).toHaveValue('game-config')
    expect(options[3]).toHaveTextContent('game-config-schema')
    expect(options[3]).toHaveValue('game-config-schema')
    expect(options[4]).toHaveTextContent('game-integration')
    expect(options[4]).toHaveValue('game-integration')
  })

  it('should render action combobox with correct options', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const comboboxSelects = screen.getAllByTestId('combobox-select')
    const actionSelect = comboboxSelects[2]
    expect(actionSelect).toBeInTheDocument()
    
    const options = Array.from(actionSelect.querySelectorAll('option'))
    expect(options).toHaveLength(4)
    expect(options[0]).toHaveTextContent('ALL')
    expect(options[0]).toHaveValue('ALL')
    expect(options[1]).toHaveTextContent('insert')
    expect(options[1]).toHaveValue('insert')
    expect(options[2]).toHaveTextContent('update')
    expect(options[2]).toHaveValue('update')
    expect(options[3]).toHaveTextContent('delete')
    expect(options[3]).toHaveValue('delete')
  })

  it('should handle empty space label for button alignment', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const labels = screen.getAllByTestId('label')
    const lastLabel = labels[labels.length - 1]
    expect(lastLabel).toHaveTextContent('')
  })
})
