"use client"

import type React from "react"

import { ToastProviderWrapper } from "@/components/ui/toast-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProviderWrapper>{children}</ToastProviderWrapper>
}
