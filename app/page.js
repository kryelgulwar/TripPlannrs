"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { AboutUs } from "@/components/about-us"
import { Contact } from "@/components/contact"
import { Button } from "@/components/ui/button"
import { SignInModal } from "@/components/sign-in-modal"

export default function Home() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Navbar onSignInClick={() => setIsSignInOpen(true)} />
      <Hero />
      <Features />
      <Testimonials />
      <AboutUs />
      <div className="container mx-auto my-12 flex justify-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          onClick={() => setIsSignInOpen(true)}
        >
          Get Started Today
        </Button>
      </div>
      <Contact />

      <SignInModal open={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </main>
  )
}
