"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/components/ui/use-toast"
import { getItinerary, convertTimestamps } from "@/lib/db"
import { generatePDF } from "@/lib/pdf-generator"

interface PrintItineraryClientProps {
  itineraryId: string
}

export default function PrintItineraryClient({ itineraryId }: PrintItineraryClientProps) {
  const [itinerary, setItinerary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchItinerary() {
      try {
        if (!itineraryId) {
          setError("No itinerary ID provided")
          setLoading(false)
          return
        }

        const itineraryData = await getItinerary(itineraryId)

        // Convert Firestore timestamps to JS Date objects
        const formattedItinerary = convertTimestamps(itineraryData)
        setItinerary(formattedItinerary)
      } catch (err) {
        console.error("Error fetching itinerary:", err)
        setError("Failed to load itinerary")
      } finally {
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [itineraryId])

  const handleGeneratePDF = async () => {
    if (!itinerary) return

    setGenerating(true)
    try {
      const pdfBlob = generatePDF(itinerary)

      // Create a download link
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${itinerary.destination || "itinerary"}-itinerary.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

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
            <h2 className="text-xl font-semibold">{itinerary.destination || "Your Trip"}</h2>
            <p className="text-muted-foreground">
              {itinerary.startDate ? new Date(itinerary.startDate).toLocaleDateString() : ""} -
              {itinerary.endDate ? new Date(itinerary.endDate).toLocaleDateString() : ""}
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
            <Button variant="outline" onClick={() => router.push(`/itinerary/${itineraryId}/view`)}>
              Back to Itinerary
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
