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
import { useGameConfigSchemaList } from "@/hooks/useGameConfigSchema"

export function GameConfigSchemaCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { gameConfigSchemaListQuery } = useGameConfigSchemaList();

  if (gameConfigSchemaListQuery.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? gameConfigSchemaListQuery.data?.data?.find((schema) => schema.id === value)?.name
            : "Select framework..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search game config schema..." className="h-9" />
          <CommandList>
            <CommandEmpty>No game config schema found.</CommandEmpty>
            <CommandGroup>
              {gameConfigSchemaListQuery.data?.data?.map((schema) => (
                <CommandItem
                  key={schema.id}
                  value={schema.name}
                  onSelect={(currentValue) => {
                    const selectedSchema = gameConfigSchemaListQuery.data?.data?.find(
                      (s) => s.name === currentValue
                    )
                    const selectedId = selectedSchema?.id ?? ""
                    setValue(selectedId === value ? "" : selectedId)
                    setOpen(false)
                  }}
                >
                  {schema.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === schema.id ? "opacity-100" : "opacity-0"
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
