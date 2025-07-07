import { TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function AdminLogTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-1/6">Time</TableHead>
        <TableHead className="w-1/6">Author</TableHead>
        <TableHead className="w-1/6">Resource</TableHead>
        <TableHead className="w-1/6">Action</TableHead>
        <TableHead className="w-1/6">Diff</TableHead>
      </TableRow>
    </TableHeader>
  )
}
