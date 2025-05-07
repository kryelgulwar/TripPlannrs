"use client"

import { useState } from "react"

export default function SignInModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      console.log("Sign in with Google")
      onClose()
    } catch (error) {
      console.error("Error signing in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <button className="w-full bg-blue-600 text-white py-2 rounded-md" onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign in with Google"}
        </button>
        <button className="mt-4 w-full bg-gray-200 py-2 rounded-md" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  )
}
