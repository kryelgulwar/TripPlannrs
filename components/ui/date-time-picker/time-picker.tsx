"use client"

import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePickerContent } from "./time-picker-content"
import { format } from "date-fns"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const updateTime = (time: { hour: number; minute: number }) => {
    if (!date) return

    const newDate = new Date(date)
    newDate.setHours(time.hour)
    newDate.setMinutes(time.minute)
    setDate(newDate)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {date ? format(date, "HH:mm") : <span>Pick a time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <TimePickerContent
          value={date ? { hour: date.getHours(), minute: date.getMinutes() } : { hour: 0, minute: 0 }}
          onChange={updateTime}
        />
      </PopoverContent>
    </Popover>
  )
}
