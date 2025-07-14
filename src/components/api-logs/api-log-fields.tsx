import { useState } from "react"
import type { ApiLogQuery } from "@/api/api-log.api"
import { useOperator } from "@/hooks/useOperator"
import { Label } from "@/components/ui/label"
import { GameIdCombobox, OperatorIdCombobox } from "@/components/game-integration-table"
import { DateTimePicker24h } from "@/components/datetime-picker"
import { Combobox } from "@/components/combobox"
import { Button } from "@/components/ui/button"
import { useGameConfig } from "../../hooks/useGameConfig"
import { Input } from "../ui/input"

export type ApiLogFieldsProps = {
  onSubmit: (data: ApiLogQuery) => void
}

export function ApiLogFields({ onSubmit }: Readonly<ApiLogFieldsProps>) {
  const { operatorsQuery } = useOperator()
  const [operatorId, setOperatorId] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getTime() - 60 * 60 * 1000)
  })
  const [endDate, setEndDate] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getTime() + 60 * 60 * 1000)
  })
  const [endpoint, setEndpoint] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string | null>(null)
  const [gameId, setGameId] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    onSubmit({
      operator: operatorId ?? undefined,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      endpoint: endpoint ?? undefined,
      eventId: endpoint === "/api/events" && eventId ? eventId : undefined,
      gameId: endpoint === "/api/events" && gameId ? gameId.toString() : undefined,
    })
  }

  return (
    <form className="flex flex-wrap items-start gap-3" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Operator</Label>
        <OperatorIdCombobox
          className="w-[300px] lg:w-auto"
          operatorIds={operatorsQuery.data?.data ?? []}
          currentOperatorId={operatorId}
          setCurrentOperatorId={setOperatorId}
        />
      </div>
      <DateTimePicker24h label="Start Time (UTC)" date={startDate} setDate={(date) => setStartDate(date ?? (() => {
        const now = new Date()
        return new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
      })())} />
      <DateTimePicker24h label="End Time (UTC)" date={endDate} setDate={(date) => setEndDate(date ?? (() => {
        const now = new Date()
        return new Date(now.getTime() + 60 * 60 * 1000) // 1 hour from now
      })())} />
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
      {endpoint === "/api/events" && <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Game ID</Label>
        <SelfLoadedGameIdCombobox currentGameId={gameId} setCurrentGameId={setGameId} />
      </div>}
      {endpoint === "/api/events" && <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">Event ID</Label>
        <Input 
          type="number" 
          placeholder="Event ID" 
          value={eventId ?? ''} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventId(e.target.value)}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>}
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium">&nbsp;</Label>
        <Button className="w-24" variant="outline" type="submit">Search</Button>
      </div>
    </form>
  )
}


function SelfLoadedGameIdCombobox({
  currentGameId,
  setCurrentGameId,
}: Readonly<{
  currentGameId: number | null
  setCurrentGameId: (gameId: number | null) => void
}>) {
  const { gameConfigQuery } = useGameConfig()
  const gameIds = gameConfigQuery.data?.data.map((game: { gameId: number }) => game.gameId) ?? []
  return <GameIdCombobox gameIds={gameIds} currentGameId={currentGameId} setCurrentGameId={setCurrentGameId} /> as unknown as React.ReactElement
}