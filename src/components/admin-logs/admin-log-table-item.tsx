import { format } from 'date-fns'
import type { AdminLogResponseItem } from '@/api/admin-log.api'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

export type AdminLogTableItemProps = {
  dataItem: AdminLogResponseItem
  handleDiffDialogOpen: (item: AdminLogResponseItem) => void
}

export function AdminLogTableItem({ dataItem, handleDiffDialogOpen }: Readonly<AdminLogTableItemProps>) {
  return (
    <TableRow>
      <TableCell>{format(dataItem.timestamp, 'MM/dd/yyyy HH:mm:ss')}</TableCell>
      <TableCell className={`${dataItem.author ? '' : 'text-red-400'}`}>{dataItem.author ?? 'Unknown'}</TableCell>
      <TableCell>{dataItem.resource}</TableCell>
      <TableCell>{dataItem.action}</TableCell>
      <TableCell>
        <Button className="p-0" variant="link" onClick={() => handleDiffDialogOpen(dataItem)}>
          View diff
        </Button>
      </TableCell>
    </TableRow>
  )
}
