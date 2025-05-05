"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar-fixed"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerContent } from "./time-picker-content"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date)

  // Update the parent state when the date changes
  React.useEffect(() => {
    setSelectedDateTime(date)
  }, [date])

  const handleDateChange = React.useCallback(
    (selectedDate: Date | undefined) => {
      if (selectedDate) {
        const newDate = new Date(selectedDate)
        if (selectedDateTime) {
          newDate.setHours(selectedDateTime.getHours())
          newDate.setMinutes(selectedDateTime.getMinutes())
        }
        setSelectedDateTime(newDate)
        setDate(newDate)
      }
    },
    [selectedDateTime, setDate],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selectedDateTime} onSelect={handleDateChange} initialFocus />
        {selectedDateTime && (
          <div className="border-t border-border p-4">
            <TimePickerContent
              date={selectedDateTime}
              setDate={(newDate) => {
                setSelectedDateTime(newDate)
                setDate(newDate)
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
