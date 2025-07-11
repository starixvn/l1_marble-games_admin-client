import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ApiLogQuery } from "../../api/api-log.api";

export function ApiLogTableHeader({ apiQuery }: Readonly<{ apiQuery: ApiLogQuery }>) {
  
  return (
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Operator</TableHead>
          <TableHead>Endpoint</TableHead>
          {apiQuery?.endpoint === "/api/events" && (
            <>
              <TableHead>Event ID</TableHead>
              <TableHead>Game ID</TableHead>
            </>
          )}
          <TableHead>Request</TableHead>
          <TableHead>Response</TableHead>
        </TableRow>
      </TableHeader>
    )
  }
  