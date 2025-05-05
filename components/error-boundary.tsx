"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error boundary caught error:", error)
  }, [error])

  const handleReset = () => {
    setIsResetting(true)
    try {
      reset()
    } catch (e) {
      console.error("Error during reset:", e)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-10 w-10 text-red-600"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="mt-6 text-xl font-semibold">Something went wrong!</h2>
      <p className="mt-2 mb-8 text-center text-sm text-muted-foreground">
        An error occurred while rendering this page.
        <br />
        Please try again or contact support if the problem persists.
      </p>
      <Button onClick={handleReset} disabled={isResetting}>
        {isResetting ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Trying again...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </>
        )}
      </Button>
    </div>
  )
}
