"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { ItineraryHeader } from "@/components/itinerary-header"
import { ItineraryTabs } from "@/components/itinerary-tabs"
import { DayPlan } from "@/components/day-plan"
import { Button } from "@/components/ui/button"
import { Trash2, Printer } from "lucide-react"
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

export default function ItineraryView({ params }: { params: { id: string } }) {
  const { user, loading } = useAuth()
  const [itinerary, setItinerary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/signin")
      return
    }

    // Fetch itinerary data
    const fetchItinerary = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        setError(null)
        const itineraryData = await getItinerary(params.id)

        // Check if the itinerary belongs to the current user
        if (itineraryData.userId !== user.uid) {
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
        const formattedItinerary = convertTimestamps(itineraryData)
        setItinerary(formattedItinerary)
      } catch (error) {
        console.error("Error fetching itinerary:", error)
        setError("Failed to load itinerary. It may have been deleted or you don't have access.")
        toast({
          title: "Error",
          description: "Failed to load itinerary. It may have been deleted or you don't have access.",
          variant: "destructive",
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchItinerary()
    }
  }, [user, loading, params.id, router, toast])

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteItinerary(params.id)
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
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ItineraryHeader itinerary={itinerary} />

        <ItineraryTabs itinerary={itinerary} />

        <div className="mt-8 space-y-8">
          {itinerary.days && itinerary.days.map((day: any) => <DayPlan key={day.dayNumber} day={day} />)}
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

          <Link href={`/itinerary/${params.id}/pdf`}>
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
