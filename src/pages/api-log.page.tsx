import { useEffect, useState } from 'react'
import { OperatorIdCombobox } from '../components/game-integration-table'
import { AdminLayout } from '../components/layouts/admin.layout'
import { useOperator } from '../hooks/useOperator'
import { Label } from '../components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover'
import { Button } from '../components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '../components/ui/calendar'
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area'
import { format } from 'date-fns/format'
import { cn } from '../lib/utils'
import { Combobox } from '../components/combobox'
import { useApiLog } from '../hooks/useApiLog'
import type { ApiLogQuery, ApiLogResponseItem } from '../api/api-log.api'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { FullpageSkeleton } from '../components/full-page-skeleton'
import { ErrorTable } from '../components/error-table'

export function ApiLogsPage() {
  const [apiQuery, setApiQuery] = useState<ApiLogQuery>({
    startDate: new Date().toISOString(),
    endDate: new Date(new Date().getTime() + 1000 * 60 * 60).toISOString(),
  })

  function handleSubmit(data: ApiLogQuery) {
    setApiQuery({
      ...apiQuery,
      ...data,
    })
  }

  const { data: apiLogs, isLoading, isError } = useApiLog(apiQuery);

  useEffect(() => {
    console.log(apiLogs?.data)
  }, [apiLogs])

  return (
    <AdminLayout>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 m-2">
          <ApiLogFields onSubmit={handleSubmit} />
        </div>
        <ApiLogTable 
          data={apiLogs?.data ?? []} 
          isLoading={isLoading} 
          isError={isError} 
        />
      </div>
    </AdminLayout>
  )
}

export type ApiLogFieldsProps = {
  onSubmit: (data: ApiLogQuery) => void
}

function ApiLogFields({ onSubmit }: Readonly<ApiLogFieldsProps>) {
  const { operatorsQuery } = useOperator()
  const [operatorId, setOperatorId] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date >(new Date())
  const [endDate, setEndDate] = useState<Date >(new Date(new Date().getTime() + 1000 * 60 * 60))
  const [endpoint, setEndpoint] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      operator: operatorId ?? undefined,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      endpoint: endpoint ?? undefined,
    })
  }

  return (
    <form className="flex flex-col lg:flex-row lg:items-center gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Operator</Label>
        <OperatorIdCombobox
          className="w-[300px] lg:w-auto"
          operatorIds={operatorsQuery.data?.data ?? []}
          currentOperatorId={operatorId}
          setCurrentOperatorId={setOperatorId}
        />
      </div>
      <DateTimePicker24h label="Start Time (UTC)" date={startDate} setDate={(date) => setStartDate(date ?? new Date())} />
      <DateTimePicker24h label="End Time (UTC)" date={endDate} setDate={(date) => setEndDate(date ?? new Date(new Date().getTime() + 1000 * 60 * 60))} />
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Type</Label>
        <Combobox
          list={[{ url: "/api/schedule", name: "Schedule" }, { url: "/api/events", name: "Events" }]}
          currentValue={endpoint}
          setCurrentValue={setEndpoint as (value: string | number | null) => void}
          keyProp="url"
          valueProp="url"
          valueFormatter={(item) => `${item.name}`}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">&nbsp;</Label>
        <Button className="w-24" variant="outline" type="submit">Search</Button>
      </div>
    </form>
  )
}

export type DateTimePickerProps = {
  label: string
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker24h({ label, date, setDate }: Readonly<DateTimePickerProps>) {
  const [isOpen, setIsOpen] = useState(false);
 
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
 
  const handleTimeChange = (
    type: "hour" | "minute",
    value: string
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      setDate(newDate);
    }
  };
 
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="text-sm font-medium">
        {label}
      </Label>
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-48 justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MM/dd/yyyy HH:mm")
          ) : (
            <span>MM/DD/YYYY HH:mm</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.toReversed().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={date && date.getHours() === hour ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
    </div>
  );
}

export type ApiLogTableProps = {
  data: ApiLogResponseItem[],
  isLoading: boolean,
  isError: boolean,
}

export function ApiLogTable({
  data,
  isLoading,
  isError,
}: Readonly<ApiLogTableProps>) {

  if (isLoading) return <FullpageSkeleton/>
  if (isError) return <ErrorTable/>

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-2">
        <div className="overflow-hidden rounded-lg border m-2">
          <Table className="w-full">
            <ApiLogTableHeader />
            <TableBody>
              {data.length === 0 ? <EmptyApiLogTableBody /> : data.map((item) => (
                <ApiTableItem key={item.id} dataItem={item} />
              ))}
              {data.map((item) => (
                <ApiTableItem key={item.id} dataItem={item} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

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

export type ApiTableItemProps = {
  dataItem: ApiLogResponseItem
}

export function ApiTableItem({ dataItem }: Readonly<ApiTableItemProps>) {
  return (
    <TableRow>
      <TableCell>{format(dataItem.timestamp, "MM/dd/yyyy HH:mm")}</TableCell>
      <TableCell>{dataItem.user?.userId ?? "Unauthenticated"}</TableCell>
      <TableCell className="text-amber-600">{dataItem.request.path}</TableCell>
      <TableCell>View full request</TableCell>
      <TableCell>View full response</TableCell>
    </TableRow>
  )
}

export function EmptyApiLogTableBody() {
  return (
      <TableRow>
        <TableCell colSpan={5} className="text-center text-muted-foreground">No logs found</TableCell>
      </TableRow>
  )
}