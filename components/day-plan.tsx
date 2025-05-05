import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DayPlanProps {
  day: any
}

export function DayPlan({ day }: DayPlanProps) {
  // Enhanced debug logging
  console.log("DayPlan received:", JSON.stringify(day, null, 2))

  if (!day) {
    console.log("DayPlan: Day is null or undefined")
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Day information not available.</p>
        </CardContent>
      </Card>
    )
  }

  // Check for required properties
  if (!day.dayNumber) {
    console.log("DayPlan: Missing dayNumber")
  }

  if (!day.title) {
    console.log("DayPlan: Missing title")
  }

  if (!day.date) {
    console.log("DayPlan: Missing date")
  }

  if (!Array.isArray(day.activities)) {
    console.log("DayPlan: Activities is not an array")
  } else if (day.activities.length === 0) {
    console.log("DayPlan: Activities array is empty")
  }

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } catch (error) {
      console.error("DayPlan: Error formatting date:", error)
      return "Date not available"
    }
  }

  return (
    <Card>
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <span>
            DAY {day.dayNumber || "?"}: {day.title || "Itinerary"}
          </span>
          <span className="text-base font-normal text-muted-foreground">
            {day.date ? formatDate(day.date) : "Date not available"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {Array.isArray(day.activities) && day.activities.length > 0 ? (
            day.activities.map((activity: any, index: number) => (
              <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                <h3 className="mb-4 font-semibold">{activity.type || "Activity"}:</h3>
                <div className="grid gap-4 sm:grid-cols-[1fr_3fr]">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg sm:h-24">
                    <Image
                      src={activity.image || "/placeholder.svg?height=200&width=300"}
                      alt={activity.title || "Activity"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="mb-2 text-lg font-medium">{activity.title || "Activity details"}</h4>
                    <div className="mb-2 flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{activity.time || "Time not specified"}</span>
                    </div>
                    <div className="mb-3 flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-4 w-4" />
                      {activity.mapLink ? (
                        <Link
                          href={activity.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {activity.location || "Location not specified"}
                        </Link>
                      ) : (
                        <span>{activity.location || "Location not specified"}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground">{activity.description || "No description available"}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No activities planned for this day.</p>
            </div>
          )}

          {day.accommodation ? (
            <div className="flex items-center space-x-2 rounded-lg bg-muted/30 p-4">
              <Home className="h-5 w-5 text-primary" />
              <div>
                <span className="font-medium">Accommodation for the Night:</span>{" "}
                {day.accommodation.mapLink ? (
                  <Link
                    href={day.accommodation.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {day.accommodation.name || "Accommodation not specified"}
                  </Link>
                ) : (
                  <span>{day.accommodation.name || "Accommodation not specified"}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">No accommodation information for this day.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
