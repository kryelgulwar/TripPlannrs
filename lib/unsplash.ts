import { apiConfig } from "./api-config"

export async function getDestinationImage(destination: string): Promise<string> {
  try {
    const response = await fetch(
      `${apiConfig.unsplash.baseUrl}/search/photos?query=${encodeURIComponent(
        destination + " travel destination",
      )}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${apiConfig.unsplash.accessKey}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch image from Unsplash")
    }

    const data = await response.json()
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular
    }

    // Return placeholder if no results
    return "/placeholder.svg?height=400&width=800"
  } catch (error) {
    console.error("Error fetching destination image:", error)
    return "/placeholder.svg?height=400&width=800"
  }
}
