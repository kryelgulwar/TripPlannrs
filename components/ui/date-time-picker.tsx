"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar-fixed"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

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

  const handleTimeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedDateTime) return

      const [hours, minutes] = e.target.value.split(":").map(Number)
      const newDate = new Date(selectedDateTime)
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      setSelectedDateTime(newDate)
      setDate(newDate)
    },
    [selectedDateTime, setDate],
  )

  const handlePeriodChange = React.useCallback(
    (period: "AM" | "PM") => {
      if (!selectedDateTime) return

      const newDate = new Date(selectedDateTime)
      let hours = newDate.getHours()

      if (period === "AM" && hours >= 12) {
        hours -= 12
      } else if (period === "PM" && hours < 12) {
        hours += 12
      }

      newDate.setHours(hours)
      setSelectedDateTime(newDate)
      setDate(newDate)
    },
    [selectedDateTime, setDate],
  )

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
        <div className="p-4 pb-0">
          <Calendar mode="single" selected={selectedDateTime} onSelect={handleDateChange} initialFocus />
        </div>
        {selectedDateTime && (
          <div className="border-t border-border p-4 flex items-end gap-2">
            <div className="grid gap-1 text-center">
              <div className="text-sm">Time</div>
              <Input
                type="time"
                value={format(selectedDateTime, "HH:mm")}
                onChange={handleTimeChange}
                className="w-[120px]"
              />
            </div>
            <div className="grid gap-1 text-center">
              <div className="text-sm">Period</div>
              <Select
                value={selectedDateTime.getHours() >= 12 ? "PM" : "AM"}
                onValueChange={(value) => handlePeriodChange(value as "AM" | "PM")}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
