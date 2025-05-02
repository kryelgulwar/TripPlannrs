// API configuration for external services
export const apiConfig = {
  // Unsplash API for images
  unsplash: {
    accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
    baseUrl: "https://api.unsplash.com",
  },
  // Geoapify for maps and location data
  geoapify: {
    apiKey: process.env.GEOAPIFY_API_KEY || "",
    baseUrl: "https://api.geoapify.com/v1",
  },
  // Gemini AI for itinerary generation
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: "gemini-2.0-flash",
  },
  // Base URL for the application
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
}
