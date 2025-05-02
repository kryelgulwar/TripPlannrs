import Link from "next/link"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-100 dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              TripPlannrs
            </h1>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              AI-Powered Travel Itinerary Generator
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mt-4">
              Create personalized travel plans in minutes. Get detailed itineraries with accommodations, activities, and
              local insights tailored to your preferences.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/generate"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-8 text-sm font-medium text-white shadow transition-colors hover:from-blue-600 hover:to-purple-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50"
            >
              Try for Free
            </Link>
            <Link
              href="#features"
              className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-purple-500 px-8 text-sm font-medium text-white shadow transition-colors hover:from-blue-600 hover:to-purple-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
        <div className="absolute top-40 -left-40 h-80 w-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-40 right-10 h-60 w-60 rounded-full bg-teal-500 opacity-10 blur-3xl"></div>
      </div>
    </section>
  )
}
