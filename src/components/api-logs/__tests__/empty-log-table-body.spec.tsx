import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { EmptyApiLogTableBody } from '../empty-log-table-body'

describe('EmptyApiLogTableBody', () => {
  it('should render empty state message', () => {
    // Arrange & Act
    render(<EmptyApiLogTableBody />)

    // Assert
    expect(screen.getByText('No logs found')).toBeInTheDocument()
  })

  it('should render with correct table structure', () => {
    // Arrange & Act
    render(<EmptyApiLogTableBody />)

    // Assert
    const rowElement = screen.getByRole('row')
    expect(rowElement).toBeInTheDocument()
    
    const cellElement = screen.getByRole('cell')
    expect(cellElement).toBeInTheDocument()
  })

  it('should have correct styling classes', () => {
    // Arrange & Act
    render(<EmptyApiLogTableBody />)

    // Assert
    const cellElement = screen.getByRole('cell')
    expect(cellElement).toHaveClass('text-center', 'text-muted-foreground')
  })

  it('should span all columns', () => {
    // Arrange & Act
    render(<EmptyApiLogTableBody />)

    // Assert
    const cellElement = screen.getByRole('cell')
    expect(cellElement).toHaveAttribute('colspan', '5')
  })

  it('should be accessible', () => {
    // Arrange & Act
    render(<EmptyApiLogTableBody />)

    // Assert
    const message = screen.getByText('No logs found')
    expect(message).toBeInTheDocument()
    expect(message).toHaveClass('text-muted-foreground')
  })
})
