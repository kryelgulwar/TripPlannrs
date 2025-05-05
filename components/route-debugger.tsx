"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export function RouteDebugger() {
  const pathname = usePathname()

  useEffect(() => {
    console.log("Current route:", pathname)
  }, [pathname])

  return null // This component doesn't render anything
}
