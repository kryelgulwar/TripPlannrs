"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimePickerContentProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  hourRef?: React.RefObject<HTMLInputElement>
  minuteRef?: React.RefObject<HTMLInputElement>
}

export function TimePickerContent({ date, setDate, hourRef, minuteRef }: TimePickerContentProps) {
  const [hour, setHour] = React.useState<string>(date ? String(date.getHours()).padStart(2, "0") : "12")
  const [minute, setMinute] = React.useState<string>(date ? String(date.getMinutes()).padStart(2, "0") : "00")
  const [period, setPeriod] = React.useState<"AM" | "PM">(date ? (date.getHours() >= 12 ? "PM" : "AM") : "AM")

  React.useEffect(() => {
    if (!date) return

    setHour(
      period === "AM"
        ? String(date.getHours() % 12 || 12).padStart(2, "0")
        : String(date.getHours() % 12 || 12).padStart(2, "0"),
    )
    setMinute(String(date.getMinutes()).padStart(2, "0"))
    setPeriod(date.getHours() >= 12 ? "PM" : "AM")
  }, [date, period])

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setHour("")
      return
    }

    const valueNum = Number.parseInt(value, 10)
    if (isNaN(valueNum)) return

    if (valueNum > 12) {
      setHour("12")
    } else if (valueNum < 1) {
      setHour("01")
    } else {
      setHour(String(valueNum).padStart(2, "0"))
    }

    if (value.length === 2 && minuteRef?.current) {
      minuteRef.current.focus()
    }

    updateDate(valueNum, Number.parseInt(minute, 10), period)
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setMinute("")
      return
    }

    const valueNum = Number.parseInt(value, 10)
    if (isNaN(valueNum)) return

    if (valueNum > 59) {
      setMinute("59")
    } else if (valueNum < 0) {
      setMinute("00")
    } else {
      setMinute(String(valueNum).padStart(2, "0"))
    }

    updateDate(Number.parseInt(hour, 10), valueNum, period)
  }

  const handlePeriodChange = (value: "AM" | "PM") => {
    setPeriod(value)
    updateDate(Number.parseInt(hour, 10), Number.parseInt(minute, 10), value)
  }

  const updateDate = (hour: number, minute: number, period: "AM" | "PM") => {
    if (!date) {
      const now = new Date()
      date = now
    }

    const newDate = new Date(date)
    let hours = hour
    if (period === "PM" && hour < 12) {
      hours += 12
    } else if (period === "AM" && hour === 12) {
      hours = 0
    }

    newDate.setHours(hours)
    newDate.setMinutes(minute)
    setDate(newDate)
  }

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <div className="text-sm">Hours</div>
        <Input ref={hourRef} value={hour} onChange={handleHourChange} className="w-[4rem]" maxLength={2} />
      </div>
      <div className="grid gap-1 text-center">
        <div className="text-sm">Minutes</div>
        <Input ref={minuteRef} value={minute} onChange={handleMinuteChange} className="w-[4rem]" maxLength={2} />
      </div>
      <div className="grid gap-1">
        <div className="text-sm">Period</div>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[4.5rem]">
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
