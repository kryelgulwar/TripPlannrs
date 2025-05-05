import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { AboutUs } from "@/components/about-us"
import { Contact } from "@/components/contact"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <AboutUs />
      <div className="container mx-auto my-12 flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Link href="/signin">Get Started Today</Link>
        </Button>
      </div>
      <Contact />
    </main>
  )
}
