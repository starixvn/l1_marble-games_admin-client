import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('@/components/combobox', () => ({
  Combobox: vi.fn(({ list, currentValue, setCurrentValue, keyProp, valueProp, placeholder, nothingFoundMessage, className, valueFormatter, disabled }) => (
    <div data-testid="combobox" data-current-value={String(currentValue)} data-key-prop={keyProp} data-value-prop={valueProp} className={className} data-disabled={String(disabled)}>
      <div data-testid="combobox-props">
        {JSON.stringify({ list, placeholder, nothingFoundMessage })}
      </div>
      <button data-testid="mock-set-value" onClick={() => setCurrentValue('schema-123')}>
        Set Value
      </button>
      <div data-testid="formatted-value">
        {valueFormatter ? valueFormatter(list.find((item: Record<string, unknown>) => item.id === currentValue)) : 'No formatter'}
      </div>
    </div>
  )),
}))

import { GameConfigSchemaCombobox } from '../game-config-schema-combobox'

describe('GameConfigSchemaCombobox', () => {
  const mockData = [
    { id: 'schema-1', name: 'Schema One' },
    { id: 'schema-2', name: 'Schema Two' },
    { id: 'schema-3', name: 'Schema Three' },
  ]

  const mockSetCurrentSchemaId = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the combobox with correct structure', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    expect(screen.getByTestId('combobox')).toBeInTheDocument()
  })

  it('should pass correct props to Combobox component', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).toHaveAttribute('data-current-value', 'schema-1')
    expect(combobox).toHaveAttribute('data-key-prop', 'id')
    expect(combobox).toHaveAttribute('data-value-prop', 'name')
    expect(combobox).toHaveClass('w-[300px]')
  })

  it('should transform data correctly for combobox', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const props = JSON.parse(propsElement.textContent ?? '{}')
    expect(props.list).toEqual([
      { id: 'schema-1', name: 'Schema One' },
      { id: 'schema-2', name: 'Schema Two' },
      { id: 'schema-3', name: 'Schema Three' },
    ])
  })

  it('should pass correct placeholder text', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const props = JSON.parse(propsElement.textContent ?? '{}')
    expect(props.placeholder).toBe('Select game config schema...')
  })

  it('should pass correct nothing found message', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const props = JSON.parse(propsElement.textContent ?? '{}')
    expect(props.nothingFoundMessage).toBe('No game config schema found.')
  })

  it('should handle undefined data gracefully', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={undefined}
      />
    )

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const props = JSON.parse(propsElement.textContent ?? '{}')
    expect(props.list).toEqual([])
  })

  it('should handle empty data array', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={[]}
      />
    )

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const props = JSON.parse(propsElement.textContent ?? '{}')
    expect(props.list).toEqual([])
  })

  it('should handle undefined currentSchemaId', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId={undefined}
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).toHaveAttribute('data-current-value', 'undefined')
  })

  it('should handle null currentSchemaId', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId={null as unknown as string | undefined}
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).toHaveAttribute('data-current-value', 'null')
  })

  it('should handle undefined setCurrentSchemaId', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={undefined}
        data={mockData}
      />
    )

    // Assert
    expect(screen.getByTestId('combobox')).toBeInTheDocument()
  })

  it('should format value correctly when item exists', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const formattedValue = screen.getByTestId('formatted-value')
    expect(formattedValue).toHaveTextContent('Schema One')
  })

  it('should format value correctly when item does not exist', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="non-existent"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const formattedValue = screen.getByTestId('formatted-value')
    expect(formattedValue).toHaveTextContent('Not found, please select another schema')
  })

  it('should handle setCurrentValue callback', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )
    
    const setValueButton = screen.getByTestId('mock-set-value')
    fireEvent.click(setValueButton)

    // Assert
    expect(mockSetCurrentSchemaId).toHaveBeenCalledWith('schema-123')
  })

  it('should handle setCurrentValue callback when setCurrentSchemaId is undefined', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={undefined}
        data={mockData}
      />
    )
    
    const setValueButton = screen.getByTestId('mock-set-value')
    fireEvent.click(setValueButton)

    // Assert
    // Should not throw error when setCurrentSchemaId is undefined
    expect(screen.getByTestId('combobox')).toBeInTheDocument()
  })

  it('should apply correct CSS classes', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
      />
    )

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).toHaveClass('w-[300px]')
  })

  it('should handle complex schema names', () => {
    // Arrange
    const complexData = [
      { id: 'schema-1', name: 'Complex Schema Name with Spaces' },
      { id: 'schema-2', name: 'Schema-With-Dashes' },
      { id: 'schema-3', name: 'Schema_With_Underscores' },
    ]

    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={complexData}
      />
    )

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const props = JSON.parse(propsElement.textContent ?? '{}')
    expect(props.list).toEqual(complexData)
  })

  it('should handle special characters in schema names', () => {
    // Arrange
    const specialData = [
      { id: 'schema-1', name: 'Schema with "quotes"' },
      { id: 'schema-2', name: 'Schema with & symbols' },
      { id: 'schema-3', name: 'Schema with <tags>' },
    ]

    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={specialData}
      />
    )

    // Assert
    const propsElement = screen.getByTestId('combobox-props')
    const props = JSON.parse(propsElement.textContent ?? '{}')
    expect(props.list).toEqual(specialData)
  })

  it('should pass disabled prop to Combobox component', () => {
    // Arrange
    // Act
    render(
      <GameConfigSchemaCombobox
        currentSchemaId="schema-1"
        setCurrentSchemaId={mockSetCurrentSchemaId}
        data={mockData}
        disabled={true}
      />
    )

    // Assert
    const combobox = screen.getByTestId('combobox')
    expect(combobox).toHaveAttribute('data-disabled', 'true')
  })
}) 