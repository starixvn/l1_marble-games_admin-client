import Editor from '@monaco-editor/react'
import { useContext, useState } from 'react'
import { cn } from '@/lib/utils'
import { ThemeContext } from '@/contexts/theme.context'

interface JsonEditorWithDragDropProps {
  value: string
  onChange?: (value: string) => void
  height?: string
  isLoading?: boolean
  isError?: boolean
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
  className?: string
  readOnly?: boolean
}

export const JsonEditorWithDragDrop = ({
  value,
  onChange,
  height = '50vh',
  isLoading = false,
  isError = false,
  loadingComponent = <div>Loading...</div>,
  errorComponent = <div>Error</div>,
  className = '',
  readOnly = false,
}: JsonEditorWithDragDropProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const { theme } = useContext(ThemeContext)

  const handleFileRead = (file: File) => {
    if (readOnly) {
      return
    }

    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        onChange?.(text)
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (readOnly) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (readOnly) {
      return
    }
    e.preventDefault()
    e.stopPropagation()

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileRead(files[0])
    }
  }

  if (isLoading) {
    return <>{loadingComponent}</>
  }

  if (isError) {
    return <>{errorComponent}</>
  }

  const handleChange = (value: string | undefined) => {
    if (!readOnly) {
      onChange?.(value ?? '')
    }
  }

  return (
    <section
      className={cn(
        'w-full min-w-0 relative border-2 border-dashed transition-colors',
        isDragging ? 'border-blue-400 bg-blue-50/10' : 'border-transparent',
        className,
      )}
      aria-label="JSON file drop zone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && !readOnly && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-50/20 backdrop-blur-sm">
          <div className="text-blue-600 font-medium">Drop JSON file here</div>
        </div>
      )}
      <Editor
        height={height}
        width="100%"
        defaultLanguage="json"
        value={value}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        onChange={handleChange}
        options={{
          automaticLayout: true,
          readOnly: readOnly,
          wordWrap: 'on',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </section>
  )
}
