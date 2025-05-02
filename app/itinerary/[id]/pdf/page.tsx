"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { generatePDF } from "@/lib/pdf-generator"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { getItinerary, convertTimestamps } from "@/lib/db"
import { useToast } from "@/components/ui/toast-provider"
import { LoadingPage } from "@/components/loading-page"
import { Navbar } from "@/components/navbar"

export default function PrintItinerary({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [itinerary, setItinerary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const handleDownload = () => {
    if (!itinerary) return

    try {
      const pdfBlob = generatePDF(itinerary)
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `TripPlannrs-${itinerary.destination.replace(/\s+/g, "-")}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "PDF Downloaded",
        description: "Your itinerary has been downloaded successfully.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
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
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/itinerary/${params.id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back to Itinerary
            </Button>
          </Link>

          <div className="flex gap-4">
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Download size={18} />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="rounded-lg border shadow-sm">
          <div className="p-4">
            <h2 className="text-2xl font-bold">PDF Preview</h2>
            <p className="text-muted-foreground">Your itinerary is ready to download or print.</p>
          </div>

          {/* PDF Preview */}
          <div className="h-[800px] overflow-auto border-t p-4">
            <div className="mx-auto max-w-4xl border border-gray-300 p-8">
              {/* Header */}
              <div className="mb-8 border-b pb-4 text-center">
                <h1 className="text-3xl font-bold uppercase">TRIPPLANNRS</h1>
                <p className="text-sm text-muted-foreground">www.tripplannrs.com</p>
              </div>

              {/* Travel Overview */}
              <div className="mb-8 rounded border p-4">
                <h2 className="mb-4 font-bold uppercase">TRAVEL OVERVIEW</h2>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <span className="font-semibold">Destination:</span> {itinerary.destination}
                  </div>
                  <div>
                    <span className="font-semibold">Travel Dates:</span>{" "}
                    {new Date(itinerary.startDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(itinerary.endDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div>
                    <span className="font-semibold">Number of People:</span> {itinerary.travelersCount} Travelers
                  </div>
                  <div>
                    <span className="font-semibold">Group Info:</span> {itinerary.travelGroupType}
                  </div>
                </div>
              </div>

              {/* Travel Mode */}
              {itinerary.travelDetails && (
                <div className="mb-8 rounded border p-4">
                  <h2 className="mb-4 font-bold uppercase">TRAVEL MODE</h2>

                  <h3 className="mb-2 font-semibold uppercase">ARRIVAL:</h3>
                  <div className="mb-4 ml-4 space-y-1">
                    <div>
                      <span className="font-semibold">Mode:</span> {itinerary.travelDetails.arrival.mode}
                    </div>
                    <div>
                      <span className="font-semibold">Airline:</span> {itinerary.travelDetails.arrival.airline}
                    </div>
                    <div>
                      <span className="font-semibold">Departure Time:</span>{" "}
                      {itinerary.travelDetails.arrival.departureTime}
                    </div>
                    <div>
                      <span className="font-semibold">Arrival Time:</span> {itinerary.travelDetails.arrival.arrivalTime}
                    </div>
                    <div>
                      <span className="font-semibold">Price:</span> {itinerary.travelDetails.arrival.price}
                    </div>
                    <div>
                      <span className="font-semibold">Airport:</span> {itinerary.travelDetails.arrival.airport} [Google
                      Maps Link]
                    </div>
                  </div>

                  <h3 className="mb-2 font-semibold uppercase">DEPARTURE:</h3>
                  <div className="ml-4 space-y-1">
                    <div>
                      <span className="font-semibold">Mode:</span> {itinerary.travelDetails.departure.mode}
                    </div>
                    <div>
                      <span className="font-semibold">Airline:</span> {itinerary.travelDetails.departure.airline}
                    </div>
                    <div>
                      <span className="font-semibold">Departure Time:</span>{" "}
                      {itinerary.travelDetails.departure.departureTime}
                    </div>
                    <div>
                      <span className="font-semibold">Arrival Time:</span>{" "}
                      {itinerary.travelDetails.departure.arrivalTime}
                    </div>
                    <div>
                      <span className="font-semibold">Price:</span> {itinerary.travelDetails.departure.price}
                    </div>
                    <div>
                      <span className="font-semibold">Airport:</span> {itinerary.travelDetails.departure.airport}{" "}
                      [Google Maps Link]
                    </div>
                  </div>
                </div>
              )}

              {/* Rest of the PDF preview content */}
              {/* ... */}

              {/* Accommodation Options */}
              {itinerary.accommodations && (
                <div className="mb-8 rounded border p-4">
                  <h2 className="mb-4 font-bold uppercase">ACCOMMODATION OPTIONS</h2>

                  {itinerary.accommodations.map((accommodation: any, index: number) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-semibold">
                        OPTION {index + 1}: {accommodation.name}
                      </h3>
                      <div className="ml-4 space-y-1">
                        <div>
                          <span className="font-semibold">Type:</span> {accommodation.type}
                        </div>
                        <div>
                          <span className="font-semibold">Address:</span> {accommodation.address}
                        </div>
                        <div>
                          <span className="font-semibold">Price Range:</span> {accommodation.priceRange}
                        </div>
                        <div>
                          <span className="font-semibold">Maps:</span> [Google Maps Link]
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Day-wise Plan */}
              {itinerary.days && (
                <div className="mb-8 rounded border p-4">
                  <h2 className="mb-4 font-bold uppercase">DAY-WISE PLAN</h2>

                  {itinerary.days.map((day: any) => (
                    <div key={day.dayNumber} className="mb-6">
                      <h3 className="font-semibold uppercase">
                        DAY {day.dayNumber}: {day.title}
                      </h3>
                      <p className="mb-2 text-sm">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>

                      {day.activities.map((activity: any, index: number) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-semibold">{activity.type}:</h4>
                          <div className="ml-4 space-y-1">
                            <div>
                              <span className="font-semibold">Activity:</span> {activity.title}
                            </div>
                            <div>
                              <span className="font-semibold">Location:</span> {activity.location} [Google Maps Link]
                            </div>
                            <div>
                              <span className="font-semibold">Time:</span> {activity.time}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="mt-2">
                        <span className="font-semibold">Accommodation for the Night:</span>
                        <div className="ml-4">
                          <div>
                            <span className="font-semibold">Hotel Name:</span> {day.accommodation.name}
                          </div>
                          <div>
                            <span className="font-semibold">Location:</span> {day.accommodation.name} [Google Maps Link]
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {itinerary.tips && (
                <div className="mb-8 rounded border p-4">
                  <h2 className="mb-4 font-bold uppercase">NOTES</h2>

                  {itinerary.tips.map((tip: any, index: number) => (
                    <div key={index} className="mb-4">
                      <h3 className="font-semibold">{tip.title}:</h3>
                      <ul className="ml-4 list-disc space-y-1 pl-4">
                        {tip.content.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 border-t pt-4 text-center">
                <p className="text-sm text-muted-foreground">Generated by TripPlannrs • www.tripplannrs.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
