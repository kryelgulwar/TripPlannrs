import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Home, MapPin, Star, Wifi, Utensils } from "lucide-react"

interface AccommodationOptionsProps {
  accommodations?: any[]
}

export function AccommodationOptions({ accommodations = [] }: AccommodationOptionsProps) {
  // Fallback accommodations if none are provided
  const fallbackAccommodations = [
    {
      name: "Recommended Hotel",
      type: "Hotel",
      location: "Central area, close to attractions",
      priceRange: "$$$",
      rating: 4.5,
      amenities: ["Free WiFi", "Breakfast included", "Swimming pool"],
      notes: "Great option for travelers who want convenience and comfort.",
    },
    {
      name: "Budget-Friendly Hostel",
      type: "Hostel",
      location: "Near public transportation",
      priceRange: "$",
      rating: 4.0,
      amenities: ["Free WiFi", "Shared kitchen", "Lounge area"],
      notes: "Perfect for budget travelers and those looking to meet other travelers.",
    },
    {
      name: "Luxury Apartment",
      type: "Apartment",
      location: "Scenic neighborhood with great views",
      priceRange: "$$$$",
      rating: 4.8,
      amenities: ["Full kitchen", "Washer/Dryer", "Concierge service"],
      notes: "Ideal for longer stays or travelers who prefer more space and privacy.",
    },
  ]

  const displayAccommodations = accommodations && accommodations.length > 0 ? accommodations : fallbackAccommodations

  return (
    <div className="space-y-6">
      {displayAccommodations.map((accommodation: any, index: number) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              {accommodation.type === "Hotel" ? <Building className="h-5 w-5" /> : <Home className="h-5 w-5" />}
              <span className="ml-2">{accommodation.name || "Accommodation"}</span>
              <div className="ml-auto flex items-center text-sm">
                {accommodation.rating && (
                  <span className="text-yellow-500 flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 mr-1" />
                    {accommodation.rating}
                  </span>
                )}
                {accommodation.priceRange && (
                  <span className="ml-2 text-muted-foreground">{accommodation.priceRange}</span>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accommodation.location && (
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <span>{accommodation.location}</span>
                </div>
              )}

              {accommodation.amenities && accommodation.amenities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {accommodation.amenities.map((amenity: string, i: number) => (
                      <span
                        key={i}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center"
                      >
                        {amenity.includes("WiFi") ? <Wifi className="h-3 w-3 mr-1" /> : null}
                        {amenity.includes("Breakfast") ? <Utensils className="h-3 w-3 mr-1" /> : null}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {accommodation.notes && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{accommodation.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
