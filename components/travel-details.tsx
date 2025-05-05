import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Train, Bus, Car } from "lucide-react"

interface TravelDetailsProps {
  travelDetails?: any
}

export function TravelDetails({ travelDetails = { arrival: {}, departure: {} } }: TravelDetailsProps) {
  // Create transportation array from travel details
  const createTransportationFromDetails = () => {
    const transportation = []

    if (travelDetails.arrival && Object.keys(travelDetails.arrival).length > 0) {
      const arrivalMode = travelDetails.arrival.mode?.toLowerCase() || "flight"
      const icon = getTransportIcon(arrivalMode)

      transportation.push({
        type: "Arrival",
        icon,
        details: `From ${travelDetails.arrival.from || "Origin"} to ${travelDetails.arrival.to || "Destination"}`,
        notes: `${travelDetails.arrival.airline || "Not specified"} - ${travelDetails.arrival.departureTime || "Not specified"} to ${travelDetails.arrival.arrivalTime || "Not specified"}`,
      })
    }

    if (travelDetails.departure && Object.keys(travelDetails.departure).length > 0) {
      const departureMode = travelDetails.departure.mode?.toLowerCase() || "flight"
      const icon = getTransportIcon(departureMode)

      transportation.push({
        type: "Departure",
        icon,
        details: `From ${travelDetails.departure.from || "Origin"} to ${travelDetails.departure.to || "Destination"}`,
        notes: `${travelDetails.departure.airline || "Not specified"} - ${travelDetails.departure.departureTime || "Not specified"} to ${travelDetails.departure.arrivalTime || "Not specified"}`,
      })
    }

    return transportation
  }

  // Fallback transportation if none are provided
  const fallbackTransportation = [
    {
      type: "Flight",
      icon: <Plane className="h-5 w-5" />,
      details: "Recommended airlines: Local Carrier, International Airways",
      notes: "Book at least 2 months in advance for better rates.",
    },
    {
      type: "Local Transport",
      icon: <Train className="h-5 w-5" />,
      details: "Efficient public transportation available in most areas",
      notes: "Consider getting a transit pass for unlimited rides.",
    },
    {
      type: "Car Rental",
      icon: <Car className="h-5 w-5" />,
      details: "Recommended for exploring rural areas",
      notes: "International driving permit may be required.",
    },
  ]

  const transportation = createTransportationFromDetails()
  const displayTransportation = transportation.length > 0 ? transportation : fallbackTransportation

  // Map transport types to icons
  function getTransportIcon(type: string) {
    const lowerType = type.toLowerCase()
    if (lowerType.includes("flight") || lowerType.includes("plane") || lowerType.includes("air")) {
      return <Plane className="h-5 w-5" />
    } else if (lowerType.includes("train") || lowerType.includes("rail")) {
      return <Train className="h-5 w-5" />
    } else if (lowerType.includes("bus")) {
      return <Bus className="h-5 w-5" />
    } else if (lowerType.includes("car") || lowerType.includes("rental")) {
      return <Car className="h-5 w-5" />
    }
    return <Car className="h-5 w-5" />
  }

  return (
    <div className="space-y-6">
      {displayTransportation.map((transport: any, index: number) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              {transport.icon || <Plane className="h-5 w-5" />}
              <span className="ml-2">{transport.type}</span>
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
