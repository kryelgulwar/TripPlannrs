import { apiConfig } from "./api-config"

export function getMapLink(location: string): string {
  // Create a Google Maps-like URL with the location
  return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:0,0&zoom=14&apiKey=${
    apiConfig.geoapify.apiKey
  }&marker=lonlat:0,0;color:%23ff0000;size:medium&text=${encodeURIComponent(location)}`
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
