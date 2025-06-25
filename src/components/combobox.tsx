import {Check ,ChevronsUpDown } from "lucide-react"
import React from "react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command,  } from "./ui/command"

type ComboboxProps = {
    list: any[],
    currentValue: any,
    setCurrentValue: (value: any) => void,
    keyProp: string,
    valueProp: string,
    placeholder?: string,
    nothingFoundMessage?: string,
    className?: string,
    valueFormatter: (value: any) => string,
}

export function Combobox({
    list,
    currentValue,
    setCurrentValue,
    keyProp,
    valueProp,
    placeholder,
    nothingFoundMessage,
    className,
    valueFormatter,
}: Readonly<ComboboxProps>) {
    const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {currentValue
            ? valueFormatter(list.find((item) => item[keyProp] === currentValue))
            : placeholder ?? "Select..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)}>
        <Command>
          <CommandInput placeholder={placeholder ?? "Search..."} className="h-9" />
          <CommandList>
            <CommandEmpty>{nothingFoundMessage ?? "No game found."}</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item[keyProp]}
                  value={item[valueProp]}
                  onSelect={(currentValue) => {
                    const selectedItem = list.find(
                      (s) => s[valueProp].toString() === currentValue.toString()
                    )
                    const selectedId = selectedItem?.[keyProp] ?? ""
                    if (setCurrentValue) {
                      setCurrentValue(selectedId)
                    }
                    setOpen(false)
                  }}
                >
                  {valueFormatter(item)}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentValue === item[keyProp] ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>)
}