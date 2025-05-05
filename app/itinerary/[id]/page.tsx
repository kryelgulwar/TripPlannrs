import { redirect } from "next/navigation"

// This is a Server Component that redirects to the view route
export default async function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Explicitly redirect to the view route
  redirect(`/itinerary/${id}/view`)
}
