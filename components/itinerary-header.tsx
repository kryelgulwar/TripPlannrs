import Image from "next/image"

interface ItineraryHeaderProps {
  itinerary: any
}

export function ItineraryHeader({ itinerary }: ItineraryHeaderProps) {
  const formatDateRange = (start: Date, end: Date) => {
    const startMonth = start.toLocaleString("default", { month: "long" })
    const endMonth = end.toLocaleString("default", { month: "long" })

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}, ${end.getFullYear()}`
    }

    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`
  }

  return (
    <div className="mb-8 overflow-hidden rounded-lg border">
      <div className="relative h-64 w-full">
        <Image src={itinerary.image || "/placeholder.svg"} alt={itinerary.destination} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h1 className="mb-2 text-3xl font-bold">{itinerary.destination}</h1>
        <p className="mb-4 text-muted-foreground">{itinerary.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">
            {formatDateRange(new Date(itinerary.startDate), new Date(itinerary.endDate))}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            {itinerary.travelersCount} {itinerary.travelersCount === 1 ? "Traveler" : "Travelers"}
          </span>
        </div>
      </div>
    </div>
  )
}
