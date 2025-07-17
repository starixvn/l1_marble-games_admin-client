import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

// Mock the useAccounts hook
vi.mock('@/hooks/useAccounts', () => ({
  useAccounts: vi.fn(() => ({
    data: [
      { username: 'admin', email: 'admin@example.com' },
      { username: 'operator1', email: 'operator1@example.com' },
      { username: 'operator2', email: 'operator2@example.com' }
    ],
    isLoading: false,
    error: null
  }))
}))

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
import { useAccounts } from '@/hooks/useAccounts'

describe('AdminLogFields', () => {
  const mockOnSubmit = vi.fn()
  const mockUseAccounts = useAccounts as ReturnType<typeof vi.fn>

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

  it('should initialize with current day start and end times', () => {
    // Arrange
    const mockDate = new Date('2024-01-15T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const datetimeInputs = screen.getAllByTestId('datetime-input')
    expect(datetimeInputs[0]).toHaveValue(new Date('2024-01-15T00:00:00.000Z').toISOString()) // Current day at 00:00:00.000 UTC
    expect(datetimeInputs[1]).toHaveValue(new Date('2024-01-15T23:59:59.000Z').toISOString()) // Current day at 23:59:59.000 UTC

    // Cleanup
    vi.useRealTimers()
  })

  it('should call onSubmit with form data when form is submitted', () => {
    // Arrange
    const mockDate = new Date('2024-01-15T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)
    
    const form = screen.getAllByTestId('datetime-picker')[0].closest('form')
    expect(form).toBeInTheDocument()
    
    if (form) {
      fireEvent.submit(form)
    }

    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        author: undefined,
        resource: undefined,
        action: undefined,
        startDate: expect.stringMatching(/2024-01-1[45]T\d{2}:00:00\.000Z/),
        endDate: expect.stringMatching(/2024-01-1[45]T\d{2}:59:59\.000Z/),
      })
    )

    // Cleanup
    vi.useRealTimers()
  })

  it('should call onSubmit with selected values when form is submitted', () => {
    // Arrange
    const mockDate = new Date('2024-01-15T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)

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
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        author: 'admin',
        resource: 'operator',
        action: 'insert',
        startDate: expect.stringMatching(/2024-01-1[45]T\d{2}:00:00\.000Z/),
        endDate: expect.stringMatching(/2024-01-1[45]T\d{2}:59:59\.000Z/),
      })
    )

    // Cleanup
    vi.useRealTimers()
  })

  it('should render author combobox with mocked accounts data', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const comboboxSelects = screen.getAllByTestId('combobox-select')
    const authorSelect = comboboxSelects[0]
    expect(authorSelect).toBeInTheDocument()
    
    const options = Array.from(authorSelect.querySelectorAll('option'))
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('admin')
    expect(options[0]).toHaveValue('admin')
    expect(options[1]).toHaveTextContent('operator1')
    expect(options[1]).toHaveValue('operator1')
    expect(options[2]).toHaveTextContent('operator2')
    expect(options[2]).toHaveValue('operator2')
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
    expect(options[0]).toHaveTextContent('operator')
    expect(options[0]).toHaveValue('operator')
    expect(options[1]).toHaveTextContent('game-config')
    expect(options[1]).toHaveValue('game-config')
    expect(options[2]).toHaveTextContent('game-config-schema')
    expect(options[2]).toHaveValue('game-config-schema')
    expect(options[3]).toHaveTextContent('game-integration')
    expect(options[3]).toHaveValue('game-integration')
    expect(options[4]).toHaveTextContent('account')
    expect(options[4]).toHaveValue('account')
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
    expect(options).toHaveLength(3)
    expect(options[0]).toHaveTextContent('insert')
    expect(options[0]).toHaveValue('insert')
    expect(options[1]).toHaveTextContent('update')
    expect(options[1]).toHaveValue('update')
    expect(options[2]).toHaveTextContent('delete')
    expect(options[2]).toHaveValue('delete')
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

  it('should handle useAccounts hook being called', () => {
    // Arrange
    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    expect(mockUseAccounts).toHaveBeenCalledTimes(1)
  })

  it('should handle empty accounts data', () => {
    // Arrange
    mockUseAccounts.mockReturnValueOnce({
      data: [],
      isLoading: false,
      error: null
    })

    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const comboboxSelects = screen.getAllByTestId('combobox-select')
    const authorSelect = comboboxSelects[0]
    const options = Array.from(authorSelect.querySelectorAll('option'))
    expect(options).toHaveLength(0)
  })

  it('should handle loading state from useAccounts', () => {
    // Arrange
    mockUseAccounts.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      error: null
    })

    // Act
    render(<AdminLogFields onSubmit={mockOnSubmit} />)

    // Assert
    const comboboxSelects = screen.getAllByTestId('combobox-select')
    const authorSelect = comboboxSelects[0]
    const options = Array.from(authorSelect.querySelectorAll('option'))
    expect(options).toHaveLength(0)
  })
})
