import { db } from "./firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

// Helper function to convert Firestore timestamps to ISO strings
export const convertTimestamps = (data) => {
  if (!data) return data

  if (data.toDate && typeof data.toDate === "function") {
    return data.toDate().toISOString()
  }

  if (Array.isArray(data)) {
    return data.map((item) => convertTimestamps(item))
  }

  if (typeof data === "object" && data !== null) {
    const result = {}
    Object.keys(data).forEach((key) => {
      result[key] = convertTimestamps(data[key])
    })
    return result
  }

  return data
}

// Create a user profile in Firestore
export const createUserProfile = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      })
    }

    return uid
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Get an itinerary by ID
export const getItinerary = async (id) => {
  try {
    const itineraryRef = doc(db, "itineraries", id)
    const itinerarySnap = await getDoc(itineraryRef)

    if (!itinerarySnap.exists()) {
      return null
    }

    const data = itinerarySnap.data()
    return {
      id: itinerarySnap.id,
      ...convertTimestamps(data),
    }
  } catch (error) {
    console.error("Error getting itinerary:", error)
    throw error
  }
}

// Delete an itinerary by ID
export const deleteItinerary = async (id) => {
  try {
    await deleteDoc(doc(db, "itineraries", id))
    return id
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    throw error
  }
}

// Get all itineraries for a user
export const getUserItineraries = async (userId) => {
  try {
    const itinerariesQuery = query(
      collection(db, "itineraries"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc"),
    )

    const itinerariesSnap = await getDocs(itinerariesQuery)
    const itineraries = []

    itinerariesSnap.forEach((doc) => {
      const data = doc.data()
      itineraries.push({
        id: doc.id,
        ...convertTimestamps(data),
      })
    })

    return itineraries
  } catch (error) {
    console.error("Error getting user itineraries:", error)
    throw error
  }
}
