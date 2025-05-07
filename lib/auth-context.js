"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth, googleAuthProvider } from "./firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { createUserProfile } from "./db"
import { toast } from "@/components/ui/toast"

const AuthContext = createContext({
  user: null,
  loading: true,
  signInWithGoogle: () => Promise.resolve(),
  signOutUser: () => Promise.resolve(),
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("Setting up auth state listener")
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user ? "User logged in" : "No user")
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    console.log("signInWithGoogle called")
    try {
      const result = await signInWithPopup(auth, googleAuthProvider)
      console.log("Google sign in successful:", result.user)

      // Create user profile in Firestore
      await createUserProfile(result.user)

      toast({
        title: "Welcome!",
        description: `Signed in as ${result.user.displayName || result.user.email}`,
      })

      return result.user
    } catch (error) {
      console.error("Error signing in with Google:", error)
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
