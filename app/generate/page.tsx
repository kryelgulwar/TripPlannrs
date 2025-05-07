"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createItinerary } from "@/lib/db"
import { ArrowRight, Loader2 } from "lucide-react"

export default function Generate() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    preferences: "",
  })

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      router.push("/signin")
    }
  }, [user, loading, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    try {
      setIsSubmitting(true)

      // Calculate duration in days
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const durationMs = end.getTime() - start.getTime()
      const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24))

      // Create new itinerary
      const itineraryData = {
        title: `Trip to ${formData.destination}`,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: durationDays,
        preferences: formData.preferences,
        status: "draft",
      }

      const newItinerary = await createItinerary(itineraryData, user.uid)

      if (newItinerary) {
        // Redirect to the new itinerary
        router.push(`/itinerary/${newItinerary.id}`)
      }
    } catch (error) {
      console.error("Error creating itinerary:", error)
      alert("Failed to create itinerary. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create New Trip</h1>

          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>
                Enter your trip details and preferences to generate a personalized itinerary.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    name="destination"
                    placeholder="e.g., Tokyo, Japan"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferences">Preferences</Label>
                  <Textarea
                    id="preferences"
                    name="preferences"
                    placeholder="Tell us about your interests, budget, travel style, etc."
                    value={formData.preferences}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Itinerary
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
