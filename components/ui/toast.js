"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastProvider = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})
ToastProvider.displayName = "ToastProvider"

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
      {...props}
    />
  )
})
ToastViewport.displayName = "ToastViewport"

const Toast = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "destructive"
          ? "destructive group border-destructive bg-destructive text-destructive-foreground"
          : "border bg-background text-foreground",
        className,
      )}
      {...props}
    />
  )
})
Toast.displayName = "Toast"

const ToastAction = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className,
      )}
      {...props}
    />
  )
})
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className,
      )}
      toast-close=""
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  )
})
ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
})
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
})
ToastDescription.displayName = "ToastDescription"

// Simple Toaster component
export function Toaster() {
  const [toasts, setToasts] = React.useState([])

  React.useEffect(() => {
    // Create a custom event listener for toast events
    const handleToast = (event) => {
      const { title, description, variant, duration } = event.detail
      const id = Math.random().toString(36).substring(2, 9)

      setToasts((prev) => [...prev, { id, title, description, variant, duration }])

      if (duration !== Number.POSITIVE_INFINITY) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, duration || 5000)
      }
    }

    window.addEventListener("toast", handleToast)
    return () => window.removeEventListener("toast", handleToast)
  }, [])

  return (
    <ToastViewport>
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          <ToastClose onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
        </Toast>
      ))}
    </ToastViewport>
  )
}

// Helper function to show toasts
export function toast({ title, description, variant, duration }) {
  const event = new CustomEvent("toast", {
    detail: {
      title,
      description,
      variant,
      duration,
    },
  })
  window.dispatchEvent(event)
}

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }
