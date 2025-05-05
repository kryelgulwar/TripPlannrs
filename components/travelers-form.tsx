"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"

interface TravelersFormProps {
  formData: any
  updateFormData: (data: any) => void
  errors?: Record<string, string>
}

export function TravelersForm({ formData, updateFormData, errors = {} }: TravelersFormProps) {
  const [travelGroupType, setTravelGroupType] = useState(formData.travelGroupType || "Solo Traveler")
  const [travelersCount, setTravelersCount] = useState(formData.travelersCount || 1)
  const [isDisabled, setIsDisabled] = useState(true)
  const [minTravelers, setMinTravelers] = useState(1)

  // Update travelers count and constraints based on group type
  useEffect(() => {
    if (travelGroupType === "Solo Traveler") {
      setTravelersCount(1)
      setMinTravelers(1)
      setIsDisabled(true)
    } else if (travelGroupType === "Couple") {
      setTravelersCount(2)
      setMinTravelers(2)
      setIsDisabled(true)
    } else {
      // For Family with Kids, Group of Friends, Business Trip, Other
      setTravelersCount(Math.max(3, travelersCount))
      setMinTravelers(2)
      setIsDisabled(false)
    }
  }, [travelGroupType, travelersCount])

  // Update parent form data when component mounts or when values change
  useEffect(() => {
    updateFormData({
      travelGroupType,
      travelersCount,
    })
    // We intentionally exclude updateFormData from dependencies to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelGroupType, travelersCount])

  const handleSliderChange = (value: number[]) => {
    setTravelersCount(value[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= minTravelers) {
      setTravelersCount(value)
    }
  }

  const handleGroupTypeChange = (value: string) => {
    setTravelGroupType(value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 2 of 6: Who's Traveling?</h2>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Travel Group Type</Label>
          <RadioGroup
            value={travelGroupType}
            onValueChange={handleGroupTypeChange}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="Solo Traveler" id="solo" />
              <Label htmlFor="solo" className="cursor-pointer flex-1">
                <div className="font-medium">Solo Traveler</div>
                <div className="text-sm text-muted-foreground">Traveling on your own</div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="Couple" id="couple" />
              <Label htmlFor="couple" className="cursor-pointer flex-1">
                <div className="font-medium">Couple</div>
                <div className="text-sm text-muted-foreground">Traveling with a partner</div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="Family with Kids" id="family" />
              <Label htmlFor="family" className="cursor-pointer flex-1">
                <div className="font-medium">Family with Kids</div>
                <div className="text-sm text-muted-foreground">Traveling with children</div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="Group of Friends" id="friends" />
              <Label htmlFor="friends" className="cursor-pointer flex-1">
                <div className="font-medium">Group of Friends</div>
                <div className="text-sm text-muted-foreground">Traveling with friends</div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="Business Trip" id="business" />
              <Label htmlFor="business" className="cursor-pointer flex-1">
                <div className="font-medium">Business Trip</div>
                <div className="text-sm text-muted-foreground">Traveling for work</div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="Other" id="other" />
              <Label htmlFor="other" className="cursor-pointer flex-1">
                <div className="font-medium">Other</div>
                <div className="text-sm text-muted-foreground">Custom travel group</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">Number of Travelers</Label>
          <div className="space-y-4">
            <Slider
              disabled={isDisabled}
              value={[travelersCount]}
              min={minTravelers}
              max={10}
              step={1}
              onValueChange={handleSliderChange}
              className={isDisabled ? "opacity-50" : ""}
            />
            <div className="flex items-center space-x-4">
              <Input
                type="number"
                value={travelersCount}
                onChange={handleInputChange}
                min={minTravelers}
                disabled={isDisabled}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                {isDisabled ? (
                  travelGroupType === "Solo Traveler" ? (
                    <span>Fixed at 1 traveler for solo trips</span>
                  ) : (
                    <span>Fixed at 2 travelers for couples</span>
                  )
                ) : (
                  <span>Minimum {minTravelers} travelers for this group type</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
