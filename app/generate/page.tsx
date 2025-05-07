"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { createItinerary } from "@/lib/db"
import Link from "next/link"

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
            <p>Loading...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Create New Trip</h1>

        <div className="border rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                Destination
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                placeholder="e.g., Tokyo, Japan"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-1">
                Preferences
              </label>
              <textarea
                id="preferences"
                name="preferences"
                placeholder="Tell us about your interests, budget, travel style, etc."
                value={formData.preferences}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Generate Itinerary"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
