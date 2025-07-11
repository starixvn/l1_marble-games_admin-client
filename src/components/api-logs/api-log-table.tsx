import { useState } from "react"
import { ErrorTable } from "@/components/error-table"
import { FullpageSkeleton } from "@/components/full-page-skeleton"
import { Table, TableBody } from "@/components/ui/table"
import { ApiLogRequestDialog } from "@/components/api-logs/api-log-request-dialog"
import { ApiLogResponseDialog } from "@/components/api-logs/api-log-response-dialog"
import { ApiLogTableHeader } from "@/components/api-logs/api-log-table-header"
import { ApiLogTableItem } from "@/components/api-logs/api-log-table-item"
import { EmptyApiLogTableBody } from "@/components/api-logs/empty-log-table-body"
import type { ApiLogQuery, ApiLogResponseItem } from "@/api/api-log.api"

export type ApiLogTableProps = {
  apiQuery: ApiLogQuery,
  data: ApiLogResponseItem[],
  isLoading: boolean,
  isError: boolean,
}

export function ApiLogTable({
  apiQuery,
  data,
  isLoading,
  isError,
}: Readonly<ApiLogTableProps>) {

  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ApiLogResponseItem | null>(null)

  const handleRequestDialogOpen = (item: ApiLogResponseItem) => {
    setSelectedItem(item)
    setIsRequestDialogOpen(true)
  }
  const handleResponseDialogOpen = (item: ApiLogResponseItem) => {
    setSelectedItem(item)
    setIsResponseDialogOpen(true)
  }

  if (isLoading) return <FullpageSkeleton/>
  if (isError) return <ErrorTable/>

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2">
        <div className="overflow-hidden rounded-lg border m-2">
          <Table className="w-full">
            <ApiLogTableHeader apiQuery={apiQuery} />
            <TableBody>
              {data.length === 0 ? <EmptyApiLogTableBody /> : data.map((item) => (
                <ApiLogTableItem apiQuery={apiQuery} key={item.id} dataItem={item} handleRequestDialogOpen={handleRequestDialogOpen} handleResponseDialogOpen={handleResponseDialogOpen} />
              ))}
            </TableBody>
          </Table>
        </div>
        {selectedItem && (
          <>
            <ApiLogRequestDialog
              isOpen={isRequestDialogOpen}
              onOpenChange={setIsRequestDialogOpen}
              request={selectedItem.request}
            />
            <ApiLogResponseDialog
            isOpen={isResponseDialogOpen}
              onOpenChange={setIsResponseDialogOpen}
              response={selectedItem.response}
            />
          </>
        )}
      </div>
    </div>
  )
}

