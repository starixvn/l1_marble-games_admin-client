import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ApiLogTableHeader() {
    return (
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Operator</TableHead>
          <TableHead>Endpoint</TableHead>
          <TableHead>Request</TableHead>
          <TableHead>Response</TableHead>
        </TableRow>
      </TableHeader>
    )
  }
  