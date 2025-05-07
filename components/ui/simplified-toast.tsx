"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { X } from "lucide-react"

// Simple toast context
type Toast = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

type ToastContextType = {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function Toaster({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`relative rounded-lg border p-4 shadow-md ${
            toast.variant === "destructive" ? "bg-red-50 border-red-500" : "bg-white"
          }`}
        >
          {toast.title && <h3 className="font-medium">{toast.title}</h3>}
          {toast.description && <p className="text-sm text-gray-600">{toast.description}</p>}
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function toast(props: Omit<Toast, "id">) {
  try {
    const { addToast } = useToastContext()
    addToast(props)
  } catch (error) {
    console.error("Toast called outside of provider", error)
  }
}
