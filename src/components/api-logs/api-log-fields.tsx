import { useState } from "react"
import type { ApiLogQuery } from "@/api/api-log.api"
import { useOperator } from "@/hooks/useOperator"
import { Label } from "@/components/ui/label"
import { OperatorIdCombobox } from "@/components/game-integration-table"
import { DateTimePicker24h } from "@/components/datetime-picker"
import { Combobox } from "@/components/combobox"
import { Button } from "@/components/ui/button"

export type ApiLogFieldsProps = {
  onSubmit: (data: ApiLogQuery) => void
}

export function ApiLogFields({ onSubmit }: Readonly<ApiLogFieldsProps>) {
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