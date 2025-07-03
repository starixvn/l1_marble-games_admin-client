import type { PropsWithoutRef } from "react"
import type { ApiLogResponseItem } from "../../api/api-log.api"
import { Dialog, DialogContent } from "../ui/dialog"
import { Label } from "../ui/label"

export type ResponseDialogProps = PropsWithoutRef<{
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  response: ApiLogResponseItem['response']
}>

export function ApiLogResponseDialog({
  isOpen,
  onOpenChange,
  response,
}: Readonly<ResponseDialogProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent >
        <div className="flex flex-col gap-2 overflow-hidden">
          <Label>
            <span className="font-medium">
              {response.statusCode}
            </span>
            <span className="font-normal text-orange-400">
              {response.responseTime}
            </span>
          </Label>
          <pre className="max-h-[80vh] text-sm bg-muted p-4 rounded-md whitespace-pre-wrap overflow-y-auto no-scrollbar">
            {JSON.stringify(response.responseBody, null, 2)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}