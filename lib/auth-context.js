"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "./firebase"
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth"
import { createUserProfile } from "./db"

const AuthContext = createContext({
  user: null,
  loading: true,
  signInWithGoogle: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Add the signInWithGoogle function
  const signInWithGoogle = async () => {
    try {
      console.log("signInWithGoogle called")
      const provider = new GoogleAuthProvider()
      console.log("Google provider created")

      const result = await signInWithPopup(auth, provider)
      console.log("Sign in popup completed", result)

      // Create user profile in Firestore if it doesn't exist
      if (result.user) {
        console.log("Creating user profile for:", result.user.uid)
        await createUserProfile(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        })
      }

      return result
    } catch (error) {
      console.error("Error signing in with Google:", error)
      throw error
    }
  }

  // Add the signOut function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  useEffect(() => {
    console.log("Setting up auth state listener")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in:", user.uid)
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
      } else {
        console.log("No user signed in")
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const contextValue = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  }

  console.log("Auth context value:", {
    user: user ? { uid: user.uid } : null,
    loading,
    hasSignInWithGoogle: !!signInWithGoogle,
    hasSignOut: !!signOut,
  })

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
