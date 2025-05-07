"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

// Types
type DialogContextType = {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
}

// Create context
const DialogContext = createContext<DialogContextType | undefined>(undefined)

// Provider component
export function BasicDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openDialog = () => setIsOpen(true)
  const closeDialog = () => setIsOpen(false)

  // Context value
  const value = {
    isOpen,
    openDialog,
    closeDialog,
  }

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}

// Hook to use dialog
export function useBasicDialog() {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error("useBasicDialog must be used within a BasicDialogProvider")
  }
  return context
}

// Dialog component
export function BasicDialog({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  const { isOpen, closeDialog } = useBasicDialog()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-4 max-w-md w-full">
        {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
        <div>{children}</div>
        <button onClick={closeDialog} className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          Close
        </button>
      </div>
    </div>
  )
}

// Dialog trigger
export function BasicDialogTrigger({
  children,
}: {
  children: React.ReactNode
}) {
  const { openDialog } = useBasicDialog()

  return <button onClick={openDialog}>{children}</button>
}

// Export named components
export const DialogClose = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { closeDialog } = useBasicDialog()

  return <button onClick={closeDialog}>{children}</button>
}
