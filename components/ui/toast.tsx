"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "./toast-provider"

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "destructive"
    title?: string
    description?: string
    action?: React.ReactNode
  }
>(({ className, variant = "default", title, description, action, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "destructive" && "destructive group border-destructive bg-destructive text-destructive-foreground",
        className,
      )}
      {...props}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {action}
    </div>
  )
})
Toast.displayName = "Toast"

const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
)
ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
        className,
      )}
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  ),
)
ToastClose.displayName = "ToastClose"

const ToastViewport = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
      {...props}
    />
  ),
)
ToastViewport.displayName = "ToastViewport"

const Toaster = () => {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:top-0 md:bottom-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-4 shadow-md ${
            toast.variant === "destructive"
              ? "border-red-500 bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-50"
              : "bg-white dark:bg-gray-800"
          }`}
          role="alert"
        >
          {toast.title && <h3 className="font-medium">{toast.title}</h3>}
          {toast.description && <p className="text-sm text-muted-foreground">{toast.description}</p>}
          <button
            onClick={() => dismiss(toast.id)}
            className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

// Export the toast function from useToast
const toast = (props: {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}) => {
  const { toast: toastFn } = useToast()
  toastFn(props)
}

export { Toast, ToastAction, ToastClose, ToastViewport, Toaster, toast }
