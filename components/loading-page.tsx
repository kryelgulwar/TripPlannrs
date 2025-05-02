import { LoadingSpinner } from "./loading-spinner"

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-lg">Loading...</p>
      </div>
    </div>
  )
}
