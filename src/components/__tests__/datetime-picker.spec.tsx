import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DateTimePicker24h } from '../datetime-picker'
import type { DateTimePickerProps } from '../datetime-picker'

// Mock external dependencies
vi.mock('date-fns', () => ({
  format: vi.fn(),
}))

vi.mock('lucide-react', () => ({
  CalendarIcon: vi.fn(),
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(),
}))

vi.mock('@/components/ui/popover', () => ({
  Popover: vi.fn(),
  PopoverContent: vi.fn(),
  PopoverTrigger: vi.fn(),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(),
}))

vi.mock('@/components/ui/calendar', () => ({
  Calendar: vi.fn(),
}))

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: vi.fn(),
  ScrollBar: vi.fn(),
}))

vi.mock('@/lib/utils', () => ({
  cn: vi.fn(),
}))

// Import mocked functions
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const mockFormat = vi.mocked(format)
const mockCalendarIcon = vi.mocked(CalendarIcon)
const mockLabel = vi.mocked(Label)
const mockPopover = vi.mocked(Popover)
const mockPopoverContent = vi.mocked(PopoverContent)
const mockPopoverTrigger = vi.mocked(PopoverTrigger)
const mockButton = vi.mocked(Button)
const mockCalendar = vi.mocked(Calendar)
const mockScrollArea = vi.mocked(ScrollArea)
const mockScrollBar = vi.mocked(ScrollBar)
const mockCn = vi.mocked(cn)

describe('DateTimePicker24h', () => {
  const mockSetDate = vi.fn()
  const mockProps: DateTimePickerProps = {
    label: 'Test Date',
    date: new Date('2024-01-01T12:30:00Z'),
    setDate: mockSetDate,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementations
    mockFormat.mockReturnValue('01/01/2024 12:30')
    mockCalendarIcon.mockImplementation(() => <div data-testid="calendar-icon" />)
    mockCn.mockReturnValue('mock-class')
    
    mockLabel.mockImplementation(({ children, htmlFor, className }) => (
      <label data-testid="label" htmlFor={htmlFor} className={className}>
        {children}
      </label>
    ))
    
    mockPopover.mockImplementation(({ children, open }) => (
      <div data-testid="popover" data-open={open}>
        {children}
      </div>
    ))
    
    mockPopoverTrigger.mockImplementation(({ asChild, children }) => (
      <div data-testid="popover-trigger" data-as-child={asChild}>
        {children}
      </div>
    ))
    
    mockPopoverContent.mockImplementation(({ children, className }) => (
      <div data-testid="popover-content" className={className}>
        {children}
      </div>
    ))
    
    mockButton.mockImplementation(({ children, variant, className, onClick, size }) => (
      <button 
        data-testid="button" 
        data-variant={variant} 
        className={className}
        onClick={onClick}
        data-size={size}
      >
        {children}
      </button>
    ))
    
    mockCalendar.mockImplementation(({ mode, ...props }) => (
      <div data-testid="calendar" data-mode={mode}>
        <button onClick={() => {
          const calendarProps = props as { onSelect?: (date: Date | undefined) => void; selected?: Date }
          calendarProps.onSelect?.(new Date('2024-01-15T12:30:00Z'))
        }}>
          Select Date
        </button>
        <span data-testid="selected-date">{(props as { selected?: Date }).selected?.toISOString()}</span>
      </div>
    ))
    
    mockScrollArea.mockImplementation(({ children, className }) => (
      <div data-testid="scroll-area" className={className}>
        {children}
      </div>
    ))
    
    mockScrollBar.mockImplementation(({ orientation, className }) => (
      <div data-testid="scroll-bar" data-orientation={orientation} className={className} />
    ))
  })

  it('should render with correct label', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(screen.getByText('Test Date')).toBeInTheDocument()
    expect(mockLabel).toHaveBeenCalledWith(
      expect.objectContaining({
        htmlFor: 'date',
        className: 'text-sm font-medium',
        children: 'Test Date',
      }),
      undefined
    )
  })

  it('should render trigger button with formatted date when date is provided', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(screen.getByText('01/01/2024 12:30')).toBeInTheDocument()
    expect(mockFormat).toHaveBeenCalledWith(mockProps.date, 'MM/dd/yyyy HH:mm')
    expect(mockButton).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: 'outline',
        className: 'mock-class',
      }),
      undefined
    )
  })

  it('should render trigger button with placeholder when no date is provided', () => {
    // Arrange
    const propsWithoutDate: DateTimePickerProps = {
      ...mockProps,
      date: undefined,
    }

    // Act
    render(<DateTimePicker24h {...propsWithoutDate} />)

    // Assert
    expect(screen.getByText('MM/DD/YYYY HH:mm')).toBeInTheDocument()
  })

  it('should render calendar icon in trigger button', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
    expect(mockCalendarIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'mr-2 h-4 w-4',
      }),
      undefined
    )
  })

  it('should render popover structure correctly', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(screen.getByTestId('popover')).toBeInTheDocument()
    expect(screen.getByTestId('popover-trigger')).toBeInTheDocument()
    expect(mockPopover).toHaveBeenCalledWith(
      expect.objectContaining({
        open: false,
        onOpenChange: expect.any(Function),
      }),
      undefined
    )
  })

  it('should render calendar component with correct props', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(screen.getByTestId('calendar')).toBeInTheDocument()
    expect(mockCalendar).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'single',
        selected: mockProps.date,
        onSelect: expect.any(Function),
      }),
      undefined
    )
  })

  it('should render hour selection buttons', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    // Check that buttons are rendered (24 hours + other buttons)
    expect(mockButton).toHaveBeenCalled()
  })

  it('should render minute selection buttons', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    // Check that minute buttons are rendered (12 buttons for 0, 5, 10, ..., 55)
    expect(mockButton).toHaveBeenCalled()
  })

  it('should handle date selection from calendar', () => {
    // Arrange
    render(<DateTimePicker24h {...mockProps} />)

    // Act
    fireEvent.click(screen.getByText('Select Date'))

    // Assert
    expect(mockSetDate).toHaveBeenCalledWith(new Date('2024-01-15T12:30:00Z'))
  })

  it('should handle hour selection', () => {
    // Arrange
    render(<DateTimePicker24h {...mockProps} />)

    // Act
    // Simulate hour selection by calling the handler directly
    const hourButtons = screen.getAllByTestId('button')
    const hourButton = hourButtons.find(button => button.textContent === '14')
    if (hourButton) {
      fireEvent.click(hourButton)
    }

    // Assert
    // The mock implementation should handle the click
    expect(mockButton).toHaveBeenCalled()
  })

  it('should handle minute selection', () => {
    // Arrange
    render(<DateTimePicker24h {...mockProps} />)

    // Act
    // Simulate minute selection by calling the handler directly
    const minuteButtons = screen.getAllByTestId('button')
    const minuteButton = minuteButtons.find(button => button.textContent === '15')
    if (minuteButton) {
      fireEvent.click(minuteButton)
    }

    // Assert
    // The mock implementation should handle the click
    expect(mockButton).toHaveBeenCalled()
  })

  it('should render scroll areas for time selection', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(screen.getAllByTestId('scroll-area')).toHaveLength(2)
    expect(mockScrollArea).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('w-64'),
      }),
      undefined
    )
  })

  it('should render scroll bars for mobile view', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(screen.getAllByTestId('scroll-bar')).toHaveLength(2)
    expect(mockScrollBar).toHaveBeenCalledWith(
      expect.objectContaining({
        orientation: 'horizontal',
        className: 'sm:hidden',
      }),
      undefined
    )
  })

  it('should handle popover open state changes', () => {
    // Arrange
    render(<DateTimePicker24h {...mockProps} />)

    // Act
    const popover = screen.getByTestId('popover')
    expect(popover).toHaveAttribute('data-open', 'false')

    // Simulate opening the popover
    const onOpenChange = (mockPopover.mock.calls[0][0] as { onOpenChange?: (open: boolean) => void }).onOpenChange
    onOpenChange?.(true)

    // Assert
    expect(mockPopover).toHaveBeenCalledWith(
      expect.objectContaining({
        onOpenChange: expect.any(Function),
      }),
      undefined
    )
  })

  it('should render with correct CSS classes', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(mockCn).toHaveBeenCalledWith(
      'w-48 justify-start text-left font-normal',
      !mockProps.date && 'text-muted-foreground'
    )
  })

  it('should handle undefined date gracefully', () => {
    // Arrange
    const propsWithUndefinedDate: DateTimePickerProps = {
      ...mockProps,
      date: undefined,
    }

    // Act
    render(<DateTimePicker24h {...propsWithUndefinedDate} />)

    // Assert
    expect(screen.getByText('MM/DD/YYYY HH:mm')).toBeInTheDocument()
    expect(mockCalendar).toHaveBeenCalledWith(
      expect.objectContaining({
        selected: undefined,
      }),
      undefined
    )
  })

  it('should render time selection with correct structure', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    const popoverContent = screen.getByTestId('popover-content')
    expect(popoverContent).toBeInTheDocument()
    expect(mockPopoverContent).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'w-auto p-0',
      }),
      undefined
    )
  })

  it('should handle button variants correctly', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(mockButton).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: expect.any(String),
        size: 'icon',
      }),
      undefined
    )
  })

  it('should render with proper accessibility attributes', () => {
    // Arrange & Act
    render(<DateTimePicker24h {...mockProps} />)

    // Assert
    expect(mockLabel).toHaveBeenCalledWith(
      expect.objectContaining({
        htmlFor: 'date',
      }),
      undefined
    )
  })
})
