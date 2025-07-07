import type { AdminLogQuery } from '@/api/admin-log.api'
import { useState } from 'react'
import { DateTimePicker24h } from '@/components/datetime-picker'
import { Label } from '@/components/ui/label'
import { Combobox, type ComboboxGenericProp } from '@/components/combobox'
import { Button } from '@/components/ui/button'

export type AdminLogFieldsProps = {
  onSubmit: (data: AdminLogQuery) => void
}

const authorList = [
  {
    name: "admin"
  }
]

const resourceList = [
  {
    name: "ALL",
    value: undefined
  },
  {
    name: "operator",
    value: "operator"
  },
  {
    name: "game-config",
    value: "game-config"
  },
  {
    name: "game-config-schema",
    value: "game-config-schema"
  },
  {
    name: "game-integration",
    value: "game-integration",
  }
]


const actionList = [
  {
    name: "ALL",
    value: undefined
  },
  {
    name: "insert",
    value: "insert"
  },
  {
    name: "update",
    value: "update"
  },
  {
    name: "delete",
    value: "delete"
  }
]

export function AdminLogFields({ onSubmit }: Readonly<AdminLogFieldsProps>) {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date(new Date().getTime() + 1000 * 60 * 60))
  const [author, setAuthor] = useState<string | undefined>(undefined)
  const [resource, setResource] = useState<string | undefined>(undefined)
  const [action, setAction] = useState<string | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      author,
      resource,
      action,
    })
  }

  return <form className="flex flex-col lg:flex-row lg:items-center gap-3" onSubmit={handleSubmit}>
    <DateTimePicker24h label="Start Time (UTC)" date={startDate} setDate={(date) => setStartDate(date ?? new Date())} />
    <DateTimePicker24h label="End Time (UTC)" date={endDate} setDate={(date) => setEndDate(date ?? new Date(new Date().getTime() + 1000 * 60 * 60))} />
    <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Author</Label>
        <Combobox
          list={authorList}
          currentValue={author}
          setCurrentValue={setAuthor as (value: ComboboxGenericProp) => void}
          keyProp="name"
          valueProp="value"
          valueFormatter={(item) => `${item.name}`}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Resource</Label>
        <Combobox
          list={resourceList}
          currentValue={resource}
          setCurrentValue={setResource as (value: ComboboxGenericProp) => void}
          keyProp="name"
          valueProp="value"
          valueFormatter={(item) => `${item.name}`}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Action</Label>
        <Combobox
          list={actionList}
          currentValue={action}
          setCurrentValue={setAction as (value: ComboboxGenericProp) => void}
          keyProp="name"
          valueProp="value"
          valueFormatter={(item) => `${item.name}`}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">&nbsp;</Label>
        <Button className="w-24" variant="outline" type="submit">Search</Button>
      </div>
  </form>
}
