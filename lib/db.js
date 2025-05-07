import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "./firebase"

// Create or update user profile in Firestore
export async function createUserProfile(user) {
  if (!db || !user) return null

  try {
    const userRef = doc(db, "users", user.uid)
    const userSnap = await getDoc(userRef)

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      lastLogin: new Date().toISOString(),
    }

    if (!userSnap.exists()) {
      // New user, add created date
      userData.createdAt = new Date().toISOString()
    }

    await setDoc(userRef, userData, { merge: true })
    console.log("User profile created/updated successfully")
    return userData
  } catch (error) {
    console.error("Error creating user profile:", error)
    return null
  }
}

// Get user profile from Firestore
export async function getUserProfile(uid) {
  if (!db || !uid) return null

  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      console.log("No user profile found")
      return null
    }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

// Create a new itinerary
export async function createItinerary(itineraryData, userId) {
  if (!db || !userId) return null

  try {
    const itineraryRef = collection(db, "itineraries")
    const newItinerary = {
      ...itineraryData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const docRef = await addDoc(itineraryRef, newItinerary)
    console.log("Itinerary created with ID:", docRef.id)
    return { id: docRef.id, ...newItinerary }
  } catch (error) {
    console.error("Error creating itinerary:", error)
    return null
  }
}

// Get all itineraries for a user
export async function getUserItineraries(userId) {
  if (!db || !userId) return []

  try {
    const itinerariesRef = collection(db, "itineraries")
    const q = query(itinerariesRef, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    const itineraries = []
    querySnapshot.forEach((doc) => {
      itineraries.push({ id: doc.id, ...doc.data() })
    })

    return itineraries
  } catch (error) {
    console.error("Error getting user itineraries:", error)
    return []
  }
}

// Get a single itinerary by ID
export async function getItineraryById(itineraryId) {
  if (!db || !itineraryId) return null

  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    const itinerarySnap = await getDoc(itineraryRef)

    if (itinerarySnap.exists()) {
      return { id: itinerarySnap.id, ...itinerarySnap.data() }
    } else {
      console.log("No itinerary found with ID:", itineraryId)
      return null
    }
  } catch (error) {
    console.error("Error getting itinerary:", error)
    return null
  }
}

// Update an itinerary
export async function updateItinerary(itineraryId, updateData) {
  if (!db || !itineraryId) return false

  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    await updateDoc(itineraryRef, {
      ...updateData,
      updatedAt: new Date().toISOString(),
    })
    console.log("Itinerary updated successfully")
    return true
  } catch (error) {
    console.error("Error updating itinerary:", error)
    return false
  }
}

// Delete an itinerary
export async function deleteItinerary(itineraryId) {
  if (!db || !itineraryId) return false

  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    await deleteDoc(itineraryRef)
    console.log("Itinerary deleted successfully")
    return true
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    return false
  }
}
