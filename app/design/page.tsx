import { Navbar } from "@/components/navbar"

export default function DesignDocumentation() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">TripPlannrs Design Documentation</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. ER Diagram</h2>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <div className="mb-4">
              <p className="mb-4">
                The Entity-Relationship diagram for TripPlannrs shows the relationships between the main entities in our
                system:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
                {`
User
  |
  |---- 1:N -----> Itinerary
                      |
                      |---- 1:N -----> Day
                      |                 |
                      |                 |---- 1:N -----> Activity
                      |                 |
                      |                 |---- 1:1 -----> Accommodation (per day)
                      |
                      |---- 1:N -----> Accommodation (options)
                      |
                      |---- 1:1 -----> TravelDetails
                      |                 |
                      |                 |---- 1:1 -----> Arrival
                      |                 |
                      |                 |---- 1:1 -----> Departure
                      |
                      |---- 1:N -----> TravelTip
                `}
              </pre>
            </div>
            <p>This diagram shows that:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>A User can have multiple Itineraries</li>
              <li>Each Itinerary contains multiple Days, Accommodation options, Travel Details, and Travel Tips</li>
              <li>Each Day contains multiple Activities and one Accommodation</li>
              <li>Travel Details contain Arrival and Departure information</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. Table Structure (Database)</h2>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <p className="mb-4">
              Our Firebase Firestore database has the following collections and document structures:
            </p>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Users Collection</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
                {`
{
  uid: string,          // Firebase Auth user ID
  email: string,        // User's email address
  displayName: string,  // User's display name
  photoURL: string,     // User's profile photo URL
  createdAt: timestamp  // When the user account was created
}
                `}
              </pre>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2">Itineraries Collection</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
                {`
{
  id: string,                // Document ID
  userId: string,            // Reference to user who owns this itinerary
  destination: string,       // Main destination
  description: string,       // Brief description
  startDate: timestamp,      // Trip start date
  endDate: timestamp,        // Trip end date
  image: string,             // URL to destination image
  travelersCount: number,    // Number of travelers
  travelGroupType: string,   // Type of group (Solo, Couple, Family, etc.)
  days: [                    // Array of day objects
    {
      dayNumber: number,     // Day number in sequence
      title: string,         // Day title
      date: string,          // ISO date string
      activities: [          // Array of activities
        {
          type: string,      // Morning, Afternoon, Evening, Lunch, etc.
          title: string,     // Activity name
          time: string,      // Time range
          location: string,  // Location name
          description: string, // Activity description
          image: string,     // Activity image URL
          mapLink: string    // Google Maps link
        }
      ],
      accommodation: {       // Accommodation for this day
        name: string,        // Hotel/accommodation name
        location: string,    // Location
        mapLink: string      // Google Maps link
      }
    }
  ],
  accommodations: [          // Array of accommodation options
    {
      name: string,          // Accommodation name
      type: string,          // Hotel, Hostel, Apartment, etc.
      address: string,       // Full address
      priceRange: string,    // Price range (e.g., "$$$")
      mapLink: string        // Google Maps link
    }
  ],
  travelDetails: {           // Travel information
    arrival: {
      mode: string,          // Flight, Train, Bus, etc.
      airline: string,       // Airline/company name
      departureTime: string, // Departure time
      arrivalTime: string,   // Arrival time
      price: string,         // Estimated price
      airport: string,       // Airport/station name
      mapLink: string        // Google Maps link
    },
    departure: {
      mode: string,          // Flight, Train, Bus, etc.
      airline: string,       // Airline/company name
      departureTime: string, // Departure time
      arrivalTime: string,   // Arrival time
      price: string,         // Estimated price
      airport: string,       // Airport/station name
      mapLink: string        // Google Maps link
    }
  },
  tips: [                    // Array of travel tips
    {
      category: string,      // Tip category
      title: string,         // Tip title
      content: string[]      // Array of tip content items
    }
  ],
  createdAt: timestamp,      // When the itinerary was created
  updatedAt: timestamp       // When the itinerary was last updated
}
                `}
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. Use Case Diagram</h2>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <p className="mb-4">
              The Use Case diagram illustrates the interactions between users and the TripPlannrs system:
            </p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
              {`
+---------------------------------------------+
|                 TripPlannrs                 |
+---------------------------------------------+
|                                             |
|  +------------+        +-----------------+  |
|  | Sign Up    |        | Sign In         |  |
|  +------------+        +-----------------+  |
|                                             |
|  +------------+        +-----------------+  |
|  | Create     |        | View Itinerary  |  |
|  | Itinerary  |        +-----------------+  |
|  +------------+                             |
|        |                                    |
|        v                                    |
|  +------------+        +-----------------+  |
|  | Fill Trip  |        | Download PDF    |  |
|  | Details    |        +-----------------+  |
|  +------------+                             |
|        |                                    |
|        v                                    |
|  +------------+        +-----------------+  |
|  | Generate   |        | Delete          |  |
|  | Itinerary  |        | Itinerary       |  |
|  +------------+        +-----------------+  |
|                                             |
+---------------------------------------------+
              `}
            </pre>
            <p className="mt-4">Primary actors:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Unregistered User: Can sign up and sign in</li>
              <li>Registered User: Can create, view, download, and delete itineraries</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. Data Flow Diagram (DFD)</h2>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <p className="mb-4">The Data Flow Diagram shows how data moves through the TripPlannrs system:</p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
              {`
+-------------+     Authentication     +-------------+
|    User     | --------------------> |  Firebase   |
+-------------+                       |    Auth     |
      |                               +-------------+
      |                                      |
      v                                      v
+-------------+     Form Data         +-------------+
|  Generate   | --------------------> |   Gemini    |
|    Form     |                       |     AI      |
+-------------+                       +-------------+
      |                                      |
      |                                      v
      |                               +-------------+
      |                               | Structured  |
      |                               |  Itinerary  |
      |                               |    Data     |
      |                               +-------------+
      |                                      |
      v                                      v
+-------------+     Save Itinerary    +-------------+
| Dashboard   | <-------------------- |  Firebase   |
|             |                       | Firestore   |
+-------------+                       +-------------+
      |                                      ^
      |                                      |
      v                                      |
+-------------+     View/Download     +-------------+
| Itinerary   | --------------------> |    PDF      |
|    View     |                       | Generation  |
+-------------+                       +-------------+
              `}
            </pre>
            <p className="mt-4">Key data flows:</p>
            <ol className="list-decimal ml-6 space-y-2">
              <li>User authentication data flows between the User and Firebase Auth</li>
              <li>Trip form data flows from the Generate Form to Gemini AI</li>
              <li>Structured itinerary data flows from Gemini AI to Firebase Firestore</li>
              <li>Itinerary data flows from Firebase Firestore to the Dashboard and Itinerary View</li>
              <li>Itinerary data flows from the Itinerary View to PDF Generation</li>
            </ol>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. Class Diagram</h2>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <p className="mb-4">The Class Diagram represents the structure of the TripPlannrs system:</p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
              {`
+---------------+       +----------------+       +---------------+
|     User      |       |   Itinerary    |       |      Day      |
+---------------+       +----------------+       +---------------+
| - uid         |       | - id           |       | - dayNumber   |
| - email       |       | - userId       |       | - title       |
| - displayName |       | - destination  |       | - date        |
| - photoURL    |       | - startDate    |       | - activities  |
| - createdAt   |       | - endDate      |       | - accommodation|
+---------------+       | - image        |       +---------------+
| + createUser()|       | - days         |              |
| + updateUser()|       | - accommodations|              |
| + deleteUser()|       | - travelDetails|              |
+---------------+       | - tips         |              |
        |               +----------------+              |
        |               | + create()     |              |
        |               | + update()     |              |
        |               | + delete()     |              |
        |               | + generatePDF()|              |
        |               +----------------+              |
        |                       |                       |
        |                       |                       |
        v                       v                       v
+---------------+       +----------------+       +---------------+
|  AuthService  |       | TravelDetails  |       |   Activity    |
+---------------+       +----------------+       +---------------+
| + signIn()    |       | - arrival      |       | - type        |
| + signOut()   |       | - departure    |       | - title       |
| + signUp()    |       +----------------+       | - time        |
+---------------+                                | - location    |
                                                | - description |
                                                | - image       |
                                                | - mapLink     |
                                                +---------------+
              `}
            </pre>
            <p className="mt-4">Key relationships:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>User has many Itineraries (1:N)</li>
              <li>Itinerary has many Days (1:N)</li>
              <li>Day has many Activities (1:N)</li>
              <li>Itinerary has one TravelDetails (1:1)</li>
              <li>AuthService manages User authentication</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. Low-Level Design</h2>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <p className="mb-4">The Low-Level Design details the component structure and interactions:</p>

            <h3 className="text-xl font-medium mb-2">Component Structure</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
              {`
/app
  /api
    /generate-itinerary
      route.ts           # API endpoint for generating itineraries
  /dashboard
    page.tsx             # Dashboard page showing user's itineraries
  /generate
    page.tsx             # Form for generating new itineraries
  /itinerary
    /[id]
      page.tsx           # Itinerary view page
      /pdf
        page.tsx         # PDF generation page
  /signin
    page.tsx             # Sign-in page
  /terms
    page.tsx             # Terms of service page
  /privacy
    page.tsx             # Privacy policy page
  layout.tsx             # Root layout
  page.tsx               # Landing page
  globals.css            # Global styles
  providers.tsx          # Context providers

/components
  /ui                    # UI components (buttons, cards, etc.)
  navbar.tsx             # Navigation bar
  hero.tsx               # Hero section
  features.tsx           # Features section
  testimonials.tsx       # Testimonials section
  about-us.tsx           # About us section
  contact.tsx            # Contact section
  itinerary-header.tsx   # Itinerary header
  itinerary-tabs.tsx     # Itinerary tabs
  day-plan.tsx           # Day plan component
  accommodation-options.tsx # Accommodation options component
  travel-details.tsx     # Travel details component
  travel-tips.tsx        # Travel tips component
  trip-details-form.tsx  # Trip details form
  travelers-form.tsx     # Travelers form
  budget-form.tsx        # Budget form
  trip-style-form.tsx    # Trip style form
  food-preferences-form.tsx # Food preferences form
  extras-form.tsx        # Extras form
  progress-indicator.tsx # Form progress indicator
  loading-spinner.tsx    # Loading spinner
  loading-page.tsx       # Loading page

/lib
  firebase.ts            # Firebase initialization
  auth-context.tsx       # Authentication context
  db.ts                  # Database functions
  pdf-generator.ts       # PDF generation functions
  unsplash.ts            # Unsplash API functions
  geoapify.ts            # Geoapify API functions
  api-config.ts          # API configuration
  utils.ts               # Utility functions
              `}
            </pre>

            <h3 className="text-xl font-medium mt-6 mb-2">Key Functions and Methods</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
              {`
// Authentication
signInWithGoogle(): Promise<void>
signOut(): Promise<void>

// Database Operations
createItinerary(userId: string, itineraryData: any): Promise<any>
getItinerary(itineraryId: string): Promise<any>
getUserItineraries(userId: string): Promise<any[]>
updateItinerary(itineraryId: string, itineraryData: any): Promise<any>
deleteItinerary(itineraryId: string): Promise<boolean>
convertTimestamps(obj: any): any

// API Functions
POST /api/generate-itinerary: Generates itinerary using Gemini AI

// PDF Generation
generatePDF(itinerary: any): Blob
              `}
            </pre>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. High-Level Design</h2>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
            <p className="mb-4">The High-Level Design provides an overview of the system architecture:</p>

            <h3 className="text-xl font-medium mb-2">System Architecture</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto">
              {`
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|  Client (Next.js) | <---> |  Server (Next.js) | <---> |  Firebase Auth   |
|                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+
         |                           |                           |
         |                           |                           |
         v                           v                           v
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|  Gemini AI API    | <---> |  Firebase         | <---> |  External APIs   |
|                   |       |  Firestore        |       |  (Unsplash, etc.)|
+-------------------+       +-------------------+       +-------------------+
              `}
            </pre>

            <h3 className="text-xl font-medium mt-6 mb-2">Key Architectural Components</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <strong>Client-Side (Next.js):</strong> Handles UI rendering, form inputs, and user interactions
              </li>
              <li>
                <strong>Server-Side (Next.js API Routes):</strong> Processes requests, communicates with external APIs
              </li>
              <li>
                <strong>Firebase Authentication:</strong> Manages user authentication and session management
              </li>
              <li>
                <strong>Firebase Firestore:</strong> Stores and retrieves itinerary data
              </li>
              <li>
                <strong>Gemini AI API:</strong> Generates itineraries based on user inputs
              </li>
              <li>
                <strong>External APIs:</strong> Provides additional data (images, maps)
              </li>
            </ol>

            <h3 className="text-xl font-medium mt-6 mb-2">Data Flow</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>User authenticates through Firebase Authentication</li>
              <li>User submits trip details through the form</li>
              <li>Server processes the form data and sends it to Gemini AI</li>
              <li>Gemini AI generates a structured itinerary</li>
              <li>Server enhances the itinerary with additional data from external APIs</li>
              <li>Itinerary is stored in Firebase Firestore</li>
              <li>User can view, download, or delete the itinerary</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
