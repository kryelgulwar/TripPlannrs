export function AboutUs() {
  return (
    <section id="about" className="py-16 sm:py-20">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            About Us
          </h2>
          <p className="mb-6 text-base sm:text-lg text-muted-foreground">
            TripPlannrs helps travelers create personalized itineraries without the hassle of planning. We use AI to
            suggest the perfect activities and accommodations based on your preferences.
          </p>
          <p className="text-muted-foreground">
            Our mission is to make travel planning simple, enjoyable, and accessible to everyone. We don't charge
            commissions on hotel bookings, so you always get unbiased recommendations.
          </p>
        </div>
      </div>
    </section>
  )
}
