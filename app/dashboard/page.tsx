"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getUserItineraries } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Calendar, MapPin, Clock } from "lucide-react"
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
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your trips...</p>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="text-muted-foreground mt-1">Manage and view your travel itineraries</p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link href="/generate">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Trip
            </Link>
          </Button>
        </div>

        {itineraries.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                You haven't created any travel itineraries yet. Create your first trip to get started.
              </p>
              <Button asChild>
                <Link href="/generate">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Trip
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((itinerary) => (
              <Card key={itinerary.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle>{itinerary.title || "Untitled Trip"}</CardTitle>
                  <CardDescription className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    {itinerary.destination || "Multiple destinations"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    {itinerary.startDate && itinerary.endDate
                      ? `${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(
                          itinerary.endDate,
                        ).toLocaleDateString()}`
                      : "Dates not specified"}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    {itinerary.duration ? `${itinerary.duration} days` : "Duration not specified"}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/itinerary/${itinerary.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
