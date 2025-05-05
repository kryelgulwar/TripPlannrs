"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar-simplified"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerContent } from "./time-picker-content"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    setSelectedDateTime(date)
  }, [date])

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) return

    // Preserve time if there's already a selected date
    if (selectedDateTime) {
      selected.setHours(selectedDateTime.getHours())
      selected.setMinutes(selectedDateTime.getMinutes())
    }

    setSelectedDateTime(selected)
    setDate(selected)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>Pick a date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selectedDateTime} onSelect={handleSelect} initialFocus />
        <div className="border-t border-border p-3">
          <TimePickerContent date={selectedDateTime} setDate={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
