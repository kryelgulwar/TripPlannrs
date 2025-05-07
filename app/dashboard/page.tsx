"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getUserItineraries } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import Link from "next/link"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [itineraries, setItineraries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirect if not logged in and not loading
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Fetch user itineraries if logged in
    const fetchItineraries = async () => {
      if (user) {
        try {
          const userItineraries = await getUserItineraries(user.uid)
          setItineraries(userItineraries)
        } catch (error) {
          console.error("Error fetching itineraries:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    if (user) {
      fetchItineraries()
    } else {
      setIsLoading(false)
    }
  }, [user, loading, router])

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

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Trips</h1>
          <Link href="/generate" className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Create New Trip
          </Link>
        </div>

        {itineraries.length === 0 ? (
          <div className="text-center py-12 border rounded-md">
            <p className="mb-4">You haven't created any trips yet.</p>
            <Link href="/generate" className="bg-blue-600 text-white px-4 py-2 rounded-md">
              Create Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <div key={itinerary.id} className="border rounded-md p-4">
                <h3 className="font-semibold text-lg">{itinerary.title || "Untitled Trip"}</h3>
                <p className="text-gray-600">{itinerary.destination || "Multiple destinations"}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {itinerary.startDate && itinerary.endDate
                    ? `${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(
                        itinerary.endDate,
                      ).toLocaleDateString()}`
                    : "Dates not specified"}
                </div>
                <div className="mt-4">
                  <Link href={`/itinerary/${itinerary.id}`} className="text-blue-600 hover:underline">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
