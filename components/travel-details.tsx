import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Plane } from "lucide-react"
import Link from "next/link"

interface TravelDetailsProps {
  travelDetails: {
    arrival: any
    departure: any
  }
}

export function TravelDetails({ travelDetails }: TravelDetailsProps) {
  return (
    <div className="space-y-6">
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
                <p>{travelDetails.arrival.mode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Airline:</p>
                <p>{travelDetails.arrival.airline}</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Departure Time:</p>
                <p>{travelDetails.arrival.departureTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Arrival Time:</p>
                <p>{travelDetails.arrival.arrivalTime}</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Price:</p>
                <p className="font-medium">{travelDetails.arrival.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Airport:</p>
                <p>{travelDetails.arrival.airport}</p>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href={travelDetails.arrival.mapLink} target="_blank" className="flex items-center gap-2">
                <ExternalLink size={16} />
                View Airport on Google Maps
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

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
                <p>{travelDetails.departure.mode}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Airline:</p>
                <p>{travelDetails.departure.airline}</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Departure Time:</p>
                <p>{travelDetails.departure.departureTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Arrival Time:</p>
                <p>{travelDetails.departure.arrivalTime}</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Price:</p>
                <p className="font-medium">{travelDetails.departure.price}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Airport:</p>
                <p>{travelDetails.departure.airport}</p>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href={travelDetails.departure.mapLink} target="_blank" className="flex items-center gap-2">
                <ExternalLink size={16} />
                View Airport on Google Maps
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
