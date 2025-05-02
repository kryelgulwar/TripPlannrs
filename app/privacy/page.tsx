import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
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
          <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 26, 2025</p>
        </div>

        <div className="space-y-4">
          <p>
            At TripPlannrs, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our service.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Personal information (name, email address) when you create an account</li>
            <li>Travel preferences and itinerary details when you use our service</li>
            <li>Information you provide in communications with us</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Create personalized travel itineraries based on your preferences</li>
            <li>Communicate with you about our services</li>
            <li>Monitor and analyze usage patterns and trends</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">Information Sharing</h2>
          <p>We do not sell your personal information. We may share your information with:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Service providers who perform services on our behalf</li>
            <li>
              Third-party APIs (like map services) necessary to provide our service, but only as required for
              functionality
            </li>
            <li>As required by law or to protect our rights</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of
            transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Your Choices</h2>
          <p>You can:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Access, update, or delete your account information at any time</li>
            <li>Opt out of marketing communications</li>
            <li>Request a copy of your data</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2 className="mt-6 text-xl font-semibold">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@tripplannrs.com" className="text-primary hover:underline">
              privacy@tripplannrs.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
