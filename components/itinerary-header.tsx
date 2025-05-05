import Image from "next/image"

interface ItineraryHeaderProps {
  itinerary: any
}

export function ItineraryHeader({ itinerary }: ItineraryHeaderProps) {
  // Enhanced debug logging
  console.log("ItineraryHeader received:", itinerary ? JSON.stringify(itinerary, null, 2) : "null/undefined")

  if (!itinerary) {
    console.log("ItineraryHeader: Itinerary is null or undefined")
    return (
      <div className="mb-8 overflow-hidden rounded-lg border bg-muted/20 p-6 text-center">
        <p className="text-muted-foreground">Itinerary information not available.</p>
      </div>
    )
  }

  const formatDateRange = (start: Date | string, end: Date | string) => {
    try {
      const startDate = new Date(start)
      const endDate = new Date(end)

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.log("ItineraryHeader: Invalid date objects", { start, end })
        return "Date range not available"
      }

      const startMonth = startDate.toLocaleString("default", { month: "long" })
      const endMonth = endDate.toLocaleString("default", { month: "long" })

      if (startMonth === endMonth) {
        return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}, ${endDate.getFullYear()}`
      }

      return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${endDate.getFullYear()}`
    } catch (error) {
      console.error("ItineraryHeader: Error formatting date range:", error)
      return "Date range not available"
    }
  }

  return (
    <div className="mb-8 overflow-hidden rounded-lg border">
      <div className="relative h-64 w-full">
        <Image
          src={itinerary.image || "/placeholder.svg?height=200&width=300"}
          alt={itinerary.destination || "Travel destination"}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h1 className="mb-2 text-3xl font-bold">{itinerary.destination || "Your Trip"}</h1>
        <p className="mb-4 text-muted-foreground">{itinerary.description || "Your personalized travel itinerary"}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {itinerary.startDate && itinerary.endDate && (
            <>
              <span className="font-medium">{formatDateRange(itinerary.startDate, itinerary.endDate)}</span>
              <span className="text-muted-foreground">•</span>
            </>
          )}
          <span className="text-muted-foreground">
            {itinerary.travelersCount || 1} {(itinerary.travelersCount || 1) === 1 ? "Traveler" : "Travelers"}
          </span>
        </div>
      </div>
    </div>
  )
}
