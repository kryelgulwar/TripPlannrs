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
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore"

// Helper function to convert Firestore timestamps to ISO strings
export function convertTimestamps(data) {
  if (!data) return data

  if (data.toDate && typeof data.toDate === "function") {
    return data.toDate().toISOString()
  }

  if (Array.isArray(data)) {
    return data.map((item) => convertTimestamps(item))
  }

  if (typeof data === "object") {
    const result = {}
    for (const key in data) {
      result[key] = convertTimestamps(data[key])
    }
    return result
  }

  return data
}

// Create a user profile in Firestore
export async function createUserProfile(user) {
  if (!user) return null

  try {
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await setDoc(userRef, userData)
      console.log("User profile created:", user.uid)
      return user.uid
    } else {
      // Update last login time
      await updateDoc(userRef, {
        updatedAt: serverTimestamp(),
      })
      console.log("User profile updated:", user.uid)
      return user.uid
    }
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Get a user's itineraries
export async function getUserItineraries(userId) {
  if (!userId) return []

  try {
    const itinerariesQuery = query(
      collection(db, "itineraries"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc"),
    )

    const querySnapshot = await getDocs(itinerariesQuery)
    const itineraries = []

    querySnapshot.forEach((doc) => {
      itineraries.push({
        id: doc.id,
        ...convertTimestamps(doc.data()),
      })
    })

    return itineraries
  } catch (error) {
    console.error("Error getting user itineraries:", error)
    throw error
  }
}

// Get a specific itinerary
export async function getItinerary(id) {
  if (!id) return null

  try {
    const docRef = doc(db, "itineraries", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data()),
      }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting itinerary:", error)
    throw error
  }
}

// Delete an itinerary
export async function deleteItinerary(id) {
  if (!id) return null

  try {
    await deleteDoc(doc(db, "itineraries", id))
    return id
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    throw error
  }
}

// Save an itinerary
export async function saveItinerary(itineraryData, userId) {
  try {
    const itineraryWithMetadata = {
      ...itineraryData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, "itineraries"), itineraryWithMetadata)
    return docRef.id
  } catch (error) {
    console.error("Error saving itinerary:", error)
    throw error
  }
}

// Update an itinerary
export async function updateItinerary(id, itineraryData) {
  try {
    const itineraryRef = doc(db, "itineraries", id)

    await updateDoc(itineraryRef, {
      ...itineraryData,
      updatedAt: serverTimestamp(),
    })

    return id
  } catch (error) {
    console.error("Error updating itinerary:", error)
    throw error
  }
}
