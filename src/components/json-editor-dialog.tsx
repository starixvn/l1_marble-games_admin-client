import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { JsonEditorWithDragDrop } from './json-editor-with-drag-drop'
import { toast } from 'sonner'

interface JsonEditorDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: string
  onSubmit: (jsonString: string) => void
  title?: string
  description?: string
  isLoading?: boolean
  isError?: boolean
}

export function JsonEditorDialog({
  isOpen,
  onOpenChange,
  initialValue = '{}',
  onSubmit,
  title = 'JSON Editor',
  description = 'Paste json below or drag and drop file',
  isLoading = false,
  isError = false,
}: Readonly<JsonEditorDialogProps>) {
  const [currentEditorValue, setCurrentEditorValue] = useState<string>(initialValue)
  useEffect(() => {
    if (isOpen) {
      setCurrentEditorValue(initialValue)
    }
  }, [isOpen, initialValue, setCurrentEditorValue])

  const handleSubmit = () => {
    try {
      JSON.parse(currentEditorValue)
      onSubmit(currentEditorValue)
      onOpenChange(false)
    } catch {
      toast.error('Invalid JSON format')
    }
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <JsonEditorWithDragDrop
          value={currentEditorValue}
          onChange={setCurrentEditorValue}
          isLoading={isLoading}
          isError={isError}
        />
        <div className="flex justify-end pt-4 gap-2">
          <Button onClick={handleSubmit}>OK</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
