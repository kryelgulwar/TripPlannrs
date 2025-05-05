import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, MapPin, Users } from "lucide-react"

interface ItineraryHeaderProps {
  itinerary: any
}

export function ItineraryHeader({ itinerary }: ItineraryHeaderProps) {
  return (
    <Card className="mb-6 bg-primary text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{itinerary.destination || "Your Trip"}</h1>
            <div className="flex flex-col sm:flex-row sm:space-x-6 text-primary-foreground/80">
              {itinerary.startDate && itinerary.endDate && (
                <div className="flex items-center mb-2 sm:mb-0">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(itinerary.startDate).toLocaleDateString()} -{" "}
                    {new Date(itinerary.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {itinerary.destination && (
                <div className="flex items-center mb-2 sm:mb-0">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{itinerary.destination}</span>
                </div>
              )}
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                <span>{itinerary.travelers || 2} Travelers</span>
              </div>
            </div>
          </div>

          {itinerary.budget && (
            <div className="mt-4 md:mt-0 bg-primary-foreground/10 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium">Budget</span>
              <div className="text-2xl font-bold">${itinerary.budget}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
