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
  try {
    const itineraryRef = collection(db, "itineraries")
    const docRef = await addDoc(itineraryRef, {
      ...itineraryData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { id: docRef.id, ...itineraryData }
  } catch (error) {
    console.error("Error creating itinerary:", error)
    throw error
  }
}

export const getUserItineraries = async (userId: string) => {
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

export const getItinerary = async (itineraryId: string) => {
  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    const itinerarySnap = await getDoc(itineraryRef)

    if (itinerarySnap.exists()) {
      return { id: itinerarySnap.id, ...itinerarySnap.data() }
    } else {
      throw new Error("Itinerary not found")
    }
  } catch (error) {
    console.error("Error getting itinerary:", error)
    throw error
  }
}

export const updateItinerary = async (itineraryId: string, itineraryData: any) => {
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
  try {
    const itineraryRef = doc(db, "itineraries", itineraryId)
    await deleteDoc(itineraryRef)
    return true
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    throw error
  }
}

// Helper function to convert Firestore timestamps to JS Date objects
export const convertTimestamps = (obj: any) => {
  if (!obj) return obj

  const newObj = { ...obj }

  Object.keys(newObj).forEach((key) => {
    if (newObj[key] instanceof Timestamp) {
      newObj[key] = newObj[key].toDate()
    } else if (typeof newObj[key] === "object" && newObj[key] !== null) {
      newObj[key] = convertTimestamps(newObj[key])
    }
  })

  return newObj
}
