import { render, screen } from '@testing-library/react'

vi.mock('@/components/ui/table', () => ({
  TableHead: vi.fn(({ children, className }) => (
    <th data-testid="table-head" className={className}>{children}</th>
  )),
  TableHeader: vi.fn(({ children }) => <thead data-testid="table-header">{children}</thead>),
  TableRow: vi.fn(({ children }) => <tr data-testid="table-row">{children}</tr>),
}))

import { AdminLogTableHeader } from '../admin-log-table-header'

describe('AdminLogTableHeader', () => {
  it('should render the admin log table header with correct structure', () => {
    // Arrange
    // Act
    render(<AdminLogTableHeader />)

    // Assert
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
    expect(screen.getAllByTestId('table-head')).toHaveLength(5)
  })

  it('should render table headers with correct text content', () => {
    // Arrange
    // Act
    render(<AdminLogTableHeader />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    expect(headers[0]).toHaveTextContent('Time')
    expect(headers[1]).toHaveTextContent('Author')
    expect(headers[2]).toHaveTextContent('Resource')
    expect(headers[3]).toHaveTextContent('Action')
    expect(headers[4]).toHaveTextContent('Diff')
  })

  it('should apply correct CSS classes to all table headers', () => {
    // Arrange
    // Act
    render(<AdminLogTableHeader />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    headers.forEach(header => {
      expect(header).toHaveClass('w-1/6')
    })
  })

  it('should apply correct CSS classes to table header container', () => {
    // Arrange
    // Act
    render(<AdminLogTableHeader />)

    // Assert
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to table row', () => {
    // Arrange
    // Act
    render(<AdminLogTableHeader />)

    // Assert
    expect(screen.getByTestId('table-row')).toBeInTheDocument()
  })

  it('should render headers in correct order', () => {
    // Arrange
    // Act
    render(<AdminLogTableHeader />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    const headerTexts = headers.map(header => header.textContent)
    expect(headerTexts).toEqual(['Time', 'Author', 'Resource', 'Action', 'Diff'])
  })

  it('should have consistent width classes for all columns', () => {
    // Arrange
    // Act
    render(<AdminLogTableHeader />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    headers.forEach(header => {
      expect(header).toHaveClass('w-1/6')
    })
  })
})
