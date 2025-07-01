import { render, screen } from '@testing-library/react'

vi.mock('@/components/operator-table-item', () => ({
  OperatorTableItem: vi.fn(({ operator }) => (
    <div data-testid="operator-table-item" data-operator-id={operator.id}>
      {operator.name}
    </div>
  )),
}))

vi.mock('@/components/ui/table', () => ({
  Table: vi.fn(({ children }) => <table data-testid="table">{children}</table>),
  TableHeader: vi.fn(({ children }) => <thead data-testid="table-header">{children}</thead>),
  TableRow: vi.fn(({ children }) => <tr data-testid="table-row">{children}</tr>),
  TableHead: vi.fn(({ children, className }) => (
    <th data-testid="table-head" className={className}>
      {children}
    </th>
  )),
  TableBody: vi.fn(({ children }) => <tbody data-testid="table-body">{children}</tbody>),
}))

import { OperatorTable } from '../operator-table'

describe('OperatorTable', () => {
  const mockData = [
    { id: 'operator-1', name: 'Operator One' },
    { id: 'operator-2', name: 'Operator Two' },
    { id: 'operator-3', name: 'Operator Three' },
  ]

  it('should render the operator table with correct structure', () => {
    // Arrange
    // Act
    render(<OperatorTable data={mockData} />)

    // Assert
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-body')).toBeInTheDocument()
  })

  it('should render table headers correctly', () => {
    // Arrange
    // Act
    render(<OperatorTable data={mockData} />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    expect(headers).toHaveLength(2)
    expect(headers[0]).toHaveTextContent('Operator Id')
    expect(headers[1]).toHaveTextContent('Name')
  })

  it('should apply correct CSS classes to operator ID header', () => {
    // Arrange
    // Act
    render(<OperatorTable data={mockData} />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    expect(headers[0]).toHaveClass('w-[300px]', 'px-6')
  })

  it('should apply correct CSS classes to name header', () => {
    // Arrange
    // Act
    render(<OperatorTable data={mockData} />)

    // Assert
    const headers = screen.getAllByTestId('table-head')
    expect(headers[1]).toHaveClass('px-6')
  })

  it('should render operator table items for each operator', () => {
    // Arrange
    // Act
    render(<OperatorTable data={mockData} />)

    // Assert
    const operatorItems = screen.getAllByTestId('operator-table-item')
    expect(operatorItems).toHaveLength(3)
    expect(operatorItems[0]).toHaveAttribute('data-operator-id', 'operator-1')
    expect(operatorItems[1]).toHaveAttribute('data-operator-id', 'operator-2')
    expect(operatorItems[2]).toHaveAttribute('data-operator-id', 'operator-3')
  })

  it('should render operator names in table items', () => {
    // Arrange
    // Act
    render(<OperatorTable data={mockData} />)

    // Assert
    expect(screen.getByText('Operator One')).toBeInTheDocument()
    expect(screen.getByText('Operator Two')).toBeInTheDocument()
    expect(screen.getByText('Operator Three')).toBeInTheDocument()
  })

  it('should apply correct CSS classes to container', () => {
    // Arrange
    // Act
    render(<OperatorTable data={mockData} />)

    // Assert
    const container = screen.getByTestId('table').closest('.overflow-hidden')?.parentElement?.parentElement
    expect(container).toHaveClass('@container/main', 'flex', 'flex-1', 'flex-col', 'gap-2')
  })

  it('should apply correct CSS classes to table wrapper', () => {
    // Arrange
    // Act
    render(<OperatorTable data={mockData} />)

    // Assert
    const tableWrapper = screen.getByTestId('table').closest('.overflow-hidden')
    expect(tableWrapper).toHaveClass('overflow-hidden', 'rounded-lg', 'border', 'm-2')
  })

  it('should handle empty data array', () => {
    // Arrange
    // Act
    render(<OperatorTable data={[]} />)

    // Assert
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByTestId('table-body')).toBeInTheDocument()
    expect(screen.queryAllByTestId('operator-table-item')).toHaveLength(0)
  })
}) 