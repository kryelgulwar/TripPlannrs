import { Suspense } from "react"
import ItineraryViewClient from "@/components/itinerary-view-client"
import { LoadingPage } from "@/components/loading-page"

// Create a dedicated view route to avoid conflicts
export default async function ItineraryViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <Suspense fallback={<LoadingPage />}>
      <ItineraryViewClient itineraryId={id} />
    </Suspense>
  )
}
