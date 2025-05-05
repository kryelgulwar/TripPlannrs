"use client"

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { User } from "firebase/auth"

// User profile functions
export const createUserProfile = async (user: User) => {
  if (!db) return null

  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    })
  }

  return userRef
}

// Itinerary functions
export const createItinerary = async (userId: string, itineraryData: any) => {
  if (!db) return null

  try {
    // Ensure the itinerary has the expected structure
    const sanitizedData = {
      destination: itineraryData.destination || "Unknown Destination",
      startingPoint: itineraryData.startingPoint || "Unknown Starting Point",
      description: itineraryData.description || "Your personalized travel itinerary",
      days: Array.isArray(itineraryData.days) ? itineraryData.days : [],
      accommodations: Array.isArray(itineraryData.accommodations) ? itineraryData.accommodations : [],
      tips: Array.isArray(itineraryData.tips) ? itineraryData.tips : [],
      travelDetails: itineraryData.travelDetails || {
        arrival: {
          from: itineraryData.startingPoint,
          to: itineraryData.destination,
        },
        departure: {
          from: itineraryData.destination,
          to: itineraryData.startingPoint,
        },
      },
      image: itineraryData.image || "/placeholder.svg?height=400&width=800",
      startDate: itineraryData.startDate,
      endDate: itineraryData.endDate,
      travelersCount: itineraryData.travelersCount || 1,
      travelGroupType: itineraryData.travelGroupType || "Solo Traveler",
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const itineraryRef = collection(db, "itineraries")
    const docRef = await addDoc(itineraryRef, sanitizedData)

    return { id: docRef.id, ...sanitizedData }
  } catch (error) {
    console.error("Error creating itinerary:", error)
    throw error
  }
}

export const getUserItineraries = async (userId: string) => {
  if (!db) return []

  try {
    const itinerariesRef = collection(db, "itineraries")
    const q = query(itinerariesRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const itineraries: any[] = []
    querySnapshot.forEach((doc) => {
      itineraries.push({ id: doc.id, ...doc.data() })
    })

    return itineraries
  } catch (error) {
    console.error("Error getting user itineraries:", error)
    throw error
  }
}

// Update the getItinerary function to add more detailed logging
export const getItinerary = async (itineraryId: string) => {
  if (!db) return null

  try {
    console.log("DB: Fetching itinerary with ID:", itineraryId)
    const itineraryRef = doc(db, "itineraries", itineraryId)
    const itinerarySnap = await getDoc(itineraryRef)

    if (itinerarySnap.exists()) {
      const rawData = itinerarySnap.data()
      console.log("DB: Raw data from Firebase:", rawData)

      // Check for specific fields
      console.log("DB: Days array exists:", !!rawData.days)
      console.log("DB: Days array is array:", Array.isArray(rawData.days))
      console.log("DB: Days array length:", Array.isArray(rawData.days) ? rawData.days.length : "N/A")

      console.log("DB: Accommodations exists:", !!rawData.accommodations)
      console.log("DB: Accommodations is array:", Array.isArray(rawData.accommodations))

      console.log("DB: Tips exists:", !!rawData.tips)
      console.log("DB: Tips is array:", Array.isArray(rawData.tips))

      console.log("DB: Travel details exists:", !!rawData.travelDetails)

      const data = { id: itinerarySnap.id, ...rawData }
      return data
    } else {
      console.error("DB: Itinerary not found with ID:", itineraryId)
      throw new Error("Itinerary not found")
    }
  } catch (error) {
    console.error("DB: Error getting itinerary:", error)
    throw error
  }
}

export const updateItinerary = async (itineraryId: string, itineraryData: any) => {
  if (!db) return null

  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    await updateDoc(itineraryRef, {
      ...itineraryData,
      updatedAt: serverTimestamp(),
    })

    return { id: itineraryId, ...itineraryData }
  } catch (error) {
    console.error("Error updating itinerary:", error)
    throw error
  }
}

export const deleteItinerary = async (itineraryId: string) => {
  if (!db) return false

  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    await deleteDoc(itineraryRef)
    return true
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    throw error
  }
}

// Improve the convertTimestamps function to handle potential issues
export const convertTimestamps = (obj: any) => {
  if (!obj) {
    console.log("convertTimestamps: Received null or undefined object")
    return obj
  }

  try {
    console.log("convertTimestamps: Processing object:", typeof obj, Array.isArray(obj) ? "array" : "object")

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map((item) => convertTimestamps(item))
    }

    // Handle non-object types
    if (typeof obj !== "object" || obj === null) {
      return obj
    }

    const newObj = { ...obj }

    Object.keys(newObj).forEach((key) => {
      const value = newObj[key]

      if (value instanceof Timestamp) {
        console.log(`convertTimestamps: Converting timestamp for key "${key}"`)
        newObj[key] = value.toDate()
      } else if (typeof value === "object" && value !== null) {
        newObj[key] = convertTimestamps(value)
      }
    })

    return newObj
  } catch (error) {
    console.error("convertTimestamps: Error converting timestamps:", error)
    return obj // Return the original object if conversion fails
  }
}
