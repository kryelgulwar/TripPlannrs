"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ItineraryGrid } from "@/components/itinerary-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getUserItineraries, convertTimestamps } from "@/lib/db"
import { useRouter } from "next/navigation"
import { LoadingPage } from "@/components/loading-page"
import { useToast } from "@/components/ui/toast-provider"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [itineraries, setItineraries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Fetch user's itineraries
    const fetchItineraries = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const userItineraries = await getUserItineraries(user.uid)
        // Convert Firestore timestamps to JS Date objects
        const formattedItineraries = userItineraries.map((itinerary) => convertTimestamps(itinerary))
        setItineraries(formattedItineraries)
      } catch (error) {
        console.error("Error fetching itineraries:", error)
        toast({
          title: "Error",
          description: "Failed to load your itineraries. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchItineraries()
    }
  }, [user, loading, router, toast])

  if (loading || (isLoading && user)) {
    return <LoadingPage />
  }

  if (!user) {
    return null // This will be handled by the redirect
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader title="My Trips" />

        <div className="mb-6">
          <Link href="/generate">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <PlusCircle size={18} />
              Create New Itinerary
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        ) : itineraries.length > 0 ? (
          <ItineraryGrid itineraries={itineraries} />
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-medium mb-2">No trips yet</h3>
            <p className="text-muted-foreground mb-6">Create your first itinerary to get started</p>
            <Link href="/generate">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Create Your First Itinerary
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
