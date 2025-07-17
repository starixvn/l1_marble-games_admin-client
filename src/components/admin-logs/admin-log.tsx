import { toast } from "sonner"
import { AdminLogFields } from '@/components/admin-logs/admin-log-fields'
import { AdminLogTable } from '@/components/admin-logs/admin-log-table'
import type { AdminLogQuery } from "@/api/admin-log.api"
import { useAdminLog } from "@/hooks/useAdminLog"
import { useState } from "react"

export function AdminLog() {
  const [adminLogQuery, setAdminLogQuery] = useState<AdminLogQuery>(() => {
    const now = new Date()
    const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0))
    const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 0))
    
    return {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    }
  })

  const { data: adminLogs, isLoading, isError } = useAdminLog(adminLogQuery)

  function handleSubmit(data: AdminLogQuery) {
    if (data.startDate > data.endDate) {
      toast.error('Start date must be before end date')
      return
    }

    if (Math.abs(new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) > 1000 * 60 * 60 * 24 * 7) {
      toast.error('Query time range must be within 7 days')
      return
    }

    setAdminLogQuery({
      ...adminLogQuery,
      ...data,
    })
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 m-2">
        <AdminLogFields onSubmit={handleSubmit} />
      </div>
      <AdminLogTable data={adminLogs?.data ?? []} isLoading={isLoading} isError={isError} />
    </div>)
}
