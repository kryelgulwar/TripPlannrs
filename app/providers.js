"use client"

import { ToastProvider } from "@/components/ui/toast-provider"

export function Providers({ children }) {
  return <ToastProvider>{children}</ToastProvider>
}
