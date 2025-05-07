"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/toast"

export function SignInModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Attempting to sign in with Google...")
      await signInWithGoogle()
      console.log("Sign in successful!")
      toast({
        title: "Success!",
        description: "You have successfully signed in.",
        variant: "default",
      })
      onClose()
    } catch (err) {
      console.error("Error signing in with Google:", err)
      setError(err.message || "Failed to sign in with Google. Please try again.")
      toast({
        title: "Error",
        description: err.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Sign In</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" onClick={onClose} />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
