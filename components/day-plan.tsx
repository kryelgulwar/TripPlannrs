import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DayPlanProps {
  day: any
}

export function DayPlan({ day }: DayPlanProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card>
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <span>
            DAY {day.dayNumber}: {day.title}
          </span>
          <span className="text-base font-normal text-muted-foreground">{formatDate(day.date)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {day.activities.map((activity: any, index: number) => (
            <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
              <h3 className="mb-4 font-semibold">{activity.type}:</h3>
              <div className="grid gap-4 sm:grid-cols-[1fr_3fr]">
                <div className="relative h-40 sm:h-24 w-full overflow-hidden rounded-lg sm:h-full">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="mb-2 text-lg font-medium">{activity.title}</h4>
                  <div className="mb-2 flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="mb-3 flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    <Link href={activity.mapLink} target="_blank" className="hover:underline">
                      {activity.location}
                    </Link>
                  </div>
                  <p className="text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center space-x-2 rounded-lg bg-muted/30 p-4">
            <Home className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">Accommodation for the Night:</span>{" "}
              <Link href={day.accommodation.mapLink} target="_blank" className="hover:underline">
                {day.accommodation.name}
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
