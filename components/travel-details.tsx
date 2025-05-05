import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plane, Train, Bus, Car } from "lucide-react"

interface TravelDetailsProps {
  itinerary: any
}

export function TravelDetails({ itinerary }: TravelDetailsProps) {
  // Ensure transportation is an array and has content
  const transportation = itinerary.transportation || []

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

  const displayTransportation = transportation.length > 0 ? transportation : fallbackTransportation

  // Map transport types to icons
  const getTransportIcon = (type: string) => {
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
              {transport.icon || getTransportIcon(transport.type)}
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
