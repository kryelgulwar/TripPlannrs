import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Train, Bus, Car } from "lucide-react"

interface TravelDetailsProps {
  travelDetails?: any
}

export function TravelDetails({ travelDetails = { arrival: {}, departure: {} } }: TravelDetailsProps) {
  // Fallback transportation if none are provided
  const fallbackTransportation = [
    {
      type: "Flight",
      details: "Recommended airlines: Local Carrier, International Airways",
      notes: "Book at least 2 months in advance for better rates.",
    },
    {
      type: "Local Transport",
      details: "Efficient public transportation available in most areas",
      notes: "Consider getting a transit pass for unlimited rides.",
    },
    {
      type: "Car Rental",
      details: "Recommended for exploring rural areas",
      notes: "International driving permit may be required.",
    },
  ]

  // Create transportation array from travel details
  const createTransportationFromDetails = () => {
    const transportation = []

    if (travelDetails && travelDetails.arrival && Object.keys(travelDetails.arrival).length > 0) {
      transportation.push({
        type: "Arrival",
        details: `From ${travelDetails.arrival.from || "Origin"} to ${travelDetails.arrival.to || "Destination"}`,
        notes: travelDetails.arrival.notes || "No additional details available.",
      })
    }

    if (travelDetails && travelDetails.departure && Object.keys(travelDetails.departure).length > 0) {
      transportation.push({
        type: "Departure",
        details: `From ${travelDetails.departure.from || "Origin"} to ${travelDetails.departure.to || "Destination"}`,
        notes: travelDetails.departure.notes || "No additional details available.",
      })
    }

    return transportation
  }

  const transportation = createTransportationFromDetails()
  const displayTransportation = transportation.length > 0 ? transportation : fallbackTransportation

  // Map transport types to icons
  const getTransportIcon = (type = "") => {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("flight") || lowerType.includes("plane") || lowerType.includes("air")) {
      return <Plane className="h-5 w-5" />
    } else if (lowerType.includes("train") || lowerType.includes("rail")) {
      return <Train className="h-5 w-5" />
    } else if (lowerType.includes("bus")) {
      return <Bus className="h-5 w-5" />
    } else {
      return <Car className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      {displayTransportation.map((transport: any, index: number) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              {getTransportIcon(transport.type)}
              <span className="ml-2">{transport.type || "Transportation"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transport.details && <p>{transport.details}</p>}

              {transport.notes && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm italic">{transport.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
