import Link from "next/link"
import { Mail, Twitter, Linkedin, Instagram } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="border-t py-12 sm:py-16">
      <div className="container px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Company Info */}
            <div>
              <h2 className="mb-4 text-2xl font-bold">TripPlannrs</h2>
              <p className="mb-6 text-muted-foreground">
                AI-powered travel itinerary generator that creates personalized travel plans in minutes.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                © {new Date().getFullYear()} TripPlannrs. All rights reserved.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <a href="mailto:support@tripplannrs.com" className="hover:text-primary">
                    support@tripplannrs.com
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://twitter.com/tripplannrs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a
                    href="https://linkedin.com/company/tripplannrs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a
                    href="https://instagram.com/tripplannrs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="#features" className="text-muted-foreground hover:text-primary">
                  Features
                </Link>
                <Link href="#testimonials" className="text-muted-foreground hover:text-primary">
                  Testimonials
                </Link>
                <Link href="#about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
