import { useOperator } from '@/hooks/useOperator'
import { OperatorTable } from '@/components/operator-table'
import { AdminLayout } from '@/components/layouts/admin-layot'
import { CreateOperatorSection } from '../components/create-operator-section'

export default function OperatorsPage() {
  const { operatorsQuery } = useOperator()

  return (
    <AdminLayout>
      <CreateOperatorSection />
      <OperatorTable data={operatorsQuery.data?.data ?? []} />
    </AdminLayout>
  )
}
