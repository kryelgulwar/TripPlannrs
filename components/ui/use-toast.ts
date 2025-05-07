"use client"

import type React from "react"

// Simplified version of the use-toast.ts file
import { useState, createContext, useContext } from "react"

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

type ToastActionType = {
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id: string) => void
  toasts: ToastProps[]
}

const ToastContext = createContext<ToastActionType>({
  toast: () => {},
  dismiss: () => {},
  toasts: [],
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ ...props }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...props }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return <ToastContext.Provider value={{ toast, dismiss, toasts }}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const toast = (props: Omit<ToastProps, "id">) => {
  // This is a fallback for when the hook is not available
  console.warn("Toast was called outside of a ToastProvider. This is a no-op.")
}
