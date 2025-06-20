import { useOperator } from '@/hooks/useOperator'
import { OperatorTable } from '@/components/operator-table'
import { AdminLayout } from '@/components/layouts/admin-layot'

export default function OperatorsPage() {
  const { operatorsQuery } = useOperator()

  return (
    <AdminLayout>
      <OperatorTable data={operatorsQuery.data?.data ?? []} />
    </AdminLayout>
  )
}
