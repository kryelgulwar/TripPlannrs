"use client"

import type React from "react"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"

interface ExtrasFormProps {
  formData: any
  updateFormData: (data: any) => void
  errors?: Record<string, string>
}

export function ExtrasForm({ formData, updateFormData, errors = {} }: ExtrasFormProps) {
  const [additionalOptions, setAdditionalOptions] = useState({
    familyFriendly: false,
    offBeatenPath: false,
    sustainable: false,
  })

  useEffect(() => {
    // Initialize from formData if available
    if (formData.additionalOptions) {
      setAdditionalOptions(formData.additionalOptions)
    }
  }, [formData.additionalOptions])

  const handleSpecialRequestsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ specialRequests: e.target.value })
  }

  const handleAccessibilityChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({ accessibility: e.target.value })
  }

  const handleOptionChange = (option: keyof typeof additionalOptions, checked: boolean) => {
    const newOptions = { ...additionalOptions, [option]: checked }
    setAdditionalOptions(newOptions)
    updateFormData({ additionalOptions: newOptions })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 6 of 6: Additional Preferences</h2>

      <div>
        <Label htmlFor="special-requests">Special Requests or Preferences</Label>
        <Textarea
          id="special-requests"
          placeholder="Any specific places you want to visit, activities you want to do, or other preferences..."
          className="mt-2"
          rows={4}
          value={formData.specialRequests || ""}
          onChange={handleSpecialRequestsChange}
        />
      </div>

      <div>
        <Label htmlFor="accessibility">Accessibility Requirements (Optional)</Label>
        <Textarea
          id="accessibility"
          placeholder="E.g., wheelchair accessibility, limited mobility considerations, etc."
          className="mt-2"
          rows={3}
          value={formData.accessibility || ""}
          onChange={handleAccessibilityChange}
        />
      </div>

      <div className="space-y-4">
        <Label>Additional Options</Label>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="family-friendly"
            checked={additionalOptions.familyFriendly}
            onCheckedChange={(checked) => handleOptionChange("familyFriendly", !!checked)}
          />
          <div>
            <Label htmlFor="family-friendly" className="font-medium">
              Family-Friendly Activities
            </Label>
            <p className="text-sm text-muted-foreground">Include activities suitable for children</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="off-beaten-path"
            checked={additionalOptions.offBeatenPath}
            onCheckedChange={(checked) => handleOptionChange("offBeatenPath", !!checked)}
          />
          <div>
            <Label htmlFor="off-beaten-path" className="font-medium">
              Off the Beaten Path
            </Label>
            <p className="text-sm text-muted-foreground">Include lesser-known attractions and local experiences</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="sustainable"
            checked={additionalOptions.sustainable}
            onCheckedChange={(checked) => handleOptionChange("sustainable", !!checked)}
          />
          <div>
            <Label htmlFor="sustainable" className="font-medium">
              Sustainable Travel Options
            </Label>
            <p className="text-sm text-muted-foreground">
              Prioritize eco-friendly and sustainable activities and accommodations
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
