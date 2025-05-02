"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface BudgetFormProps {
  formData: any
  updateFormData: (data: any) => void
}

export function BudgetForm({ formData, updateFormData }: BudgetFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 3 of 6: Budget Preferences</h2>

      <div>
        <Label>What's your budget type?</Label>
        <RadioGroup
          value={formData.budgetType}
          onValueChange={(value) => updateFormData({ budgetType: value })}
          className="mt-4 space-y-4"
        >
          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <RadioGroupItem value="Cheap" id="cheap" className="mt-1" />
            <div>
              <Label htmlFor="cheap" className="text-base font-medium">
                Budget / Cheap
              </Label>
              <p className="text-sm text-muted-foreground">
                Hostels, street food, public transportation, free activities
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <RadioGroupItem value="Moderate" id="moderate" className="mt-1" />
            <div>
              <Label htmlFor="moderate" className="text-base font-medium">
                Moderate
              </Label>
              <p className="text-sm text-muted-foreground">
                3-star hotels, casual restaurants, mix of paid and free activities
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
            <RadioGroupItem value="Luxury" id="luxury" className="mt-1" />
            <div>
              <Label htmlFor="luxury" className="text-base font-medium">
                Luxury
              </Label>
              <p className="text-sm text-muted-foreground">
                4-5 star hotels, fine dining, premium experiences, private transportation
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
