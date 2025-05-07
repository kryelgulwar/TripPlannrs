"use client"

import React from "react"
import { useToast } from "./use-toast"

export function Toast({ title, description, variant = "default", duration = 5000 }) {
  const { toast } = useToast()

  React.useEffect(() => {
    toast({ title, description, variant, duration })
  }, [title, description, variant, duration, toast])

  return null
}

export function useToastComponent() {
  const { toast } = useToast()

  const showToast = (props) => {
    toast(props)
  }

  return { showToast }
}
