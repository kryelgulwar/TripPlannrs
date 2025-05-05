"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function GeneratePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [destination, setDestination] = useState("")
  const [budget, setBudget] = useState("")
  const [travelers, setTravelers] = useState("2")
  const [preferences, setPreferences] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to generate an itinerary.",
        variant: "destructive",
      })
      router.push("/signin")
      return
    }

    if (!destination || !dateRange?.from || !dateRange?.to) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Here we would normally call an API to generate the itinerary
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Redirect to the dashboard
      toast({
        title: "Itinerary generated",
        description: "Your itinerary has been successfully generated.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error generating itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Generate Itinerary</CardTitle>
          <CardDescription>Fill in the details below to generate your personalized travel itinerary.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, France"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Travel Dates</Label>
              <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input
                  id="budget"
                  placeholder="e.g., 2000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers">Number of Travelers</Label>
                <Input
                  id="travelers"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  type="number"
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferences">Preferences & Special Requests</Label>
              <Textarea
                id="preferences"
                placeholder="Tell us about your interests, dietary restrictions, accessibility needs, etc."
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating...
                </>
              ) : (
                "Generate Itinerary"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
