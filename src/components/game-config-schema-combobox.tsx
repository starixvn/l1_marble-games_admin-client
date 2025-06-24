"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { GameConfigSchemaListResponse } from "../api/game-config-schema.api"

export function GameConfigSchemaCombobox({
  currentSchemaId,
  setCurrentSchemaId,
  data
}: Readonly<{
  currentSchemaId: string | null;
  setCurrentSchemaId: (id: string | null) => void;
  data: GameConfigSchemaListResponse | undefined;
}>) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {currentSchemaId
            ? data?.find((schema) => schema.id === currentSchemaId)?.name
            : "Select game config schema..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search game config schema..." className="h-9" />
          <CommandList>
            <CommandEmpty>No game config schema found.</CommandEmpty>
            <CommandGroup>
              {data?.map((schema) => (
                <CommandItem
                  key={schema.id}
                  value={schema.name}
                  onSelect={(currentValue) => {
                    const selectedSchema = data?.find(
                      (s) => s.name === currentValue
                    )
                    const selectedId = selectedSchema?.id ?? ""
                    setCurrentSchemaId(selectedId)
                    setOpen(false)
                  }}
                >
                  {schema.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentSchemaId === schema.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
