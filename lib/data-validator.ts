/**
 * Utility functions to validate and sanitize itinerary data
 */

export function validateItineraryData(data: any) {
  if (!data) {
    console.error("validateItineraryData: Data is null or undefined")
    return null
  }

  try {
    // Create a sanitized copy with default values for missing fields
    const sanitized = {
      id: data.id || "",
      userId: data.userId || "",
      destination: data.destination || "Unknown Destination",
      startingPoint: data.startingPoint || "Unknown Starting Point",
      description: data.description || "Your personalized travel itinerary",
      startDate: data.startDate || new Date(),
      endDate: data.endDate || new Date(),
      image: data.image || "/placeholder.svg?height=400&width=800",
      travelersCount: data.travelersCount || 1,
      travelGroupType: data.travelGroupType || "Solo Traveler",

      // Ensure arrays are properly initialized
      days: Array.isArray(data.days) ? sanitizeDays(data.days) : [],
      accommodations: Array.isArray(data.accommodations) ? sanitizeAccommodations(data.accommodations) : [],
      tips: Array.isArray(data.tips) ? sanitizeTips(data.tips) : [],

      // Ensure travel details object exists
      travelDetails: sanitizeTravelDetails(data.travelDetails, data.startingPoint, data.destination),

      // Preserve timestamps
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
    }

    return sanitized
  } catch (error) {
    console.error("validateItineraryData: Error validating data:", error)
    return data // Return original data if validation fails
  }
}

function sanitizeDays(days: any[]) {
  if (!Array.isArray(days)) {
    console.error("sanitizeDays: Days is not an array")
    return []
  }

  return days.map((day, index) => ({
    dayNumber: day.dayNumber || index + 1,
    title: day.title || `Day ${index + 1}`,
    date: day.date || new Date(),
    activities: Array.isArray(day.activities)
      ? day.activities.map((activity: any) => ({
          type: activity.type || "Activity",
          title: activity.title || "Activity details",
          time: activity.time || "Time not specified",
          location: activity.location || "Location not specified",
          description: activity.description || "",
          image: activity.image || "/placeholder.svg?height=200&width=300",
          mapLink: activity.mapLink || null,
        }))
      : [],
    accommodation: day.accommodation
      ? {
          name: day.accommodation.name || "Accommodation",
          location: day.accommodation.location || "",
          mapLink: day.accommodation.mapLink || null,
        }
      : null,
  }))
}

function sanitizeAccommodations(accommodations: any[]) {
  if (!Array.isArray(accommodations)) {
    console.error("sanitizeAccommodations: Accommodations is not an array")
    return []
  }

  return accommodations.map((accommodation) => ({
    name: accommodation.name || "Accommodation",
    type: accommodation.type || "Hotel",
    address: accommodation.address || "Address not available",
    priceRange: accommodation.priceRange || "Price not available",
    mapLink: accommodation.mapLink || null,
  }))
}

function sanitizeTips(tips: any[]) {
  if (!Array.isArray(tips)) {
    console.error("sanitizeTips: Tips is not an array")
    return []
  }

  return tips.map((tip) => ({
    category: tip.category || "General",
    title: tip.title || "Travel Tip",
    content: Array.isArray(tip.content) ? tip.content : ["No details available"],
  }))
}

function sanitizeTravelDetails(travelDetails: any, startingPoint = "Unknown", destination = "Unknown") {
  if (!travelDetails || typeof travelDetails !== "object") {
    return {
      arrival: {
        from: startingPoint,
        to: destination,
      },
      departure: {
        from: destination,
        to: startingPoint,
      },
    }
  }

  return {
    arrival: travelDetails.arrival
      ? {
          mode: travelDetails.arrival.mode || "Not specified",
          airline: travelDetails.arrival.airline || "Not specified",
          departureTime: travelDetails.arrival.departureTime || "Not specified",
          arrivalTime: travelDetails.arrival.arrivalTime || "Not specified",
          price: travelDetails.arrival.price || "Not specified",
          airport: travelDetails.arrival.airport || "Not specified",
          mapLink: travelDetails.arrival.mapLink || null,
          from: travelDetails.arrival.from || startingPoint,
          to: travelDetails.arrival.to || destination,
        }
      : {
          from: startingPoint,
          to: destination,
        },
    departure: travelDetails.departure
      ? {
          mode: travelDetails.departure.mode || "Not specified",
          airline: travelDetails.departure.airline || "Not specified",
          departureTime: travelDetails.departure.departureTime || "Not specified",
          arrivalTime: travelDetails.departure.arrivalTime || "Not specified",
          price: travelDetails.departure.price || "Not specified",
          airport: travelDetails.departure.airport || "Not specified",
          mapLink: travelDetails.departure.mapLink || null,
          from: travelDetails.departure.from || destination,
          to: travelDetails.departure.to || startingPoint,
        }
      : {
          from: destination,
          to: startingPoint,
        },
  }
}
