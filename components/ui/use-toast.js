"use client"

import { createContext, useContext, useState } from "react"

// Simple toast context
const ToastContext = createContext({
  toast: () => {},
  dismiss: () => {},
  toasts: [],
})

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const toast = (props) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])

    if (props.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        dismiss(id)
      }, props.duration || 5000)
    }
  }

  const dismiss = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
        {toasts.map((toast) => (
          <div key={toast.id} className="rounded-lg border p-4 shadow-md bg-white" role="alert">
            {toast.title && <h3 className="font-medium">{toast.title}</h3>}
            {toast.description && <p className="text-sm">{toast.description}</p>}
            <button
              onClick={() => dismiss(toast.id)}
              className="absolute top-2 right-2 rounded-full p-1"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
