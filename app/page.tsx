import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { AboutUs } from "@/components/about-us"
import { Contact } from "@/components/contact"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <AboutUs />
        <Contact />
      </main>
    </div>
  )
}
