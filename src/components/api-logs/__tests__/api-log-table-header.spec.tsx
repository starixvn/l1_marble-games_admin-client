import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ApiLogTableHeader } from '../api-log-table-header'

describe('ApiLogTableHeader', () => {
  it('should render all table header columns', () => {
    // Arrange & Act
    render(<ApiLogTableHeader />)

    // Assert
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Operator')).toBeInTheDocument()
    expect(screen.getByText('Endpoint')).toBeInTheDocument()
    expect(screen.getByText('Request')).toBeInTheDocument()
    expect(screen.getByText('Response')).toBeInTheDocument()
  })

  it('should render table header with correct structure', () => {
    // Arrange & Act
    render(<ApiLogTableHeader />)

    // Assert
    const headerElement = screen.getByRole('row')
    expect(headerElement).toBeInTheDocument()
    
    const headerCells = screen.getAllByRole('columnheader')
    expect(headerCells).toHaveLength(5)
  })

  it('should have correct column order', () => {
    // Arrange & Act
    render(<ApiLogTableHeader />)

    // Assert
    const headerCells = screen.getAllByRole('columnheader')
    expect(headerCells[0]).toHaveTextContent('Time')
    expect(headerCells[1]).toHaveTextContent('Operator')
    expect(headerCells[2]).toHaveTextContent('Endpoint')
    expect(headerCells[3]).toHaveTextContent('Request')
    expect(headerCells[4]).toHaveTextContent('Response')
  })
})
