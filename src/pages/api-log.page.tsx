import { ApiLog } from '@/components/api-logs/api-log'
import { AdminLayout } from '@/components/layouts/admin.layout'
export function ApiLogsPage() {
  return (
    <AdminLayout>
      <ApiLog />
    </AdminLayout>
  )
}
