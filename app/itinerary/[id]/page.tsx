"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getItineraryById } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ArrowLeft, Printer, Share2 } from "lucide-react"
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
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading itinerary...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // If no itinerary found
  if (!itinerary) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Itinerary Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The itinerary you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{itinerary.title}</h1>
            <div className="flex items-center mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{itinerary.destination}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {itinerary.startDate && itinerary.endDate
                    ? `${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(
                        itinerary.endDate,
                      ).toLocaleDateString()}`
                    : "Dates not specified"}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{itinerary.duration ? `${itinerary.duration} days` : "Duration not specified"}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {itinerary.status || "Draft"}
              </div>
            </CardContent>
          </Card>
        </div>

        {itinerary.preferences && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Your travel preferences and interests</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{itinerary.preferences}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Itinerary Details</CardTitle>
            <CardDescription>Your day-by-day travel plan</CardDescription>
          </CardHeader>
          <CardContent>
            {/* If there's no itinerary data yet */}
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Your itinerary is being generated. Check back soon!</p>
              <Button>Refresh</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
