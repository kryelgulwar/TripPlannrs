import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getDestinationImage } from "@/lib/unsplash"
import { getMapLink } from "@/lib/geoapify"
import { apiConfig } from "@/lib/api-config"

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      destination,
      startingPoint, // Add this line
      startDate,
      endDate,
      travelersCount,
      travelGroupType,
      budgetType,
      tripStyles,
      pace,
      wakeUpTime,
      cuisinePreferences,
      specialRequests,
      arrivalMode,
      departureMode,
      arrivalTime,
      departureTime,
    } = data

    // Validate required fields
    if (!destination || !startingPoint || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate number of days for the trip
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // Format the prompt for Gemini
    const prompt = `
  Create a detailed travel itinerary for a trip from ${startingPoint} to ${destination} from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}.
  
  Trip details:
  - Starting point: ${startingPoint}
  - Destination: ${destination}
  - Number of travelers: ${travelersCount}
  - Group type: ${travelGroupType}
  - Budget: ${budgetType}
  - Trip styles: ${Array.isArray(tripStyles) ? tripStyles.join(", ") : "Various"}
  - Pace: ${pace}
  - Wake-up time: ${wakeUpTime}
  - Cuisine preferences: ${Array.isArray(cuisinePreferences) ? cuisinePreferences.join(", ") : "Various"}
  - Arrival mode of transportation: ${arrivalMode || "Not specified"}
  - Departure mode of transportation: ${departureMode || "Not specified"}
  - Arrival time: ${arrivalTime || "Not specified"}
  - Departure time: ${departureTime || "Not specified"}
  ${specialRequests ? `- Special requests: ${specialRequests}` : ""}
  
  Please include:
  1. A day-by-day plan with morning, afternoon, and evening activities for all ${diffDays} days
  2. At least 3 recommended accommodations with price ranges
  3. At least 3 travel tips specific to the destination
  4. Suggested restaurants based on cuisine preferences
  5. Detailed travel options from ${startingPoint} to ${destination} for arrival, and from ${destination} back to ${startingPoint} for departure
  
  Format the response as a structured JSON object with the following structure:
  {
    "destination": "${destination}",
    "startingPoint": "${startingPoint}",
    "description": "A detailed travel itinerary from ${startingPoint} to ${destination}",
    "days": [
      {
        "dayNumber": 1,
        "title": "Day 1 Title",
        "date": "${start.toISOString().split("T")[0]}",
        "activities": [
          {
            "type": "Morning",
            "title": "Activity Title",
            "time": "9:00 AM - 12:00 PM",
            "location": "Location Name",
            "description": "Activity description"
          },
          {
            "type": "Lunch",
            "title": "Restaurant Name",
            "time": "12:30 PM - 2:00 PM",
            "location": "Restaurant Location",
            "description": "Restaurant description"
          },
          {
            "type": "Afternoon",
            "title": "Activity Title",
            "time": "2:30 PM - 5:30 PM",
            "location": "Location Name",
            "description": "Activity description"
          },
          {
            "type": "Evening",
            "title": "Activity Title",
            "time": "7:00 PM - 10:00 PM",
            "location": "Location Name",
            "description": "Activity description"
          }
        ],
        "accommodation": {
          "name": "Hotel Name",
          "location": "Hotel Location"
        }
      }
    ],
    "accommodations": [
      {
        "name": "Accommodation Name",
        "type": "Hotel/Hostel/Apartment",
        "address": "Full address",
        "priceRange": "Price range"
      }
    ],
    "tips": [
      {
        "category": "Category",
        "title": "Tip Title",
        "content": ["Tip content 1", "Tip content 2"]
      }
    ],
    "travelDetails": {
      "arrival": {
        "mode": "${arrivalMode || "Flight"}",
        "airline": "Airline/Company Name",
        "departureTime": "Departure Time",
        "arrivalTime": "Arrival Time",
        "price": "Estimated Price",
        "airport": "Airport/Station Name",
        "from": "${startingPoint}",
        "to": "${destination}"
      },
      "departure": {
        "mode": "${departureMode || "Flight"}",
        "airline": "Airline/Company Name",
        "departureTime": "Departure Time",
        "arrivalTime": "Arrival Time",
        "price": "Estimated Price",
        "airport": "Airport/Station Name",
        "from": "${destination}",
        "to": "${startingPoint}"
      }
    }
  }
  
  Make sure to include all the sections and follow the exact structure. Generate realistic and detailed content for each section, including specific transportation options between ${startingPoint} and ${destination} based on the mode of transportation selected.
`

    // Call Gemini API with the correct model
    const model = genAI.getGenerativeModel({ model: apiConfig.gemini.model })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's any text before or after)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response")
      }

      const jsonString = jsonMatch[0]
      let itinerary = JSON.parse(jsonString)

      // Create a default structure to ensure all required fields exist
      const defaultStructure = {
        destination: destination,
        startingPoint: startingPoint,
        description: `Your personalized travel itinerary from ${startingPoint} to ${destination}`,
        days: [],
        accommodations: [],
        tips: [],
        travelDetails: {
          arrival: {
            mode: arrivalMode || "Flight",
            airline: "Not specified",
            departureTime: arrivalTime || "Not specified",
            arrivalTime: "Not specified",
            price: "Not specified",
            airport: "Not specified",
            from: startingPoint,
            to: destination,
          },
          departure: {
            mode: departureMode || "Flight",
            airline: "Not specified",
            departureTime: departureTime || "Not specified",
            arrivalTime: "Not specified",
            price: "Not specified",
            airport: "Not specified",
            from: destination,
            to: startingPoint,
          },
        },
      }

      // Merge the AI response with our default structure
      itinerary = {
        ...defaultStructure,
        ...itinerary,
        travelDetails: {
          ...defaultStructure.travelDetails,
          ...(itinerary.travelDetails || {}),
          arrival: {
            ...defaultStructure.travelDetails.arrival,
            ...(itinerary.travelDetails?.arrival || {}),
          },
          departure: {
            ...defaultStructure.travelDetails.departure,
            ...(itinerary.travelDetails?.departure || {}),
          },
        },
      }

      // Generate days if missing
      if (!Array.isArray(itinerary.days) || itinerary.days.length === 0) {
        itinerary.days = []
        for (let i = 0; i < diffDays; i++) {
          const currentDate = new Date(start)
          currentDate.setDate(start.getDate() + i)

          itinerary.days.push({
            dayNumber: i + 1,
            title: `Day ${i + 1} in ${destination}`,
            date: currentDate.toISOString().split("T")[0],
            activities: [
              {
                type: "Morning",
                title: "Explore the area",
                time: "9:00 AM - 12:00 PM",
                location: `${destination} City Center`,
                description: "Start your day by exploring the local area and getting familiar with your surroundings.",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                type: "Lunch",
                title: "Local Cuisine",
                time: "12:30 PM - 2:00 PM",
                location: "Local Restaurant",
                description: "Enjoy local cuisine at a nearby restaurant.",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                type: "Afternoon",
                title: "Sightseeing",
                time: "2:30 PM - 5:30 PM",
                location: `${destination} Attractions`,
                description: "Visit the main attractions in the area.",
                image: "/placeholder.svg?height=200&width=300",
              },
              {
                type: "Evening",
                title: "Dinner and Relaxation",
                time: "7:00 PM - 10:00 PM",
                location: "Restaurant near accommodation",
                description: "Have dinner and relax after a day of exploration.",
                image: "/placeholder.svg?height=200&width=300",
              },
            ],
            accommodation: {
              name: "Your selected accommodation",
              location: destination,
            },
          })
        }
      }

      // Generate accommodations if missing
      if (!Array.isArray(itinerary.accommodations) || itinerary.accommodations.length === 0) {
        itinerary.accommodations = [
          {
            name: `${budgetType} Hotel in ${destination}`,
            type: "Hotel",
            address: `${destination} City Center`,
            priceRange: budgetType === "Luxury" ? "$$$" : budgetType === "Moderate" ? "$$" : "$",
          },
          {
            name: `${destination} Central Apartments`,
            type: "Apartment",
            address: `${destination} Downtown`,
            priceRange: budgetType === "Luxury" ? "$$$" : budgetType === "Moderate" ? "$$" : "$",
          },
          {
            name: `${destination} Traveler's Lodge`,
            type: budgetType === "Cheap" ? "Hostel" : "Hotel",
            address: `${destination} Tourist Area`,
            priceRange: budgetType === "Luxury" ? "$$$" : budgetType === "Moderate" ? "$$" : "$",
          },
        ]
      }

      // Generate tips if missing
      if (!Array.isArray(itinerary.tips) || itinerary.tips.length === 0) {
        itinerary.tips = [
          {
            category: "General",
            title: "Local Customs",
            content: [
              `Research local customs and etiquette before visiting ${destination}.`,
              "Learn a few basic phrases in the local language.",
              "Respect local traditions and dress codes, especially at religious sites.",
            ],
          },
          {
            category: "Packing",
            title: "What to Pack",
            content: [
              "Pack weather-appropriate clothing.",
              "Bring comfortable walking shoes.",
              "Don't forget travel adapters for your electronics.",
            ],
          },
          {
            category: "Safety",
            title: "Safety Tips",
            content: [
              "Keep a copy of your passport and important documents.",
              "Be aware of common tourist scams in the area.",
              "Have emergency contact numbers saved in your phone.",
            ],
          },
        ]
      }

      // Fetch a destination image from Unsplash
      try {
        const destinationImage = await getDestinationImage(destination)
        itinerary.image = destinationImage
      } catch (error) {
        console.error("Error fetching destination image:", error)
        itinerary.image = "/placeholder.svg?height=400&width=800"
      }

      // Add map links for activities
      if (Array.isArray(itinerary.days)) {
        itinerary.days.forEach((day: any) => {
          if (Array.isArray(day.activities)) {
            day.activities.forEach((activity: any) => {
              if (activity.location && activity.location !== "Not specified") {
                activity.mapLink = getMapLink(activity.location)
              }
              // Ensure activity has an image
              if (!activity.image) {
                activity.image = "/placeholder.svg?height=200&width=300"
              }
            })
          }

          if (day.accommodation) {
            if (day.accommodation.location || day.accommodation.name) {
              const locationText = day.accommodation.location || day.accommodation.name
              if (locationText && locationText !== "Not specified") {
                day.accommodation.mapLink = getMapLink(locationText)
              }
            }
          }
        })
      }

      // Add map links for accommodations
      if (Array.isArray(itinerary.accommodations)) {
        itinerary.accommodations.forEach((accommodation: any) => {
          if (accommodation.address || accommodation.name) {
            const locationText = accommodation.address || accommodation.name
            if (locationText && locationText !== "Not specified") {
              accommodation.mapLink = getMapLink(locationText)
            }
          }
        })
      }

      // Add map links for travel details
      if (itinerary.travelDetails) {
        if (itinerary.travelDetails.arrival && itinerary.travelDetails.arrival.airport) {
          const airportText = itinerary.travelDetails.arrival.airport
          if (airportText && airportText !== "Not specified") {
            itinerary.travelDetails.arrival.mapLink = getMapLink(airportText)
          }
        }
        if (itinerary.travelDetails.departure && itinerary.travelDetails.departure.airport) {
          const airportText = itinerary.travelDetails.departure.airport
          if (airportText && airportText !== "Not specified") {
            itinerary.travelDetails.departure.mapLink = getMapLink(airportText)
          }
        }
      }

      return NextResponse.json(itinerary)
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError)
      return NextResponse.json({ error: "Failed to parse AI response", rawResponse: text }, { status: 500 })
    }
  } catch (error) {
    console.error("Error generating itinerary:", error)
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 })
  }
}
