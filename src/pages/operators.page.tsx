import { useOperator } from '@/hooks/useOperator'
import { OperatorTable } from '@/components/operator-table'
import { AdminLayout } from '@/components/layouts/admin.layout'
import { CreateOperatorSection } from '@/components/create-operator-section'
import { ErrorTable } from '@/components/error-table'
import { FullpageSkeleton } from '@/components/full-page-skeleton'
import { API_ENDPOINTS } from '../api/api-endpoints'
import { usePermission } from '../hooks/usePermission'

export default function OperatorsPage() {
  const { operatorsQuery } = useOperator()
  const { isAllowed } = usePermission(
    { 
      path: [API_ENDPOINTS.OPERATOR.CREATE, 
      API_ENDPOINTS.OPERATOR.GENERATE_PASSWORD, 
      API_ENDPOINTS.OPERATOR.UPDATE_NAME,
    ] })
    
  function renderOperatorTable() {
    if (operatorsQuery.error) {
      return <ErrorTable onClick={() => operatorsQuery.refetch()} />
    }

    if (operatorsQuery.isLoading) {
      return (
        <div className="flex flex-1 flex-col gap-2 m-2">
          <FullpageSkeleton />
        </div>
      )
    }

    return (
      <>
        {isAllowed && <CreateOperatorSection />}
        <OperatorTable data={operatorsQuery.data?.data ?? []} readonly={!isAllowed} />
      </>
    )
  }

  return <AdminLayout>{renderOperatorTable()}</AdminLayout>
}
