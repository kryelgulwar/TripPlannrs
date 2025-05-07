"use client"

import type React from "react"
import { SimpleAuthProvider } from "@/lib/simple-auth-context"
import { BasicToastProvider } from "@/components/ui/basic-toast"
import { BasicDialogProvider } from "@/components/ui/basic-dialog"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BasicToastProvider>
      <BasicDialogProvider>
        <SimpleAuthProvider>{children}</SimpleAuthProvider>
      </BasicDialogProvider>
    </BasicToastProvider>
  )
}
