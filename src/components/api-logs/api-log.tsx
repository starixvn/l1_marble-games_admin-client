import { toast } from "sonner";
import { useState } from "react";
import { ApiLogFields } from "@/components/api-logs/api-log-fields";
import { ApiLogTable } from "@/components/api-logs/api-log-table";
import type { ApiLogQuery } from "@/api/api-log.api";
import { useApiLog } from "@/hooks/useApiLog";

export function ApiLog() {
  const [apiQuery, setApiQuery] = useState<ApiLogQuery>({
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().getTime() + 1000 * 60 * 60).toISOString(),
  })
  const { data: apiLogs, isLoading, isError } = useApiLog(apiQuery);
  function handleSubmit(data: ApiLogQuery) {
    if (data.startDate >= data.endDate) {
      toast.error("Start date must be before end date")
      return
    }

    if (Math.abs(new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) > 1000 * 60 * 60 * 24*7) {
      toast.error("Query time range must be within 7 days")
      return
    }

    setApiQuery({
      ...apiQuery,
      ...data,
    })
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 m-2">
        <ApiLogFields onSubmit={handleSubmit} />
      </div>
      <ApiLogTable
        apiQuery={apiQuery}
        data={apiLogs?.data ?? []} 
        isLoading={isLoading} 
        isError={isError} 
      />
    </div>
  )
}