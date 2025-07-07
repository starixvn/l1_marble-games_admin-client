import type { PropsWithoutRef } from "react"
import type { ApiLogResponseItem } from "@/api/api-log.api"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DialogTitle } from "@radix-ui/react-dialog"

export type ApiLogRequestDialogProps = PropsWithoutRef<{
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  request: ApiLogResponseItem['request']
}>

export function ApiLogRequestDialog({
  isOpen,
  onOpenChange,
  request,
}: Readonly<ApiLogRequestDialogProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent >
        <DialogTitle className="sr-only">
          Request Details
        </DialogTitle>
          <Label>
            <span className="font-medium text-green-400">
              {request.method}
            </span> 
            <span className="font-normal">
              {request.path}
            </span>
          </Label>
        <Label>Query</Label>
        <pre className="max-h-[80vh] text-sm bg-muted p-4 rounded-md whitespace-pre-wrap overflow-y-auto no-scrollbar">
          {JSON.stringify(request.query, null, 2)}
        </pre>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  )
}