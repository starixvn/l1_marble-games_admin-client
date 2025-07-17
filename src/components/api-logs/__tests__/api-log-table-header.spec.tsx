import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ApiLogTableHeader } from '../api-log-table-header'

describe('ApiLogTableHeader', () => {
  const defaultApiQuery = {
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-01T23:59:59Z',
  }

  it('should render all table header columns for non-event endpoints', () => {
    // Arrange & Act
    render(<ApiLogTableHeader apiQuery={defaultApiQuery} />)

    // Assert
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Operator')).toBeInTheDocument()
    expect(screen.getByText('Endpoint')).toBeInTheDocument()
    expect(screen.getByText('Request')).toBeInTheDocument()
    expect(screen.getByText('Response')).toBeInTheDocument()
    
    // Event ID and Game ID should not be present for non-event endpoints
    expect(screen.queryByText('Event ID')).not.toBeInTheDocument()
    expect(screen.queryByText('Game ID')).not.toBeInTheDocument()
  })

  it('should render table header with correct structure for non-event endpoints', () => {
    // Arrange & Act
    render(<ApiLogTableHeader apiQuery={defaultApiQuery} />)

    // Assert
    const headerElement = screen.getByRole('row')
    expect(headerElement).toBeInTheDocument()
    
    const headerCells = screen.getAllByRole('columnheader')
    expect(headerCells).toHaveLength(5)
  })

  it('should have correct column order for non-event endpoints', () => {
    // Arrange & Act
    render(<ApiLogTableHeader apiQuery={defaultApiQuery} />)

    // Assert
    const headerCells = screen.getAllByRole('columnheader')
    expect(headerCells[0]).toHaveTextContent('Time')
    expect(headerCells[1]).toHaveTextContent('Operator')
    expect(headerCells[2]).toHaveTextContent('Endpoint')
    expect(headerCells[3]).toHaveTextContent('Request')
    expect(headerCells[4]).toHaveTextContent('Response')
  })

  it('should render Event ID and Game ID columns when endpoint is /api/events', () => {
    // Arrange & Act
    render(<ApiLogTableHeader apiQuery={{ ...defaultApiQuery, endpoint: '/api/events' }} />)

    // Assert
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Operator')).toBeInTheDocument()
    expect(screen.getByText('Endpoint')).toBeInTheDocument()
    expect(screen.getByText('Event ID')).toBeInTheDocument()
    expect(screen.getByText('Game ID')).toBeInTheDocument()
    expect(screen.getByText('Request')).toBeInTheDocument()
    expect(screen.getByText('Response')).toBeInTheDocument()
  })

  it('should have correct column order when endpoint is /api/events', () => {
    // Arrange & Act
    render(<ApiLogTableHeader apiQuery={{ ...defaultApiQuery, endpoint: '/api/events' }} />)

    // Assert
    const headerCells = screen.getAllByRole('columnheader')
    expect(headerCells).toHaveLength(7)
    expect(headerCells[0]).toHaveTextContent('Time')
    expect(headerCells[1]).toHaveTextContent('Operator')
    expect(headerCells[2]).toHaveTextContent('Endpoint')
    expect(headerCells[3]).toHaveTextContent('Event ID')
    expect(headerCells[4]).toHaveTextContent('Game ID')
    expect(headerCells[5]).toHaveTextContent('Request')
    expect(headerCells[6]).toHaveTextContent('Response')
  })

  it('should not render Event ID and Game ID columns for other endpoints', () => {
    // Arrange & Act
    render(<ApiLogTableHeader apiQuery={{ ...defaultApiQuery, endpoint: '/api/users' }} />)

    // Assert
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Operator')).toBeInTheDocument()
    expect(screen.getByText('Endpoint')).toBeInTheDocument()
    expect(screen.getByText('Request')).toBeInTheDocument()
    expect(screen.getByText('Response')).toBeInTheDocument()
    
    // Event ID and Game ID should not be present
    expect(screen.queryByText('Event ID')).not.toBeInTheDocument()
    expect(screen.queryByText('Game ID')).not.toBeInTheDocument()
  })

  it('should handle apiQuery with undefined endpoint', () => {
    // Arrange & Act
    render(<ApiLogTableHeader apiQuery={{ ...defaultApiQuery, endpoint: undefined }} />)

    // Assert
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Operator')).toBeInTheDocument()
    expect(screen.getByText('Endpoint')).toBeInTheDocument()
    expect(screen.getByText('Request')).toBeInTheDocument()
    expect(screen.getByText('Response')).toBeInTheDocument()
    
    // Event ID and Game ID should not be present
    expect(screen.queryByText('Event ID')).not.toBeInTheDocument()
    expect(screen.queryByText('Game ID')).not.toBeInTheDocument()
  })
})
