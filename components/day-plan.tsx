import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface DayPlanProps {
  itinerary: any
}

export function DayPlan({ itinerary }: DayPlanProps) {
  // Ensure days is an array and has content
  const days = itinerary?.days && Array.isArray(itinerary.days) ? itinerary.days : []

  if (!days.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No daily plan available for this itinerary.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {days.map((day: any, index: number) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">
              Day {index + 1}: {day.title || "Exploration Day"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {day.activities &&
                Array.isArray(day.activities) &&
                day.activities.map((activity: any, actIndex: number) => (
                  <div key={actIndex}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">
                          {activity.time ? `${activity.time} ` : ""}
                          {activity.title || "Activity"}
                        </h3>
                        <p className="text-sm text-muted-foreground">{activity.description || ""}</p>
                      </div>
                      {activity.duration && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {activity.duration}
                        </span>
                      )}
                    </div>
                    {actIndex < day.activities.length - 1 && <Separator className="my-3" />}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
