import { Suspense } from "react"
import PrintItineraryClient from "@/components/print-itinerary-client"
import { LoadingPage } from "@/components/loading-page"

// This is a Server Component
export default async function PrintItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  // We need to await params before accessing its properties
  const { id } = await params

  return (
    <Suspense fallback={<LoadingPage />}>
      <PrintItineraryClient itineraryId={id} />
    </Suspense>
  )
}
