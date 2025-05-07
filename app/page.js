"use client"

import { useState } from "react"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"
import { AboutUs } from "@/components/about-us"
import { Contact } from "@/components/contact"
import { Navbar } from "@/components/navbar"
import { SignInModal } from "@/components/sign-in-modal"

export default function Home() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const openSignInModal = () => {
    console.log("Opening sign-in modal")
    setIsSignInModalOpen(true)
  }

  const closeSignInModal = () => {
    console.log("Closing sign-in modal")
    setIsSignInModalOpen(false)
  }

  return (
    <main className="min-h-screen">
      <Navbar onSignInClick={openSignInModal} />
      <Hero onGetStartedClick={openSignInModal} />
      <Features />
      <Testimonials />
      <AboutUs />
      <Contact />
      <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
    </main>
  )
}
