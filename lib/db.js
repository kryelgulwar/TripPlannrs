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
} from "firebase/firestore"

// Create a new document
export async function createDocument(collectionName, id, data) {
  try {
    await setDoc(doc(db, collectionName, id), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return { id }
  } catch (error) {
    console.error("Error creating document:", error)
    throw error
  }
}

// Get a document by ID
export async function getDocument(collectionName, id) {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting document:", error)
    throw error
  }
}

// Update a document
export async function updateDocument(collectionName, id, data) {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    })
    return { id }
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

// Delete a document
export async function deleteDocument(collectionName, id) {
  try {
    await deleteDoc(doc(db, collectionName, id))
    return { id }
  } catch (error) {
    console.error("Error deleting document:", error)
    throw error
  }
}

// Get all documents from a collection
export async function getCollection(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting collection:", error)
    throw error
  }
}

// Query documents
export async function queryDocuments(collectionName, conditions = [], sortOptions = []) {
  try {
    let q = collection(db, collectionName)

    if (conditions.length > 0) {
      const queryConstraints = conditions.map((condition) =>
        where(condition.field, condition.operator, condition.value),
      )
      q = query(q, ...queryConstraints)
    }

    if (sortOptions.length > 0) {
      const orderByConstraints = sortOptions.map((option) => orderBy(option.field, option.direction || "asc"))
      q = query(q, ...orderByConstraints)
    }

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error querying documents:", error)
    throw error
  }
}

// Get an itinerary by ID
export async function getItinerary(id) {
  try {
    const itinerary = await getDocument("itineraries", id)
    if (itinerary) {
      return convertTimestamps(itinerary)
    }
    return null
  } catch (error) {
    console.error("Error getting itinerary:", error)
    throw error
  }
}

// Delete an itinerary
export async function deleteItinerary(id) {
  try {
    await deleteDocument("itineraries", id)
    return { id }
  } catch (error) {
    console.error("Error deleting itinerary:", error)
    throw error
  }
}

// Convert Firestore Timestamps to ISO strings
export function convertTimestamps(data) {
  if (!data) return data

  const isTimestamp = (value) =>
    value && typeof value === "object" && value.seconds !== undefined && value.nanoseconds !== undefined

  if (Array.isArray(data)) {
    return data.map((item) => convertTimestamps(item))
  }

  if (typeof data === "object" && data !== null) {
    if (isTimestamp(data)) {
      return new Date(data.seconds * 1000).toISOString()
    }

    const result = {}
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        result[key] = convertTimestamps(data[key])
      }
    }
    return result
  }

  return data
}

// Create a user profile
export async function createUserProfile(userId, userData) {
  try {
    await setDoc(doc(db, "users", userId), {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    return { id: userId }
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

// Get all itineraries for a user
export async function getUserItineraries(userId) {
  try {
    const conditions = [{ field: "userId", operator: "==", value: userId }]
    const sortOptions = [{ field: "updatedAt", direction: "desc" }]

    const itineraries = await queryDocuments("itineraries", conditions, sortOptions)
    return itineraries.map((itinerary) => convertTimestamps(itinerary))
  } catch (error) {
    console.error("Error getting user itineraries:", error)
    throw error
  }
}
