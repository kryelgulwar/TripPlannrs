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
import { useEffect } from "react"

export default function Home() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  useEffect(() => {
    console.log("Home page mounted, isSignInOpen:", isSignInOpen)
  }, [isSignInOpen])

  const handleOpenSignIn = () => {
    console.log("Opening sign-in modal")
    setIsSignInOpen(true)
  }

  return (
    <main className="min-h-screen">
      <Navbar onSignInClick={handleOpenSignIn} />
      <Hero />
      <Features />
      <Testimonials />
      <AboutUs />
      <div className="container mx-auto my-12 flex justify-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          onClick={handleOpenSignIn}
        >
          Get Started Today
        </Button>
      </div>
      <Contact />

      <SignInModal
        open={isSignInOpen}
        onOpenChange={(open) => {
          console.log("Sign-in modal open state changing to:", open)
          setIsSignInOpen(open)
        }}
      />
    </main>
  )
}
