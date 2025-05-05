"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface TimePickerContentProps {
  value: { hour: number; minute: number }
  onChange: (value: { hour: number; minute: number }) => void
  className?: string
}

export function TimePickerContent({ value, onChange, className }: TimePickerContentProps) {
  const [hour, setHour] = React.useState(value.hour)
  const [minute, setMinute] = React.useState(value.minute)
  const [period, setPeriod] = React.useState<"AM" | "PM">(value.hour >= 12 ? "PM" : "AM")

  // Update internal state when value changes
  React.useEffect(() => {
    setHour(value.hour > 12 ? value.hour - 12 : value.hour === 0 ? 12 : value.hour)
    setMinute(value.minute)
    setPeriod(value.hour >= 12 ? "PM" : "AM")
  }, [value])

  // Handle hour change
  const handleHourChange = (newHour: number) => {
    setHour(newHour)
    const adjustedHour =
      period === "PM" && newHour < 12 ? newHour + 12 : period === "AM" && newHour === 12 ? 0 : newHour
    onChange({ hour: adjustedHour, minute })
  }

  // Handle minute change
  const handleMinuteChange = (newMinute: number) => {
    setMinute(newMinute)
    onChange({ hour, minute: newMinute })
  }

  // Handle period change
  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod)
    if (newPeriod === "PM" && hour < 12) {
      onChange({ hour: hour + 12, minute })
    } else if (newPeriod === "AM" && hour === 12) {
      onChange({ hour: 0, minute })
    } else if (newPeriod === "AM" && hour > 12) {
      onChange({ hour: hour - 12, minute })
    }
  }

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <div className="grid gap-1 text-center">
        <div className="text-sm">Hours</div>
        <Input
          value={hour.toString().padStart(2, "0")}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value >= 1 && value <= 12) {
              handleHourChange(value)
            }
          }}
          className="w-12 h-8"
          type="number"
          min={1}
          max={12}
        />
      </div>
      <div className="grid gap-1 text-center">
        <div className="text-sm">Minutes</div>
        <Input
          value={minute.toString().padStart(2, "0")}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value)
            if (!isNaN(value) && value >= 0 && value <= 59) {
              handleMinuteChange(value)
            }
          }}
          className="w-12 h-8"
          type="number"
          min={0}
          max={59}
        />
      </div>
      <div className="grid gap-1">
        <div className="text-sm">Period</div>
        <Select value={period} onValueChange={(value) => handlePeriodChange(value as "AM" | "PM")}>
          <SelectTrigger className="w-[60px] h-8">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
