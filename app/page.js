import { Navbar } from "@/components/navbar"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Testimonials from "@/components/testimonials"
import AboutUs from "@/components/about-us"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <AboutUs />
      <Contact />
    </main>
  )
}
