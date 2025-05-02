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
    } = data

    // Validate required fields
    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format the prompt for Gemini
    const prompt = `
      Create a detailed travel itinerary for a trip to ${destination} from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}.
      
      Trip details:
      - Number of travelers: ${travelersCount}
      - Group type: ${travelGroupType}
      - Budget: ${budgetType}
      - Trip styles: ${tripStyles.join(", ")}
      - Pace: ${pace}
      - Wake-up time: ${wakeUpTime}
      - Cuisine preferences: ${cuisinePreferences.join(", ")}
      ${specialRequests ? `- Special requests: ${specialRequests}` : ""}
      
      Please include:
      1. A day-by-day plan with morning, afternoon, and evening activities
      2. Recommended accommodations with price ranges
      3. Travel tips specific to the destination
      4. Suggested restaurants based on cuisine preferences
      
      Format the response as a structured JSON object with the following structure:
      {
        "destination": string,
        "description": string,
        "days": [
          {
            "dayNumber": number,
            "title": string,
            "date": string (ISO date),
            "activities": [
              {
                "type": string (Morning/Lunch/Afternoon/Evening),
                "title": string,
                "time": string,
                "location": string,
                "mapLink": string,
                "description": string
              }
            ],
            "accommodation": {
              "name": string,
              "mapLink": string
            }
          }
        ],
        "accommodations": [
          {
            "name": string,
            "type": string,
            "address": string,
            "priceRange": string,
            "mapLink": string
          }
        ],
        "tips": [
          {
            "category": string,
            "title": string,
            "content": [string]
          }
        ],
        "travelDetails": {
          "arrival": {
            "mode": string,
            "airline": string,
            "departureTime": string,
            "arrivalTime": string,
            "price": string,
            "airport": string,
            "mapLink": string
          },
          "departure": {
            "mode": string,
            "airline": string,
            "departureTime": string,
            "arrivalTime": string,
            "price": string,
            "airport": string,
            "mapLink": string
          }
        }
      }
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
      const itinerary = JSON.parse(jsonString)

      // Fetch a destination image from Unsplash
      const destinationImage = await getDestinationImage(destination)
      itinerary.image = destinationImage

      // Add map links for activities if they don't have them
      if (itinerary.days) {
        itinerary.days.forEach((day: any) => {
          if (day.activities) {
            day.activities.forEach((activity: any) => {
              if (!activity.mapLink) {
                activity.mapLink = getMapLink(activity.location)
              }
            })
          }
          if (day.accommodation && !day.accommodation.mapLink) {
            day.accommodation.mapLink = getMapLink(day.accommodation.name)
          }
        })
      }

      // Add map links for accommodations if they don't have them
      if (itinerary.accommodations) {
        itinerary.accommodations.forEach((accommodation: any) => {
          if (!accommodation.mapLink) {
            accommodation.mapLink = getMapLink(accommodation.address)
          }
        })
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
