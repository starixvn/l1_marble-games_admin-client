"use client"
import type { GameConfigSchemaListResponse } from "../api/game-config-schema.api"
import { Combobox } from "./combobox"

export function GameConfigSchemaCombobox({
  currentSchemaId,
  setCurrentSchemaId,
  data
}: Readonly<{
  currentSchemaId?: string;
  setCurrentSchemaId?: (id: string | undefined) => void;
  data: GameConfigSchemaListResponse | undefined;
}>) {

  return (
    <Combobox 
      list={data?.map((schema) => ({
        id: schema.id,
        name: schema.name,
      })) ?? []}
      currentValue={currentSchemaId}
      setCurrentValue={setCurrentSchemaId ?? (() => {})}
      keyProp="id"
      valueProp="name"
      placeholder="Select game config schema..."
      nothingFoundMessage="No game config schema found."
      className="w-[300px]"
      valueFormatter={(item) => `${item?.name ?? 'Not found, please select another schema'}`}
    />
  )
}
