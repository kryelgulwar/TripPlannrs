"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerContentProps {
  date?: Date
  setDate?: (date: Date | undefined) => void
  value?: {
    hour: number
    minute: number
  }
  onChange?: (value: { hour: number; minute: number }) => void
  hourRef?: React.RefObject<HTMLInputElement>
  minuteRef?: React.RefObject<HTMLInputElement>
}

export function TimePickerContent({ date, setDate, value, onChange, hourRef, minuteRef }: TimePickerContentProps) {
  // Initialize with either the value prop or from the date
  const [hour, setHour] = React.useState<number>(value ? value.hour % 12 || 12 : date ? date.getHours() % 12 || 12 : 12)
  const [minute, setMinute] = React.useState<number>(value ? value.minute : date ? date.getMinutes() : 0)
  const [period, setPeriod] = React.useState<"AM" | "PM">(
    value ? (value.hour >= 12 ? "PM" : "AM") : date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM",
  )

  // Update the date when the hour, minute, or period changes
  React.useEffect(() => {
    if (onChange) {
      onChange({
        hour: period === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour,
        minute,
      })
    } else if (date && setDate) {
      const newDate = new Date(date)
      newDate.setHours(period === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour)
      newDate.setMinutes(minute)
      setDate(newDate)
    }
  }, [hour, minute, period, date, setDate, onChange])

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <Input
          ref={hourRef}
          id="hours"
          className="w-16 text-center"
          value={hour.toString().padStart(2, "0")}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value, 10)
            if (isNaN(value)) {
              return
            }
            if (value < 1) {
              setHour(1)
            } else if (value > 12) {
              setHour(12)
            } else {
              setHour(value)
            }
          }}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <Input
          ref={minuteRef}
          id="minutes"
          className="w-16 text-center"
          value={minute.toString().padStart(2, "0")}
          onChange={(e) => {
            const value = Number.parseInt(e.target.value, 10)
            if (isNaN(value)) {
              return
            }
            if (value < 0) {
              setMinute(0)
            } else if (value > 59) {
              setMinute(59)
            } else {
              setMinute(value)
            }
          }}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs">
          Period
        </Label>
        <Select value={period} onValueChange={(value: string) => setPeriod(value as "AM" | "PM")}>
          <SelectTrigger id="period" className="w-16">
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
