'use client'
import type { GameConfigSchemaListResponse } from '../api/game-config-schema.api'
import { Combobox } from './combobox'

export function GameConfigSchemaCombobox({
  currentSchemaId,
  setCurrentSchemaId,
  data,
  disabled = false,
}: Readonly<{
  currentSchemaId?: string
  setCurrentSchemaId?: (id: string | null) => void
  data: GameConfigSchemaListResponse[] | undefined
  disabled?: boolean
}>) {
  return (
    <Combobox
      list={
        data?.map((schema) => ({
          id: schema.id,
          name: schema.name,
        })) ?? []
      }
      currentValue={currentSchemaId}
      setCurrentValue={(setCurrentSchemaId ?? (() => {})) as (value: string | number | null) => void}
      keyProp="id"
      valueProp="name"
      placeholder="Select game config schema..."
      nothingFoundMessage="No game config schema found."
      className="w-[300px]"
      valueFormatter={(item) => `${item?.name ?? 'Not found, please select another schema'}`}
      disabled={disabled}
    />
  )
}
