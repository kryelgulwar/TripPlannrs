"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { db } from "@/lib/db"
import { doc, getDoc } from "firebase/firestore"
import { generatePDF } from "@/lib/pdf-generator"

interface PrintItineraryClientProps {
  id: string
}

export function PrintItineraryClient({ id }: PrintItineraryClientProps) {
  const [itinerary, setItinerary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

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

  const handleGeneratePDF = async () => {
    if (!itinerary) return

    setGenerating(true)
    try {
      await generatePDF(itinerary)
      toast({
        title: "PDF Generated",
        description: "Your itinerary PDF has been generated and downloaded.",
      })
    } catch (err) {
      console.error("Error generating PDF:", err)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
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
      <Card>
        <CardContent className="p-6">
          <h1 className="mb-6 text-center text-3xl font-bold">Generate PDF</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold">{itinerary.destination}</h2>
            <p className="text-muted-foreground">
              {itinerary.startDate} - {itinerary.endDate}
            </p>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleGeneratePDF} disabled={generating} size="lg">
              {generating ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Generating PDF...
                </>
              ) : (
                "Download PDF"
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => router.push(`/itinerary/${id}`)}>
              Back to Itinerary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
