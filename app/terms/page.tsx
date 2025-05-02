import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2 pl-0">
            <ArrowLeft size={16} />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: April 26, 2025</p>
        </div>

        <div className="space-y-4">
          <p>
            Welcome to TripPlannrs. By accessing or using our service, you agree to be bound by these Terms of Service.
            Please read them carefully.
          </p>

          <h2 className="mt-6 text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TripPlannrs, you agree to these Terms of Service and our Privacy Policy. If you do not
            agree to these terms, please do not use our service.
          </p>

          <h2 className="mt-6 text-xl font-semibold">2. Description of Service</h2>
          <p>
            TripPlannrs is an AI-powered travel itinerary generator that creates personalized travel plans based on user
            preferences. We provide recommendations for activities, accommodations, and other travel-related
            information.
          </p>

          <h2 className="mt-6 text-xl font-semibold">3. User Accounts</h2>
          <p>
            To use certain features of our service, you may need to create an account. You are responsible for
            maintaining the confidentiality of your account information and for all activities that occur under your
            account.
          </p>

          <h2 className="mt-6 text-xl font-semibold">4. User Content</h2>
          <p>
            You retain ownership of any content you submit to TripPlannrs. By submitting content, you grant us a
            worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content in connection
            with providing and improving our service.
          </p>

          <h2 className="mt-6 text-xl font-semibold">5. Limitation of Liability</h2>
          <p>
            TripPlannrs provides travel recommendations, but we are not responsible for the accuracy of third-party
            information, availability of accommodations, or safety of recommended activities. You acknowledge that
            travel involves risks, and you are solely responsible for your travel decisions.
          </p>

          <h2 className="mt-6 text-xl font-semibold">6. Intellectual Property</h2>
          <p>
            The TripPlannrs service, including its content, features, and functionality, are owned by TripPlannrs and
            are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="mt-6 text-xl font-semibold">7. Termination</h2>
          <p>
            We may terminate or suspend your account and access to our service at our sole discretion, without notice,
            for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third
            parties.
          </p>

          <h2 className="mt-6 text-xl font-semibold">8. Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will notify you of any changes by posting the new
            Terms on this page and updating the "Last Updated" date.
          </p>

          <h2 className="mt-6 text-xl font-semibold">9. Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:terms@tripplannrs.com" className="text-primary hover:underline">
              terms@tripplannrs.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
