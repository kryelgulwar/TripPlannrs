import { apiConfig } from "./api-config"

export function getMapLink(location: string): string {
  if (!location || location === "Not specified") {
    return ""
  }

  // Create a Google Maps URL with the location
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
}

export function getLocationCoordinates(location: string): Promise<{ lon: number; lat: number } | null> {
  return fetch(
    `${apiConfig.geoapify.baseUrl}/geocode/search?text=${encodeURIComponent(location)}&format=json&apiKey=${
      apiConfig.geoapify.apiKey
    }`,
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        return {
          lon: data.results[0].lon,
          lat: data.results[0].lat,
        }
      }
      return null
    })
    .catch((error) => {
      console.error("Error fetching location coordinates:", error)
      return null
    })
}
