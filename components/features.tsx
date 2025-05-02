"use client"

import { motion } from "framer-motion"
import { MapPin, Hotel, FileText, Sparkles } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-blue-500 dark:text-blue-400" />,
      title: "AI-Powered Itineraries",
      description: "Get personalized travel plans based on your preferences, budget, and travel style.",
    },
    {
      icon: <MapPin className="h-10 w-10 text-green-500 dark:text-green-400" />,
      title: "Interactive Maps",
      description: "Visualize your journey with interactive maps showing all activities and accommodations.",
    },
    {
      icon: <Hotel className="h-10 w-10 text-purple-500 dark:text-purple-400" />,
      title: "Hotel Recommendations",
      description: "Find the perfect place to stay with our curated accommodation options for every budget.",
    },
    {
      icon: <FileText className="h-10 w-10 text-amber-500 dark:text-amber-400" />,
      title: "Printable PDFs",
      description: "Download and print your complete itinerary for offline access during your travels.",
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Features</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Everything you need to plan the perfect trip without the stress.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center rounded-lg border p-6 text-center transition-all hover:border-primary/50 hover:bg-muted/50 hover:shadow-md"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
