import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import type { ApiLogResponseItem } from "@/api/api-log.api"

export type ApiLogTableItemProps = {
  dataItem: ApiLogResponseItem
  handleRequestDialogOpen: (item: ApiLogResponseItem) => void
  handleResponseDialogOpen: (item: ApiLogResponseItem) => void
}

export function ApiLogTableItem({ dataItem, handleRequestDialogOpen, handleResponseDialogOpen }: Readonly<ApiLogTableItemProps>) {
  return (
    <TableRow>
      <TableCell>{format(dataItem.timestamp, "MM/dd/yyyy HH:mm:ss")}</TableCell>
      <TableCell>{dataItem.user?.userId ?? "Unauthenticated"}</TableCell>
      <TableCell className="text-amber-600">{dataItem.request.path}</TableCell>
      <TableCell>
        <Button className="p-0" variant="link" onClick={() => handleRequestDialogOpen(dataItem)}>View full request</Button>
      </TableCell>
      <TableCell>
        <Button className="p-0" variant="link" onClick={() => handleResponseDialogOpen(dataItem)}>View full response</Button>
      </TableCell>
    </TableRow>
  )
}