import { db } from "./firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"

// Helper function to convert Firestore timestamps to ISO strings
export const convertTimestamps = (data) => {
  if (!data) return data

  if (data instanceof Timestamp) {
    return data.toDate().toISOString()
  }

  if (Array.isArray(data)) {
    return data.map((item) => convertTimestamps(item))
  }

  if (typeof data === "object" && data !== null) {
    return Object.keys(data).reduce((result, key) => {
      result[key] = convertTimestamps(data[key])
      return result
    }, {})
  }

  return data
}

// Create a user profile
export const createUserProfile = async (userId, userData) => {
  try {
    console.log("Creating user profile for:", userId)
    const userRef = doc(db, "users", userId)

    // Check if user already exists
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      console.log("User doesn't exist, creating new profile")
      // Create new user
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log("User profile created successfully")
    } else {
      console.log("User already exists, updating profile")
      // Update existing user
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      })
      console.log("User profile updated successfully")
    }

    return userId
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Get a user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return convertTimestamps({ id: userSnap.id, ...userSnap.data() })
    }

    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

// Get an itinerary by ID
export const getItinerary = async (itineraryId) => {
  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    const itinerarySnap = await getDoc(itineraryRef)

    if (itinerarySnap.exists()) {
      return convertTimestamps({ id: itinerarySnap.id, ...itinerarySnap.data() })
    }

    return null
  } catch (error) {
    console.error("Error getting itinerary:", error)
    throw error
  }
}

// Get all itineraries for a user
export const getUserItineraries = async (userId) => {
  try {
    const itinerariesRef = collection(db, "itineraries")
    const q = query(itinerariesRef, where("userId", "==", userId), orderBy("updatedAt", "desc"))

    const querySnapshot = await getDocs(q)
    const itineraries = []

    querySnapshot.forEach((doc) => {
      itineraries.push(convertTimestamps({ id: doc.id, ...doc.data() }))
    })

    return itineraries
  } catch (error) {
    console.error("Error getting user itineraries:", error)
    throw error
  }
}

// Create a new itinerary
export const createItinerary = async (itineraryData) => {
  try {
    const itinerariesRef = collection(db, "itineraries")

    const docRef = await addDoc(itinerariesRef, {
      ...itineraryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating itinerary:", error)
    throw error
  }
}

// Update an existing itinerary
export const updateItinerary = async (itineraryId, itineraryData) => {
  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)

    await updateDoc(itineraryRef, {
      ...itineraryData,
      updatedAt: serverTimestamp(),
    })

    return itineraryId
  } catch (error) {
    console.error("Error updating itinerary:", error)
    throw error
  }
}

// Delete an itinerary
export const deleteItinerary = async (itineraryId) => {
  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    await deleteDoc(itineraryRef)
    return itineraryId
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    throw error
  }
}
