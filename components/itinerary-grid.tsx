"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import Image from "next/image"
import { deleteItinerary } from "@/lib/db"
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
import { useToast } from "@/components/ui/use-toast"

interface Itinerary {
  id: string
  destination: string
  startDate: Date
  endDate: Date
  image?: string
}

interface ItineraryGridProps {
  itineraries: Itinerary[]
}

export function ItineraryGrid({ itineraries }: ItineraryGridProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [localItineraries, setLocalItineraries] = useState<Itinerary[]>(itineraries)
  const { toast } = useToast()

  const formatDateRange = (start: Date, end: Date) => {
    const startMonth = start.toLocaleString("default", { month: "short" })
    const endMonth = end.toLocaleString("default", { month: "short" })

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`
    }

    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`
  }

  const handleDelete = async (itineraryId: string) => {
    try {
      setDeletingId(itineraryId)
      await deleteItinerary(itineraryId)
      setLocalItineraries(localItineraries.filter((item) => item.id !== itineraryId))
      toast({
        title: "Itinerary deleted",
        description: "Your itinerary has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to delete itinerary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {localItineraries.map((itinerary) => (
        <Card key={itinerary.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={itinerary.image || "/placeholder.svg?height=200&width=300"}
              alt={itinerary.destination}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="text-xl font-semibold">{itinerary.destination}</h3>
            <p className="text-sm text-muted-foreground">{formatDateRange(itinerary.startDate, itinerary.endDate)}</p>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href={`/itinerary/${itinerary.id}`}>
                <Eye size={16} />
                View
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2" disabled={deletingId === itinerary.id}>
                  <Trash2 size={16} />
                  {deletingId === itinerary.id ? "Deleting..." : "Delete"}
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
                  <AlertDialogAction onClick={() => handleDelete(itinerary.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}

      {/* Create New Card */}
      <Link href="/generate">
        <Card className="flex h-full min-h-[250px] cursor-pointer flex-col items-center justify-center p-6 transition-colors hover:bg-muted/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed">
            <span className="text-3xl">+</span>
          </div>
          <p className="mt-4 text-center font-medium">Create New Itinerary</p>
        </Card>
      </Link>
    </div>
  )
}
