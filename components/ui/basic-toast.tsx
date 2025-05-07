"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Simple types
type Toast = {
  id: string
  message: string
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (message: string) => void
  removeToast: (id: string) => void
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Provider component
export function BasicToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [...prev, { id, message }])

    // Auto dismiss
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Context value
  const value = {
    toasts,
    addToast,
    removeToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="bg-white rounded-md shadow-md p-4 border">
            <p>{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="ml-2 text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook to use toast
export function useBasicToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useBasicToast must be used within a BasicToastProvider")
  }
  return context
}

// Helper function
export function toast(message: string) {
  // This is just a placeholder - it will be replaced at runtime
  console.log("Toast:", message)
}
