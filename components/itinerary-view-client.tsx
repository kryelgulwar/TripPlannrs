"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ItineraryHeader } from "@/components/itinerary-header"
import { ItineraryTabs } from "@/components/itinerary-tabs"
import { DayPlan } from "@/components/day-plan"
import { Button } from "@/components/ui/button"
import { Trash2, Printer, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { getItinerary, deleteItinerary, convertTimestamps } from "@/lib/db"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast-provider"
import { LoadingPage } from "@/components/loading-page"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Add import for the data validator
import { validateItineraryData } from "@/lib/data-validator"

interface ItineraryViewClientProps {
  itineraryId: string
}

export default function ItineraryViewClient({ itineraryId }: ItineraryViewClientProps) {
  const { user, loading } = useAuth()
  const [itinerary, setItinerary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Add a state for debug mode
  // const [debugMode, setDebugMode] = useState(false)

  // Update the fetchItinerary function to use the validator
  const fetchItinerary = async () => {
    if (!user || !itineraryId) {
      console.log("fetchItinerary: Missing user or itineraryId", { user: !!user, itineraryId })
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      console.log("fetchItinerary: Fetching itinerary with ID:", itineraryId)

      const itineraryData = await getItinerary(itineraryId)

      // Check if the itinerary belongs to the current user
      if (itineraryData.userId !== user.uid) {
        console.error("fetchItinerary: User ID mismatch", {
          itineraryUserId: itineraryData.userId,
          currentUserId: user.uid,
        })
        setError("You don't have permission to view this itinerary.")
        toast({
          title: "Access denied",
          description: "You don't have permission to view this itinerary.",
          variant: "destructive",
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
        return
      }

      // Convert Firestore timestamps to JS Date objects
      console.log("fetchItinerary: Converting timestamps")
      const formattedItinerary = convertTimestamps(itineraryData)

      // Log the itinerary data to debug
      console.log("fetchItinerary: Raw itinerary data:", JSON.stringify(itineraryData, null, 2))
      console.log("fetchItinerary: Formatted itinerary data:", JSON.stringify(formattedItinerary, null, 2))

      // Validate and sanitize the data
      console.log("fetchItinerary: Validating and sanitizing data")
      const sanitizedItinerary = validateItineraryData(formattedItinerary)

      if (!sanitizedItinerary) {
        throw new Error("Failed to validate itinerary data")
      }

      console.log("fetchItinerary: Sanitized itinerary:", JSON.stringify(sanitizedItinerary, null, 2))
      setItinerary(sanitizedItinerary)
    } catch (error) {
      console.error("fetchItinerary: Error fetching itinerary:", error)
      setError("Failed to load itinerary. It may have been deleted or you don't have access.")
      toast({
        title: "Error",
        description: "Failed to load itinerary. It may have been deleted or you don't have access.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    if (user && itineraryId) {
      fetchItinerary()
    }
  }, [user, loading, itineraryId, router])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchItinerary()
  }

  const handleDelete = async () => {
    if (!itineraryId) return

    try {
      setIsDeleting(true)
      await deleteItinerary(itineraryId)
      toast({
        title: "Itinerary deleted",
        description: "Your itinerary has been successfully deleted.",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to delete itinerary. Please try again.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <LoadingPage />
        </div>
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">{error || "Itinerary not found"}</h2>
          <p className="mb-6">
            {error
              ? "You'll be redirected to the dashboard shortly."
              : "The itinerary you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Add this right after the Navbar in the return statement
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>

        {/* Remove this line */}
        {/* {debugMode && <DataInspector data={itinerary} title="Itinerary Data" />} */}

        <ItineraryHeader itinerary={itinerary} />

        <ItineraryTabs itinerary={itinerary} />

        <div className="mt-8 space-y-8">
          {itinerary.days && itinerary.days.length > 0 ? (
            itinerary.days.map((day: any) => <DayPlan key={day.dayNumber} day={day} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No day-by-day itinerary available.</p>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2" disabled={isDeleting}>
                <Trash2 size={18} />
                {isDeleting ? "Deleting..." : "Delete Itinerary"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your itinerary.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Link href={`/itinerary/${itineraryId}/view/pdf`}>
            <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Printer size={18} />
              Print Itinerary
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
