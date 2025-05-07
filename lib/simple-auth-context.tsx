"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Types
type User = {
  uid: string
  email: string | null
  displayName: string | null
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock sign in
  const signIn = async () => {
    setUser({
      uid: "123",
      email: "user@example.com",
      displayName: "Test User",
    })
  }

  // Mock sign out
  const signOut = async () => {
    setUser(null)
  }

  // Simulate auth state change
  useEffect(() => {
    setLoading(false)
  }, [])

  // Context value
  const value = {
    user,
    loading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth
export function useSimpleAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider")
  }
  return context
}
