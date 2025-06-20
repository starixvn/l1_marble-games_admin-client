import { OperatorTableItem } from '../components/operator-table-item'
import { Table, TableHeader, TableRow, TableHead, TableBody } from '@/components/ui/table'

export function OperatorTable({
  data,
}: Readonly<{
  data: {
    id: string
    name: string
  }[]
}>) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2">
        <div className="overflow-hidden rounded-lg border m-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px] px-6">Operator Id</TableHead>
                <TableHead className="px-6">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((operator) => (
                <OperatorTableItem key={operator.id} operator={operator} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
