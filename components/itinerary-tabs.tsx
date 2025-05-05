"use client"

import { useState, useEffect } from "react"
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
  const [hasAccommodations, setHasAccommodations] = useState(false)
  const [hasTravelDetails, setHasTravelDetails] = useState(false)
  const [hasTips, setHasTips] = useState(false)

  useEffect(() => {
    // Check if the required data exists
    console.log("ItineraryTabs - Received itinerary:", itinerary ? "yes" : "no")

    if (!itinerary) {
      console.log("ItineraryTabs - Itinerary is null or undefined")
      setHasAccommodations(false)
      setHasTravelDetails(false)
      setHasTips(false)
      return
    }

    // Check accommodations
    const hasAccoms = Array.isArray(itinerary.accommodations) && itinerary.accommodations.length > 0
    console.log(
      "ItineraryTabs - Accommodations:",
      hasAccoms
        ? `Array with ${itinerary.accommodations.length} items`
        : `Not valid: ${typeof itinerary.accommodations}`,
    )

    // Check travel details
    const hasTravelDetailsValue =
      itinerary.travelDetails &&
      ((itinerary.travelDetails.arrival && Object.keys(itinerary.travelDetails.arrival).length > 0) ||
        (itinerary.travelDetails.departure && Object.keys(itinerary.travelDetails.departure).length > 0))
    console.log(
      "ItineraryTabs - Travel Details:",
      itinerary.travelDetails ? `Object with keys: ${Object.keys(itinerary.travelDetails).join(", ")}` : "Not present",
    )

    // Check tips
    const hasTipsValue = Array.isArray(itinerary.tips) && itinerary.tips.length > 0
    console.log(
      "ItineraryTabs - Tips:",
      hasTipsValue ? `Array with ${itinerary.tips.length} items` : `Not valid: ${typeof itinerary.tips}`,
    )

    // Check days
    console.log(
      "ItineraryTabs - Days:",
      Array.isArray(itinerary.days)
        ? `Array with ${itinerary.days.length} items`
        : `Not valid: ${typeof itinerary.days}`,
    )

    setHasAccommodations(hasAccoms)
    setHasTravelDetails(hasTravelDetailsValue)
    setHasTips(hasTipsValue)

    // Log the state variables
    console.log("ItineraryTabs - Has Accommodations:", hasAccoms)
    console.log("ItineraryTabs - Has Travel Details:", hasTravelDetailsValue)
    console.log("ItineraryTabs - Has Tips:", hasTipsValue)
  }, [itinerary])

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
            {Array.isArray(itinerary?.days) && itinerary.days.length > 0
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
