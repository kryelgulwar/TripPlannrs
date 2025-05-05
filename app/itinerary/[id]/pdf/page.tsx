import { redirect } from "next/navigation"

// This is a Server Component that redirects to the new PDF route
export default async function LegacyPrintItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Redirect to the new PDF route
  redirect(`/itinerary/${id}/view/pdf`)
}
