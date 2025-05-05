"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar-fixed"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerContent } from "./time-picker-content"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function DateTimePicker({ date, setDate, className }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)

  // Update the parent state when the date changes
  React.useEffect(() => {
    setSelectedDate(date)
  }, [date])

  // Update the date with the selected time
  const handleTimeChange = React.useCallback(
    (time: { hour: number; minute: number }) => {
      if (!selectedDate) return

      const newDate = new Date(selectedDate)
      newDate.setHours(time.hour)
      newDate.setMinutes(time.minute)
      setDate(newDate)
    },
    [selectedDate, setDate],
  )

  // Update the date with the selected date
  const handleDateChange = React.useCallback(
    (date: Date | undefined) => {
      setSelectedDate(date)

      if (date) {
        const newDate = new Date(date)
        if (selectedDate) {
          newDate.setHours(selectedDate.getHours())
          newDate.setMinutes(selectedDate.getMinutes())
        }
        setDate(newDate)
      } else {
        setDate(undefined)
      }
    },
    [selectedDate, setDate],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selectedDate} onSelect={handleDateChange} initialFocus />
        {selectedDate && (
          <div className="border-t border-border p-3">
            <TimePickerContent
              value={
                selectedDate
                  ? { hour: selectedDate.getHours(), minute: selectedDate.getMinutes() }
                  : { hour: 0, minute: 0 }
              }
              onChange={handleTimeChange}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
