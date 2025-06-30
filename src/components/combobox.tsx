import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Command } from './ui/command'

type ComboboxProps = {
  list: Record<string, number | string | null>[]
  currentValue?: number | string | null
  setCurrentValue?: (value: number | string | null) => void
  keyProp: string
  valueProp: string
  placeholder?: string
  nothingFoundMessage?: string
  className?: string
  valueFormatter: (value: Record<string, number | string | null>) => string
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

  const currentItem = currentValue ? list.find((item) => item[keyProp] === currentValue) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" aria-expanded={open} className={cn('justify-between', className)}>
          {currentItem ? valueFormatter(currentItem) : (placeholder ?? 'Select...')}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', className)}>
        <Command>
          <CommandInput placeholder={placeholder ?? 'Search...'} className="h-9" />
          <CommandList>
            <CommandEmpty>{nothingFoundMessage ?? 'No game found.'}</CommandEmpty>
            <CommandGroup>
              {list.map((item) => (
                <CommandItem
                  key={item[keyProp] as string}
                  value={item[valueProp] as string}
                  onSelect={(currentValue) => {
                    const selectedItem = list.find((s) => s[valueProp]?.toString() === currentValue?.toString())
                    const selectedId = selectedItem?.[keyProp] as number | string | null
                    if (setCurrentValue) {
                      setCurrentValue(selectedId)
                    }
                    setOpen(false)
                  }}
                >
                  {valueFormatter(item)}
                  <Check className={cn('ml-auto', currentValue === item[keyProp] ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
