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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <Link
            href="/generate"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Trip
          </Link>
        </div>

        {itineraries.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-16 sm:px-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No trips</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new trip.</p>
              <div className="mt-6">
                <Link
                  href="/generate"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create New Trip
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <div key={itinerary.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{itinerary.title || "Untitled Trip"}</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>{itinerary.destination || "Multiple destinations"}</p>
                  </div>
                  <div className="mt-3 text-sm">
                    {itinerary.startDate && itinerary.endDate ? (
                      <p className="text-gray-500">
                        {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                        {new Date(itinerary.endDate).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-gray-500">Dates not specified</p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href={`/itinerary/${itinerary.id}`} className="font-medium text-blue-600 hover:text-blue-500">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
