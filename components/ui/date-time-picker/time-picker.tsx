"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerContent } from "./time-picker-content"

interface TimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<Date | undefined>(date)

  React.useEffect(() => {
    setSelectedTime(date)
  }, [date])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <Clock className="mr-2 h-4 w-4" />
          {date ? (
            <span>{date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          ) : (
            <span>Pick a time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <TimePickerContent date={selectedTime} setDate={setDate} />
      </PopoverContent>
    </Popover>
  )
}
