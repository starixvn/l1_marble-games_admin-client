import type { AdminLogResponseItem } from '@/api/admin-log.api'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatInTimeZone } from 'date-fns-tz'

export type AdminLogTableItemProps = {
  dataItem: AdminLogResponseItem
  handleDiffDialogOpen: (item: AdminLogResponseItem) => void
}

export function AdminLogTableItem({ dataItem, handleDiffDialogOpen }: Readonly<AdminLogTableItemProps>) {
  return (
    <TableRow>
      <TableCell>{formatInTimeZone(dataItem.timestamp, "UTC", "MM/dd/yyyy HH:mm:ss")}</TableCell>
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
