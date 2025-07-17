import { useAccounts } from '@/hooks/useAccounts'
import { ErrorTable } from '@/components/error-table'
import { FullpageSkeleton } from '@/components/full-page-skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function AccountTable() {
  const { data, isLoading, error } = useAccounts()

  if (isLoading) {
    return <FullpageSkeleton />
  }

  if (error) {
    return <ErrorTable />
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2">
        <div className="overflow-hidden rounded-lg border m-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.length > 0 &&
                data.map((account) => (
                  <TableRow key={account.username}>
                    <TableCell>{account.username}</TableCell>
                    <TableCell>{account.role ?? 'admin'}</TableCell>
                  </TableRow>
                ))}
              {data && data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    No accounts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
