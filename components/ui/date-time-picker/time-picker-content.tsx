"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerContentProps {
  value?: {
    hour: number
    minute: number
  }
  onChange?: (value: { hour: number; minute: number }) => void
  hourRef?: React.RefObject<HTMLInputElement>
  minuteRef?: React.RefObject<HTMLInputElement>
}

export function TimePickerContent({ value, onChange, hourRef, minuteRef }: TimePickerContentProps) {
  const [hour, setHour] = React.useState<number>(value?.hour || 0)
  const [minute, setMinute] = React.useState<number>(value?.minute || 0)
  const [period, setPeriod] = React.useState<"AM" | "PM">(hour >= 12 ? "PM" : "AM")

  // Update the hour, minute when the value changes
  React.useEffect(() => {
    if (!value) return
    setHour(value.hour % 12 || 12)
    setMinute(value.minute)
    setPeriod(value.hour >= 12 ? "PM" : "AM")
  }, [value])

  // Update the parent component when hour, minute, or period changes
  const handleHourChange = (newHour: number) => {
    setHour(newHour)
    if (onChange) {
      onChange({
        hour: period === "PM" ? (newHour === 12 ? 12 : newHour + 12) : newHour === 12 ? 0 : newHour,
        minute,
      })
    }
  }

  const handleMinuteChange = (newMinute: number) => {
    setMinute(newMinute)
    if (onChange) {
      onChange({
        hour: period === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour,
        minute: newMinute,
      })
    }
  }

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod)
    if (onChange) {
      onChange({
        hour: newPeriod === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour,
        minute,
      })
    }
  }

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
            const value = Number.parseInt(e.target.value)
            if (isNaN(value)) {
              return
            }
            if (value < 1) {
              handleHourChange(1)
            } else if (value > 12) {
              handleHourChange(12)
            } else {
              handleHourChange(value)
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
            const value = Number.parseInt(e.target.value)
            if (isNaN(value)) {
              return
            }
            if (value < 0) {
              handleMinuteChange(0)
            } else if (value > 59) {
              handleMinuteChange(59)
            } else {
              handleMinuteChange(value)
            }
          }}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs">
          Period
        </Label>
        <Select value={period} onValueChange={(value) => handlePeriodChange(value as "AM" | "PM")}>
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
