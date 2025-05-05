"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(date ? format(date, "HH:mm") : undefined)

  const times = React.useMemo(() => {
    const times = []
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i < 10 ? `0${i}` : `${i}`
        const minute = j < 10 ? `0${j}` : `${j}`
        times.push(`${hour}:${minute}`)
      }
    }
    return times
  }, [])

  const handleSelect = React.useCallback(
    (time: string) => {
      setSelectedTime(time)

      if (!date) return

      const [hour, minute] = time.split(":")
      const newDate = new Date(date)
      newDate.setHours(Number.parseInt(hour, 10))
      newDate.setMinutes(Number.parseInt(minute, 10))
      setDate(newDate)
    },
    [date, setDate],
  )

  // Update the time when the date changes
  React.useEffect(() => {
    if (date) {
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [date])

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex flex-col space-y-2 p-2">
          <div className="space-y-2">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </div>
          <div className="px-4 pt-4 pb-2">
            <p className="font-medium text-sm">Time:</p>
          </div>
          <Command>
            <CommandInput placeholder="Search for a time..." />
            <CommandList>
              <CommandEmpty>No time found.</CommandEmpty>
              <CommandGroup>
                {times.map((time) => (
                  <CommandItem key={time} value={time} onSelect={(value) => handleSelect(value)}>
                    {time}
                    {selectedTime === time && <Check className="ml-auto h-4 w-4 opacity-100" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
