import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/components/layouts/admin.layout', () => ({
  AdminLayout: vi.fn(({ children }) => <div data-testid="admin-layout">{children}</div>),
}))

vi.mock('@/components/ui/table', () => ({
  Table: vi.fn(({ children }) => <table data-testid="table">{children}</table>),
  TableBody: vi.fn(({ children }) => <tbody data-testid="table-body">{children}</tbody>),
  TableCell: vi.fn(({ children, className }) => <td data-testid="table-cell" className={className}>{children}</td>),
  TableHeader: vi.fn(({ children }) => <thead data-testid="table-header">{children}</thead>),
  TableRow: vi.fn(({ children }) => <tr data-testid="table-row">{children}</tr>),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, onClick, variant, size, className, disabled }) => (
    <button data-testid="button" onClick={onClick} data-variant={variant} data-size={size} className={className} disabled={disabled}>
      {children}
    </button>
  )),
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(({ children, open }) => (
    <div data-testid="dialog" data-open={open ? 'true' : 'false'}>
      {open && children}
    </div>
  )),
  DialogContent: vi.fn(({ children, className }) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  )),
  DialogDescription: vi.fn(({ children }) => <div data-testid="dialog-description">{children}</div>),
  DialogFooter: vi.fn(({ children }) => <div data-testid="dialog-footer">{children}</div>),
  DialogHeader: vi.fn(({ children }) => <div data-testid="dialog-header">{children}</div>),
  DialogTitle: vi.fn(({ children }) => <div data-testid="dialog-title">{children}</div>),
}))

vi.mock('@/components/json-editor-with-drag-drop', () => ({
  JsonEditorWithDragDrop: vi.fn(({ value, onChange, isLoading, isError, readOnly }) => (
    <div data-testid="json-editor">
      <textarea
        data-testid="json-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-loading={isLoading}
        data-error={isError}
        data-readonly={readOnly}
        aria-label="JSON Editor"
        placeholder="Enter JSON content"
      />
    </div>
  )),
}))

vi.mock('@/components/ui/input', () => ({
  Input: vi.fn(({ id, value, onChange, placeholder, required, disabled }) => (
    <input data-custom={disabled} data-testid="input" id={id} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} />
  )),
}))

vi.mock('@/components/ui/label', () => ({
  Label: vi.fn(({ children, htmlFor }) => <label data-testid="label" htmlFor={htmlFor}>{children}</label>),
}))

vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: vi.fn(({ className }) => <div data-testid="skeleton" className={className}>Loading...</div>),
}))

vi.mock('@tabler/icons-react', () => ({
  IconEdit: vi.fn(() => <div data-testid="edit-icon">Edit</div>),
  IconPlus: vi.fn(() => <div data-testid="plus-icon">Plus</div>),
}))

vi.mock('@/hooks/useGameConfigSchema', () => ({
  useGameConfigSchemaList: vi.fn(),
  useGameConfigSchemaWithId: vi.fn(),
  useGameConfigSchemaUpsert: vi.fn(),
}))

vi.mock('@/hooks/usePermission', () => ({
  usePermission: vi.fn(),
}))



vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import * as useGameConfigSchemaModule from '@/hooks/useGameConfigSchema'
import * as usePermissionModule from '@/hooks/usePermission'
import { toast } from 'sonner'
import GameConfigSchemaPage from '../game-config-schema.page'

describe('Game Config Schema Page', () => {
  const mockUseGameConfigSchemaList = useGameConfigSchemaModule.useGameConfigSchemaList as ReturnType<typeof vi.fn>
  const mockUseGameConfigSchemaWithId = useGameConfigSchemaModule.useGameConfigSchemaWithId as ReturnType<typeof vi.fn>
  const mockUseGameConfigSchemaUpsert = useGameConfigSchemaModule.useGameConfigSchemaUpsert as ReturnType<typeof vi.fn>
  const mockToastSuccess = toast.success as ReturnType<typeof vi.fn>
  const mockToastError = toast.error as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock setup
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    mockUseGameConfigSchemaWithId.mockReturnValue({
      gameConfigSchemaGetQuery: {
        data: { data: null },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    mockUseGameConfigSchemaUpsert.mockReturnValue({
      gameConfigSchemaUpsertMutation: {
        mutate: vi.fn(),
      },
    })

    // Default permission setup - both permissions granted
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({ isAllowed: true })
  })

  it('should render the game config schema page with AdminLayout', () => {
    // Arrange & Act
    render(<GameConfigSchemaPage />)

    // Assert
    expect(screen.getByTestId('admin-layout')).toBeInTheDocument()
  })

  it('should render the table with headers', () => {
    // Arrange & Act
    render(<GameConfigSchemaPage />)

    // Assert
    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByTestId('table-header')).toBeInTheDocument()
    expect(screen.getByText('Schema Id')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument() // Table header only
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('should render schema data in table rows', () => {
    // Arrange
    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
      { id: 'schema2', name: 'Test Schema 2' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)

    // Assert
    expect(screen.getByText('schema1')).toBeInTheDocument()
    expect(screen.getByText('schema2')).toBeInTheDocument()
    expect(screen.getByText('Test Schema 1')).toBeInTheDocument()
    expect(screen.getByText('Test Schema 2')).toBeInTheDocument()
  })

  it('should render new schema row when upsert permission is granted', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    // Act
    render(<GameConfigSchemaPage />)

    // Assert
    expect(screen.getAllByText('New')).toHaveLength(2) // Schema Id and Name columns
  })

  it('should not render new schema row when upsert permission is denied', () => {
    // Arrange
    vi.clearAllMocks()
    
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    mockUseGameConfigSchemaWithId.mockReturnValue({
      gameConfigSchemaGetQuery: {
        data: { data: null },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    mockUseGameConfigSchemaUpsert.mockReturnValue({
      gameConfigSchemaUpsertMutation: {
        mutate: vi.fn(),
      },
    })

    // Mock usePermission to return false for upsert permission
    vi.spyOn(usePermissionModule, 'usePermission').mockReturnValue({ isAllowed: false })

    // Act
    render(<GameConfigSchemaPage />)

    // Assert
    expect(screen.queryAllByText('New')).toHaveLength(0)
  })

  it('should render edit buttons for existing schemas', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)

    // Assert
    const editButtons = screen.getAllByTestId('button')
    expect(editButtons).toHaveLength(2) // One for edit, one for new
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument()
  })

  it('should render plus button for new schema when both permissions are granted', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    // Act
    render(<GameConfigSchemaPage />)

    // Assert
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
  })

  it('should not render plus button when get permission is denied', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: false }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    // Act
    render(<GameConfigSchemaPage />)

    // Assert
    expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument()
  })

  it('should not render plus button when upsert permission is denied', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: false }) // upsertPermission

    // Act
    render(<GameConfigSchemaPage />)

    // Assert
    expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument()
  })

  it('should open edit dialog when edit button is clicked', () => {
    // Arrange
    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0]) // Click edit button

    // Assert
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByText('Game Config Schema Editor')).toBeInTheDocument()
  })

  it('should open new schema dialog when plus button is clicked', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    // Act
    render(<GameConfigSchemaPage />)
    const buttons = screen.getAllByTestId('button')
    fireEvent.click(buttons[0]) // Click plus button (only button in empty state)

    // Assert
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByText('Game Config Schema Editor')).toBeInTheDocument()
  })

  it('should render dialog with correct content', () => {
    // Arrange
    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0])

    // Assert
    expect(screen.getByTestId('dialog-content')).toHaveClass('!max-w-[1280px]', 'w-[95vw]')
    expect(screen.getByText('Game Config Schema Editor')).toBeInTheDocument()
    expect(screen.getByText('Game Config Schema for schema id schema1')).toBeInTheDocument()
    expect(screen.getByText('Paste json below or drag and drop file')).toBeInTheDocument()
  })

  it('should render name input field in dialog', () => {
    // Arrange
    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0])

    // Assert
    expect(screen.getByTestId('input')).toBeInTheDocument()
    expect(screen.getByTestId('label')).toBeInTheDocument()
  })

  it('should render JSON editor in dialog', () => {
    // Arrange
    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0])

    // Assert
    expect(screen.getByTestId('json-editor')).toBeInTheDocument()
    expect(screen.getByTestId('json-input')).toBeInTheDocument()
  })

  it('should render skeleton when loading schema data', () => {
    // Arrange
    mockUseGameConfigSchemaWithId.mockReturnValue({
      gameConfigSchemaGetQuery: {
        data: { data: null },
        isLoading: true,
        isError: false,
        refetch: vi.fn(),
      },
    })

    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0])

    // Assert
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('should render error state when schema query fails', () => {
    // Arrange
    mockUseGameConfigSchemaWithId.mockReturnValue({
      gameConfigSchemaGetQuery: {
        data: { data: null },
        isLoading: false,
        isError: true,
        refetch: vi.fn(),
      },
    })

    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0])

    // Assert
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('should populate form with existing schema data', () => {
    // Arrange
    const mockSchemaData = {
      id: 'schema1',
      name: 'Test Schema',
      schema: { type: 'object', properties: { test: { type: 'string' } } },
    }
    mockUseGameConfigSchemaWithId.mockReturnValue({
      gameConfigSchemaGetQuery: {
        data: { data: mockSchemaData },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0])

    // Assert
    const nameInput = screen.getByTestId('input')
    const jsonInput = screen.getByTestId('json-input')
    expect(nameInput).toHaveValue('Test Schema')
    expect(jsonInput).toHaveValue(JSON.stringify(mockSchemaData.schema, null, 2))
  })

  it('should handle form submission with valid data', async () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    const mockUpsertMutation = vi.fn()
    const mockRefetch = vi.fn()
    
    mockUseGameConfigSchemaUpsert.mockReturnValue({
      gameConfigSchemaUpsertMutation: {
        mutate: mockUpsertMutation,
      },
    })

    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: mockRefetch,
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const buttons = screen.getAllByTestId('button')
    fireEvent.click(buttons[0]) // Open new schema dialog

    const nameInput = screen.getByTestId('input')
    const jsonInput = screen.getByTestId('json-input')
    
    fireEvent.change(nameInput, { target: { value: 'New Schema' } })
    fireEvent.change(jsonInput, { target: { value: '{"type": "object"}' } })

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Assert
    expect(mockUpsertMutation).toHaveBeenCalledWith(
      {
        query: { id: undefined },
        request: {
          name: 'New Schema',
          schema: { type: 'object' },
        },
      },
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }
    )

    // Simulate success callback
    const onSuccessCallback = mockUpsertMutation.mock.calls[0][1].onSuccess
    onSuccessCallback()

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Schema updated successfully')
      expect(mockRefetch).toHaveBeenCalled()
    })
  })

  it('should show error when name is empty', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const buttons = screen.getAllByTestId('button')
    fireEvent.click(buttons[0]) // Open new schema dialog

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Assert
    expect(mockToastError).toHaveBeenCalledWith('Name is required')
  })

  it('should show error when JSON is invalid', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const buttons = screen.getAllByTestId('button')
    fireEvent.click(buttons[0]) // Open new schema dialog

    const nameInput = screen.getByTestId('input')
    const jsonInput = screen.getByTestId('json-input')
    
    fireEvent.change(nameInput, { target: { value: 'New Schema' } })
    fireEvent.change(jsonInput, { target: { value: 'invalid json' } })

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Assert
    expect(mockToastError).toHaveBeenCalledWith('Invalid JSON format')
  })

  it('should handle submission error', async () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    const mockUpsertMutation = vi.fn()
    
    mockUseGameConfigSchemaUpsert.mockReturnValue({
      gameConfigSchemaUpsertMutation: {
        mutate: mockUpsertMutation,
      },
    })

    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: [] },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const buttons = screen.getAllByTestId('button')
    fireEvent.click(buttons[0]) // Open new schema dialog

    const nameInput = screen.getByTestId('input')
    const jsonInput = screen.getByTestId('json-input')
    
    fireEvent.change(nameInput, { target: { value: 'New Schema' } })
    fireEvent.change(jsonInput, { target: { value: '{"type": "object"}' } })

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    // Simulate error callback
    const onErrorCallback = mockUpsertMutation.mock.calls[0][1].onError
    onErrorCallback()

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Failed to update schema')
    })
  })

  it('should apply correct styling to table container', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    // Act
    render(<GameConfigSchemaPage />)

    // Assert
    const tableContainer = screen.getByTestId('table').parentElement
    expect(tableContainer).toHaveClass('overflow-hidden', 'rounded-lg', 'border', 'm-2')
  })

  it('should render dialog in read-only mode when upsert permission is denied', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) 
      .mockReturnValueOnce({ isAllowed: false })
      .mockReturnValueOnce({ isAllowed: true })
      .mockReturnValueOnce({ isAllowed: false })

    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0])

    // Assert
    const nameInput = screen.getByTestId('input')
    const jsonInput = screen.getByTestId('json-input')
    const submitButton = screen.getByText('Submit')
    
    expect(nameInput).toBeDisabled()
    expect(jsonInput).toHaveAttribute('data-readonly', 'true')
    expect(submitButton).toBeDisabled()
  })

  it('should render dialog in editable mode when upsert permission is granted', () => {
    // Arrange
    vi.spyOn(usePermissionModule, 'usePermission')
      .mockReturnValueOnce({ isAllowed: true }) // getPermission
      .mockReturnValueOnce({ isAllowed: true }) // upsertPermission

    const mockSchemas = [
      { id: 'schema1', name: 'Test Schema 1' },
    ]
    mockUseGameConfigSchemaList.mockReturnValue({
      gameConfigSchemaListQuery: {
        data: { data: mockSchemas },
        isLoading: false,
        isError: false,
        refetch: vi.fn(),
      },
    })

    // Act
    render(<GameConfigSchemaPage />)
    const editButtons = screen.getAllByTestId('button')
    fireEvent.click(editButtons[0])

    // Assert
    const nameInput = screen.getByTestId('input')
    const jsonInput = screen.getByTestId('json-input')
    const submitButton = screen.getByText('Submit')
    
    expect(nameInput).toBeEnabled()
    expect(jsonInput).toHaveAttribute('data-readonly', 'false')
    expect(submitButton).not.toBeDisabled()
  })
})
