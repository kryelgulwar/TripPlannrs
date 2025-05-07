"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getItineraryById } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function ItineraryDetail({ params }) {
  const { id } = params
  const { user, loading } = useAuth()
  const router = useRouter()
  const [itinerary, setItinerary] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Fetch itinerary data
    const fetchItinerary = async () => {
      if (user && id) {
        try {
          const itineraryData = await getItineraryById(id)

          // Check if itinerary exists and belongs to the current user
          if (!itineraryData || itineraryData.userId !== user.uid) {
            router.push("/dashboard")
            return
          }

          setItinerary(itineraryData)
        } catch (error) {
          console.error("Error fetching itinerary:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchItinerary()
    } else {
      setIsLoading(false)
    }
  }, [user, loading, router, id])

  // Show loading state
  if (loading || isLoading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center py-12">Loading...</p>
        </div>
      </div>
    )
  }

  // If no itinerary found
  if (!itinerary) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-xl font-bold mb-4">Itinerary Not Found</h1>
            <p className="mb-6">
              The itinerary you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Back to Dashboard
            </Link>
          </div>
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

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{itinerary.title}</h1>
          <p className="text-gray-600">{itinerary.destination}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-2">Dates</h2>
            <p>
              {itinerary.startDate && itinerary.endDate
                ? `${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(
                    itinerary.endDate,
                  ).toLocaleDateString()}`
                : "Dates not specified"}
            </p>
          </div>
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-2">Duration</h2>
            <p>{itinerary.duration ? `${itinerary.duration} days` : "Duration not specified"}</p>
          </div>
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-2">Status</h2>
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {itinerary.status || "Draft"}
            </span>
          </div>
        </div>

        {itinerary.preferences && (
          <div className="border rounded-md p-4 mb-6">
            <h2 className="font-semibold mb-2">Preferences</h2>
            <p>{itinerary.preferences}</p>
          </div>
        )}

        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Itinerary Details</h2>
          <div className="text-center py-8">
            <p className="mb-4">Your itinerary is being generated. Check back soon!</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Refresh</button>
          </div>
        </div>
      </div>
    </div>
  )
}
