import { useContext, type PropsWithoutRef } from 'react'
import type { AdminLogResponseItem } from '@/api/admin-log.api'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ThemeContext } from '@/contexts/theme.context'
import { DiffEditor } from '@monaco-editor/react'

export type AdminLogDiffViewerProps = PropsWithoutRef<{
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  diff?: AdminLogResponseItem['diff']
}>

export function AdminLogDiffViewer({ isOpen, onOpenChange, diff }: Readonly<AdminLogDiffViewerProps>) {
  const { theme } = useContext(ThemeContext)
  const oldValue = diff?.old ? JSON.stringify(diff.old, null, 2) : ''
  const newValue = diff?.new ? JSON.stringify(diff.new, null, 2) : ''

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-auto min-w-[80vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Diff</DialogTitle>
          <DialogDescription>
            <span className="text-sm text-muted-foreground">
              Compare the old and new values of the resource
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto no-scrollbar mt-4">
          <DiffEditor
            height="50vh"
            width="100%"
            original={oldValue}
            keepCurrentModifiedModel={true}
            keepCurrentOriginalModel={true}
            modified={newValue}
            language="json"
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              originalEditable: false,
              readOnly: true,
              renderSideBySide: true,
              scrollBeyondLastLine: false,
              hideUnchangedRegions: {
                enabled: true
              },
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
