import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('@/components/ui/dialog', () => ({
  Dialog: vi.fn(({ children, open }) => (
    <div data-testid="dialog" data-open={open}>
      {open && children}
    </div>
  )),
  DialogContent: vi.fn(({ children, className }) => (
    <div data-testid="dialog-content" className={className}>{children}</div>
  )),
  DialogDescription: vi.fn(({ children }) => (
    <p data-testid="dialog-description">{children}</p>
  )),
  DialogHeader: vi.fn(({ children }) => (
    <div data-testid="dialog-header">{children}</div>
  )),
  DialogTitle: vi.fn(({ children }) => (
    <h2 data-testid="dialog-title">{children}</h2>
  )),
}))

vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ children, variant, onClick }) => (
    <button data-testid="button" data-variant={variant} onClick={onClick}>
      {children}
    </button>
  )),
}))

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useContext: vi.fn(() => ({ theme: 'light' })),
  }
})

vi.mock('@monaco-editor/react', () => ({
  DiffEditor: vi.fn(({ height, width, original, modified, language, theme, options }) => (
    <div 
      data-testid="diff-editor" 
      data-height={height} 
      data-width={width} 
      data-original={original} 
      data-modified={modified} 
      data-language={language} 
      data-theme={theme}
      data-options={JSON.stringify(options)}
    >
      Diff Editor
    </div>
  )),
}))

import { AdminLogDiffViewer } from '../admin-log-diff-viewer'
import type { AdminLogResponseItem } from '@/api/admin-log.api'

describe('AdminLogDiffViewer', () => {
  const mockOnOpenChange = vi.fn()
  const mockDiff: AdminLogResponseItem['diff'] = {
    old: { name: 'old value', config: 'old config' },
    new: { name: 'new value', config: 'new config' }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the admin log diff viewer when open', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-header')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-description')).toBeInTheDocument()
  })

  it('should not render content when closed', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={false} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false')
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
  })

  it('should render dialog title correctly', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Diff')
  })

  it('should render dialog description correctly', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('Compare the old and new values of the resource')
  })

  it('should apply correct CSS classes to dialog content', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    expect(screen.getByTestId('dialog-content')).toHaveClass('max-w-none', 'w-auto', 'min-w-[80vw]', 'max-h-[90vh]', 'flex', 'flex-col')
  })

  it('should render diff editor with correct props', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    const diffEditor = screen.getByTestId('diff-editor')
    expect(diffEditor).toHaveAttribute('data-height', '50vh')
    expect(diffEditor).toHaveAttribute('data-width', '100%')
    expect(diffEditor).toHaveAttribute('data-language', 'json')
    expect(diffEditor).toHaveAttribute('data-theme', 'light')
  })

  it('should pass formatted JSON to diff editor', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    const diffEditor = screen.getByTestId('diff-editor')
    const expectedOldValue = JSON.stringify(mockDiff.old, null, 2)
    const expectedNewValue = JSON.stringify(mockDiff.new, null, 2)
    expect(diffEditor).toHaveAttribute('data-original', expectedOldValue)
    expect(diffEditor).toHaveAttribute('data-modified', expectedNewValue)
  })

  it('should pass correct options to diff editor', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    const diffEditor = screen.getByTestId('diff-editor')
    const options = JSON.parse(diffEditor.getAttribute('data-options') ?? '{}')
    expect(options.originalEditable).toBe(false)
    expect(options.readOnly).toBe(true)
    expect(options.renderSideBySide).toBe(true)
    expect(options.scrollBeyondLastLine).toBe(false)
    expect(options.hideUnchangedRegions.enabled).toBe(true)
  })

  it('should render close button with correct attributes', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    const closeButton = screen.getByTestId('button')
    expect(closeButton).toHaveTextContent('Close')
    expect(closeButton).toHaveAttribute('data-variant', 'outline')
  })

  it('should call onOpenChange with false when close button is clicked', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)
    
    const closeButton = screen.getByTestId('button')
    fireEvent.click(closeButton)

    // Assert
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('should handle diff with only old value', () => {
    // Arrange
    const diffWithOnlyOld: AdminLogResponseItem['diff'] = {
      old: { name: 'old value' }
    }

    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={diffWithOnlyOld} />)

    // Assert
    const diffEditor = screen.getByTestId('diff-editor')
    expect(diffEditor).toHaveAttribute('data-original', JSON.stringify(diffWithOnlyOld.old, null, 2))
    expect(diffEditor).toHaveAttribute('data-modified', '')
  })

  it('should handle diff with only new value', () => {
    // Arrange
    const diffWithOnlyNew: AdminLogResponseItem['diff'] = {
      new: { name: 'new value' }
    }

    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={diffWithOnlyNew} />)

    // Assert
    const diffEditor = screen.getByTestId('diff-editor')
    expect(diffEditor).toHaveAttribute('data-original', '')
    expect(diffEditor).toHaveAttribute('data-modified', JSON.stringify(diffWithOnlyNew.new, null, 2))
  })

  it('should handle undefined diff', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={undefined} />)

    // Assert
    const diffEditor = screen.getByTestId('diff-editor')
    expect(diffEditor).toHaveAttribute('data-original', '')
    expect(diffEditor).toHaveAttribute('data-modified', '')
  })

  // Note: Theme context testing is covered by the default light theme test
  // The component uses useContext(ThemeContext) which is mocked to return light theme

  it('should apply correct CSS classes to diff editor container', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    const diffEditorContainer = screen.getByTestId('diff-editor').closest('.flex-1.overflow-auto.no-scrollbar.mt-4')
    expect(diffEditorContainer).toHaveClass('flex-1', 'overflow-auto', 'no-scrollbar', 'mt-4')
  })

  it('should apply correct CSS classes to button container', () => {
    // Arrange
    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={mockDiff} />)

    // Assert
    const buttonContainer = screen.getByTestId('button').closest('.flex.justify-end')
    expect(buttonContainer).toHaveClass('flex', 'justify-end')
  })

  it('should handle complex diff data', () => {
    // Arrange
    const complexDiff: AdminLogResponseItem['diff'] = {
      old: {
        id: 1,
        name: 'Old Name',
        config: { setting1: 'old', setting2: 'old' },
        array: [1, 2, 3]
      },
      new: {
        id: 1,
        name: 'New Name',
        config: { setting1: 'new', setting2: 'old' },
        array: [1, 2, 3, 4]
      }
    }

    // Act
    render(<AdminLogDiffViewer isOpen={true} onOpenChange={mockOnOpenChange} diff={complexDiff} />)

    // Assert
    const diffEditor = screen.getByTestId('diff-editor')
    expect(diffEditor).toHaveAttribute('data-original', JSON.stringify(complexDiff.old, null, 2))
    expect(diffEditor).toHaveAttribute('data-modified', JSON.stringify(complexDiff.new, null, 2))
  })
})
