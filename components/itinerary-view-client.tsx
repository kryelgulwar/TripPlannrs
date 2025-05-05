"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DayPlan } from "@/components/day-plan"
import { TravelTips } from "@/components/travel-tips"
import { AccommodationOptions } from "@/components/accommodation-options"
import { ItineraryHeader } from "@/components/itinerary-header"
import { DataInspector } from "@/components/data-inspector"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/db"
import { doc, getDoc } from "firebase/firestore"

interface ItineraryViewClientProps {
  id: string
}

export function ItineraryViewClient({ id }: ItineraryViewClientProps) {
  const [itinerary, setItinerary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchItinerary() {
      try {
        if (!id) {
          setError("No itinerary ID provided")
          setLoading(false)
          return
        }

        const docRef = doc(db, "itineraries", id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setItinerary({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError("Itinerary not found")
        }
      } catch (err) {
        console.error("Error fetching itinerary:", err)
        setError("Failed to load itinerary")
      } finally {
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [id])

  const handlePrintPDF = () => {
    router.push(`/itinerary/${id}/pdf`)
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">Error</h2>
            <p className="mt-2">{error}</p>
            <Button className="mt-4" onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!itinerary) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Itinerary Not Found</h2>
            <p className="mt-2">The requested itinerary could not be found.</p>
            <Button className="mt-4" onClick={() => router.push("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ItineraryHeader itinerary={itinerary} />

      <div className="mb-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={handlePrintPDF}>
          Generate PDF
        </Button>
      </div>

      <Tabs defaultValue="daily-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily-plan">Daily Plan</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="travel-tips">Travel Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="daily-plan" className="mt-6">
          <DayPlan itinerary={itinerary} />
        </TabsContent>
        <TabsContent value="accommodations" className="mt-6">
          <AccommodationOptions itinerary={itinerary} />
        </TabsContent>
        <TabsContent value="travel-tips" className="mt-6">
          <TravelTips itinerary={itinerary} />
        </TabsContent>
      </Tabs>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-8">
          <DataInspector data={itinerary} />
        </div>
      )}
    </div>
  )
}
