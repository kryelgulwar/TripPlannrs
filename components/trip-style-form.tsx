"use client"

import { useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface TripStyleFormProps {
  formData: any
  updateFormData: (data: any) => void
  errors?: Record<string, string>
}

export function TripStyleForm({ formData, updateFormData, errors = {} }: TripStyleFormProps) {
  const tripStyles = [
    { id: "cultural", label: "Cultural & Historical" },
    { id: "nature", label: "Nature & Outdoors" },
    { id: "food", label: "Food & Culinary" },
    { id: "adventure", label: "Adventure & Sports" },
    { id: "relaxation", label: "Relaxation & Wellness" },
    { id: "shopping", label: "Shopping & Entertainment" },
    { id: "photography", label: "Photography Spots" },
    { id: "nightlife", label: "Nightlife & Bars" },
  ]

  // Initialize tripStyles if it doesn't exist
  useEffect(() => {
    if (!Array.isArray(formData.tripStyles)) {
      updateFormData({ tripStyles: [] })
    }
  }, [formData.tripStyles, updateFormData])

  const handleTripStyleChange = (checked: boolean, value: string) => {
    if (!Array.isArray(formData.tripStyles)) {
      const newStyles = checked ? [value] : []
      updateFormData({ tripStyles: newStyles })
      return
    }

    if (checked) {
      updateFormData({ tripStyles: [...formData.tripStyles, value] })
    } else {
      updateFormData({
        tripStyles: formData.tripStyles.filter((style: string) => style !== value),
      })
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 4 of 6: Trip Style</h2>

      <div className="space-y-6">
        <div>
          <Label className="mb-2 block">What are you interested in? (Select up to 4)</Label>
          <div className="grid gap-4 sm:grid-cols-2">
            {tripStyles.map((style) => (
              <div key={style.id} className="flex items-center space-x-2">
                <Checkbox
                  id={style.id}
                  checked={Array.isArray(formData.tripStyles) && formData.tripStyles.includes(style.id)}
                  onCheckedChange={(checked) => handleTripStyleChange(!!checked, style.id)}
                  disabled={
                    !Array.isArray(formData.tripStyles) ||
                    (!formData.tripStyles.includes(style.id) && formData.tripStyles.length >= 4)
                  }
                />
                <Label htmlFor={style.id}>{style.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Trip Pace</Label>
          <RadioGroup
            value={formData.pace || "Balanced"}
            onValueChange={(value) => updateFormData({ pace: value })}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="Light" id="light" className="mt-1" />
              <div>
                <Label htmlFor="light" className="text-base font-medium">
                  Light
                </Label>
                <p className="text-sm text-muted-foreground">Few activities per day, plenty of free time</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="Balanced" id="balanced" className="mt-1" />
              <div>
                <Label htmlFor="balanced" className="text-base font-medium">
                  Balanced
                </Label>
                <p className="text-sm text-muted-foreground">Mix of planned activities and free time</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="Full" id="full" className="mt-1" />
              <div>
                <Label htmlFor="full" className="text-base font-medium">
                  Full
                </Label>
                <p className="text-sm text-muted-foreground">Packed schedule, see as much as possible</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="mb-2 block">Wake-up Time</Label>
          <RadioGroup
            value={formData.wakeUpTime || "Mid"}
            onValueChange={(value) => updateFormData({ wakeUpTime: value })}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Early" id="early" />
              <Label htmlFor="early">Early (6-8 AM)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Mid" id="mid" />
              <Label htmlFor="mid">Mid (8-10 AM)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Late" id="late" />
              <Label htmlFor="late">Late (After 10 AM)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
