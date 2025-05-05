import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Plane } from "lucide-react"
import Link from "next/link"

interface TravelDetailsProps {
  travelDetails: {
    arrival?: any
    departure?: any
  }
}

export function TravelDetails({ travelDetails }: TravelDetailsProps) {
  // Enhanced debug logging
  console.log("TravelDetails received:", travelDetails ? JSON.stringify(travelDetails) : "null/undefined")

  if (travelDetails) {
    console.log(
      "TravelDetails - arrival:",
      travelDetails.arrival ? JSON.stringify(travelDetails.arrival) : "not present",
    )
    console.log(
      "TravelDetails - departure:",
      travelDetails.departure ? JSON.stringify(travelDetails.departure) : "not present",
    )
  }

  // Update the component to handle potential issues:
  if (!travelDetails || (!travelDetails.arrival && !travelDetails.departure)) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-muted-foreground">No travel details available.</p>
      </div>
    )
  }

  // Ensure arrival and departure objects exist
  const arrival = travelDetails.arrival || {}
  const departure = travelDetails.departure || {}

  return (
    <div className="space-y-6">
      {travelDetails.arrival && Object.keys(travelDetails.arrival).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Arrival Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Mode:</p>
                  <p>{arrival.mode || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Airline:</p>
                  <p>{arrival.airline || "Not specified"}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Departure Time:</p>
                  <p>{arrival.departureTime || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrival Time:</p>
                  <p>{arrival.arrivalTime || "Not specified"}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Price:</p>
                  <p className="font-medium">{arrival.price || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Airport:</p>
                  <p>{arrival.airport || "Not specified"}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">From:</p>
                  <p>{arrival.from || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To:</p>
                  <p>{arrival.to || "Not specified"}</p>
                </div>
              </div>

              {arrival.mapLink && (
                <Button asChild variant="outline" className="w-full">
                  <Link href={arrival.mapLink} target="_blank" className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    View Airport on Google Maps
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {travelDetails.departure && Object.keys(travelDetails.departure).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              Departure Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Mode:</p>
                  <p>{departure.mode || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Airline:</p>
                  <p>{departure.airline || "Not specified"}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Departure Time:</p>
                  <p>{departure.departureTime || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrival Time:</p>
                  <p>{departure.arrivalTime || "Not specified"}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Price:</p>
                  <p className="font-medium">{departure.price || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Airport:</p>
                  <p>{departure.airport || "Not specified"}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">From:</p>
                  <p>{departure.from || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">To:</p>
                  <p>{departure.to || "Not specified"}</p>
                </div>
              </div>

              {departure.mapLink && (
                <Button asChild variant="outline" className="w-full">
                  <Link href={departure.mapLink} target="_blank" className="flex items-center gap-2">
                    <ExternalLink size={16} />
                    View Airport on Google Maps
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {(!travelDetails.arrival || Object.keys(travelDetails.arrival).length === 0) &&
        (!travelDetails.departure || Object.keys(travelDetails.departure).length === 0) && (
          <div className="rounded-lg border p-4 text-center">
            <p className="text-muted-foreground">No detailed travel information available.</p>
          </div>
        )}
    </div>
  )
}
