import { TableCell, TableRow } from "@/components/ui/table";

export function EmptyApiLogTableBody() {
  return (
      <TableRow>
        <TableCell colSpan={5} className="text-center text-muted-foreground">No logs found</TableCell>
      </TableRow>
  )
}