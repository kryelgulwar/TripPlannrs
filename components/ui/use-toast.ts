"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type ToastContextType = {
  toast: (props: ToastProps) => void
  dismiss: (id: string) => void
  toasts: Array<ToastProps & { id: string }>
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  dismiss: () => {},
  toasts: [],
})

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])

    if (props.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        dismiss(id)
      }, props.duration || 5000)
    }
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

const ToastContainer = () => {
  const { toasts, dismiss } = useContext(ToastContext)

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:top-0 md:bottom-auto">
      {toasts.map((toast) => (
        <div key={toast.id} className="rounded-lg border p-4 shadow-md bg-white dark:bg-gray-800" role="alert">
          {toast.title && <h3 className="font-medium">{toast.title}</h3>}
          {toast.description && <p className="text-sm text-muted-foreground">{toast.description}</p>}
          <button
            onClick={() => dismiss(toast.id)}
            className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
