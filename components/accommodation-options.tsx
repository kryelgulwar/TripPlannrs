import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

interface AccommodationOptionsProps {
  accommodations: any[]
}

export function AccommodationOptions({ accommodations }: AccommodationOptionsProps) {
  // Enhanced debug logging
  console.log(
    "AccommodationOptions received:",
    Array.isArray(accommodations)
      ? `Array with ${accommodations.length} items`
      : `Not an array: ${typeof accommodations}`,
  )

  if (Array.isArray(accommodations)) {
    accommodations.forEach((acc, index) => {
      console.log(`AccommodationOptions - Item ${index}:`, acc ? JSON.stringify(acc) : "null/undefined")
    })
  }

  if (!Array.isArray(accommodations) || accommodations.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <p className="text-muted-foreground">No accommodation information available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">Accommodation Options</h3>
        <p className="text-muted-foreground">
          We've selected these accommodations based on your preferences and budget.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accommodations.map((accommodation, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle>{accommodation.name || "Accommodation"}</CardTitle>
                <Badge variant="outline">{accommodation.type || "Hotel"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Address:</p>
                  <p>{accommodation.address || "Address not available"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price Range:</p>
                  <p className="font-medium">{accommodation.priceRange || "Price not available"}</p>
                </div>
                {accommodation.mapLink && (
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={accommodation.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink size={16} />
                      View on Google Maps
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
