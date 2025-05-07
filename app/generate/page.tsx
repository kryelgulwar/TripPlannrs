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
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center py-12">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Create New Trip</h1>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="border rounded-md p-6">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-4">
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Generate Itinerary"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
