"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccommodationOptions } from "@/components/accommodation-options"
import { TravelDetails } from "@/components/travel-details"
import { TravelTips } from "@/components/travel-tips"
import { MapPin, Hotel, Plane, FileText } from "lucide-react"

interface ItineraryTabsProps {
  itinerary: any
}

export function ItineraryTabs({ itinerary }: ItineraryTabsProps) {
  const [activeTab, setActiveTab] = useState("day-plan")

  return (
    <Tabs defaultValue="day-plan" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="day-plan" className="flex items-center gap-2">
          <MapPin size={16} className={activeTab === "day-plan" ? "text-primary" : ""} />
          <span className="hidden sm:inline">Day-wise Plan</span>
          <span className="sm:hidden">Plan</span>
        </TabsTrigger>
        <TabsTrigger value="accommodation" className="flex items-center gap-2">
          <Hotel size={16} className={activeTab === "accommodation" ? "text-primary" : ""} />
          <span className="hidden sm:inline">Accommodation</span>
          <span className="sm:hidden">Hotels</span>
        </TabsTrigger>
        <TabsTrigger value="travel" className="flex items-center gap-2">
          <Plane size={16} className={activeTab === "travel" ? "text-primary" : ""} />
          <span className="hidden sm:inline">Travel Details</span>
          <span className="sm:hidden">Travel</span>
        </TabsTrigger>
        <TabsTrigger value="tips" className="flex items-center gap-2">
          <FileText size={16} className={activeTab === "tips" ? "text-primary" : ""} />
          <span className="hidden sm:inline">Travel Tips</span>
          <span className="sm:hidden">Tips</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="day-plan">
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground">
            {itinerary?.days && Array.isArray(itinerary.days) && itinerary.days.length > 0
              ? "Scroll down to see your day-by-day itinerary with activities, meals, and accommodations."
              : "No day-by-day itinerary available yet."}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="accommodation">
        <AccommodationOptions accommodations={itinerary?.accommodations || []} />
      </TabsContent>

      <TabsContent value="travel">
        <TravelDetails travelDetails={itinerary?.travelDetails || { arrival: {}, departure: {} }} />
      </TabsContent>

      <TabsContent value="tips">
        <TravelTips tips={itinerary?.tips || []} />
      </TabsContent>
    </Tabs>
  )
}
