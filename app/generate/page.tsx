"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { ProgressIndicator } from "@/components/progress-indicator"
import { TripDetailsForm } from "@/components/trip-details-form"
import { TravelersForm } from "@/components/travelers-form"
import { BudgetForm } from "@/components/budget-form"
import { TripStyleForm } from "@/components/trip-style-form"
import { FoodPreferencesForm } from "@/components/food-preferences-form"
import { ExtrasForm } from "@/components/extras-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { createItinerary } from "@/lib/db"
import { useToast } from "@/components/ui/toast-provider"
import { LoadingPage } from "@/components/loading-page"
import { getDestinationImage } from "@/lib/unsplash"

export default function GenerateItinerary() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    destination: "",
    startingPoint: "", // Make sure this is initialized with an empty string
    startDate: "",
    endDate: "",
    arrivalMode: "",
    departureMode: "",
    arrivalTime: "",
    departureTime: "",
    travelersCount: 2,
    travelGroupType: "Couple",
    budgetType: "Moderate",
    tripStyles: [],
    pace: "Balanced",
    wakeUpTime: "Mid",
    cuisinePreferences: [],
    specialRequests: "",
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/signin")
    }
  }, [user, loading, router])

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })

    // Clear any errors for fields that have been updated
    const updatedErrors = { ...formErrors }
    Object.keys(data).forEach((key) => {
      if (updatedErrors[key]) {
        delete updatedErrors[key]
      }
    })
    setFormErrors(updatedErrors)
  }

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.destination) {
        errors.destination = "Destination is required"
      }
      if (!formData.startingPoint) {
        errors.startingPoint = "Starting point is required"
      }
      if (!formData.startDate) {
        errors.startDate = "Start date is required"
      }
      if (!formData.endDate) {
        errors.endDate = "End date is required"
      } else if (formData.startDate && new Date(formData.startDate) > new Date(formData.endDate)) {
        errors.endDate = "End date must be after start date"
      }
    }

    // Add validations for other steps if needed

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    if (step < 6) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    } else {
      generateItinerary()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }

  const generateItinerary = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate an itinerary.",
        variant: "destructive",
      })
      router.push("/signin")
      return
    }

    try {
      setIsGenerating(true)
      toast({
        title: "Generating your itinerary",
        description: "This may take a minute. Please wait...",
      })

      // Call our API to generate the itinerary
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate itinerary")
      }

      const itineraryData = await response.json()

      // Get a destination image if not already provided
      if (!itineraryData.image) {
        itineraryData.image = await getDestinationImage(formData.destination)
      }

      // Add user data and save to Firebase
      const savedItinerary = await createItinerary(user.uid, {
        ...itineraryData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        travelersCount: formData.travelersCount,
        travelGroupType: formData.travelGroupType,
      })

      toast({
        title: "Itinerary created!",
        description: "Your personalized travel plan is ready.",
      })

      // Redirect to the new itinerary
      router.push(`/itinerary/${savedItinerary.id}`)
    } catch (error) {
      console.error("Error generating itinerary:", error)
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Generate Your Itinerary</h1>

        <ProgressIndicator currentStep={step} />

        <div className="mt-8 rounded-lg border p-6 shadow-sm">
          {step === 1 && <TripDetailsForm formData={formData} updateFormData={updateFormData} errors={formErrors} />}
          {step === 2 && <TravelersForm formData={formData} updateFormData={updateFormData} errors={formErrors} />}
          {step === 3 && <BudgetForm formData={formData} updateFormData={updateFormData} errors={formErrors} />}
          {step === 4 && <TripStyleForm formData={formData} updateFormData={updateFormData} errors={formErrors} />}
          {step === 5 && (
            <FoodPreferencesForm formData={formData} updateFormData={updateFormData} errors={formErrors} />
          )}
          {step === 6 && <ExtrasForm formData={formData} updateFormData={updateFormData} errors={formErrors} />}

          <div className="mt-6 flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} disabled={isGenerating}>
                ← Previous Step
              </Button>
            )}
            {step === 1 && <div />}
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                <span>{step < 6 ? "Next Step →" : "Generate Itinerary"}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
