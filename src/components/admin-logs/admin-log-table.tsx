import type { AdminLogResponseItem } from "@/api/admin-log.api"
import { useState } from "react"
import { ErrorTable } from "@/components/error-table"
import { FullpageSkeleton } from "@/components/full-page-skeleton"
import { Table, TableBody } from "@/components/ui/table"
import { EmptyApiLogTableBody } from "@/components/api-logs/empty-log-table-body"
import { AdminLogDiffViewer } from '@/components/admin-logs/admin-log-diff-viewer'
import { AdminLogTableItem } from '@/components/admin-logs/admin-log-table-item'
import { AdminLogTableHeader } from '@/components/admin-logs/admin-log-table-header'

export type AdminLogTableProps = {
  data: AdminLogResponseItem[],
  isLoading: boolean,
  isError: boolean,
}

export function AdminLogTable({ data, isLoading, isError }: Readonly<AdminLogTableProps>) {
  const [isDiffDialogOpen, setIsDiffDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<AdminLogResponseItem | null>(null)

  const handleDiffDialogOpen = (item: AdminLogResponseItem) => {
    setSelectedItem(item)
    setIsDiffDialogOpen(true)
  }

  if (isLoading) return <FullpageSkeleton/>
  if (isError) return <ErrorTable/>

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2">
        <div className="overflow-hidden rounded-lg border m-2">
          <Table className="w-full">
            <AdminLogTableHeader />
            <TableBody>
              {data.length === 0 ? <EmptyApiLogTableBody /> : data.map((item) => (
                <AdminLogTableItem key={item.id} dataItem={item} handleDiffDialogOpen={handleDiffDialogOpen} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AdminLogDiffViewer
        isOpen={isDiffDialogOpen}
        onOpenChange={setIsDiffDialogOpen}
        diff={selectedItem?.diff}
      />
    </div>
  )
}



