import { useOperator } from '@/hooks/useOperator'
import { OperatorTable } from '@/components/operator-table'
import { AdminLayout } from '@/components/layouts/admin.layout'
import { CreateOperatorSection } from '@/components/create-operator-section'
import { ErrorTable } from '@/components/error-table'
import { FullpageSkeleton } from '@/components/full-page-skeleton'

export default function OperatorsPage() {
  const { operatorsQuery } = useOperator()

  function renderOperatorTable() {
    if (operatorsQuery.error) {
      return <ErrorTable onClick={() => operatorsQuery.refetch()}/>
    }

    if (operatorsQuery.isLoading) {
      return (
        <div className="flex flex-1 flex-col gap-2 m-2">
          <FullpageSkeleton/>
        </div>
      )
    }

    return (
      <>
        <CreateOperatorSection />
        <OperatorTable data={operatorsQuery.data?.data ?? []} />
      </>
    )
  }

  return (
    <AdminLayout>
      {renderOperatorTable()}
    </AdminLayout>
  )
}
