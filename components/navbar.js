"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"

export function Navbar({ onSignInClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  useEffect(() => {
    console.log("Navbar mounted, user:", user ? user.uid : "none")
  }, [user])

  const isLoggedIn = !!user

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.displayName) return "U"
    return user.displayName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    try {
      console.log("Signing out...")
      await signOut()
      console.log("Signed out successfully")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleSignInClick = () => {
    console.log("Sign in button clicked in navbar")
    if (onSignInClick) {
      onSignInClick()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2 font-bold">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            TripPlannrs
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          {isLoggedIn ? (
            <>
              <Link href="/generate" className="text-sm hover:text-primary">
                Generate Itinerary
              </Link>
              <Link href="/dashboard" className="text-sm hover:text-primary">
                My Trips
              </Link>
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start">
                    <span className="font-medium">{user?.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="#features" className="text-sm hover:text-primary">
                Features
              </Link>
              <Link href="#testimonials" className="text-sm hover:text-primary">
                Testimonials
              </Link>
              <Link href="#about" className="text-sm hover:text-primary">
                About Us
              </Link>
              <Link href="#contact" className="text-sm hover:text-primary">
                Contact
              </Link>
              <ModeToggle />
              <Button size="sm" onClick={handleSignInClick}>
                Sign In
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <ModeToggle />
          {isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="font-medium">{user?.displayName}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <button onClick={toggleMenu} className="text-foreground">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-b bg-background/95 px-4 py-4 backdrop-blur-sm md:hidden">
          <nav className="flex flex-col space-y-4">
            {isLoggedIn ? (
              <>
                <Link href="/generate" className="hover:text-primary" onClick={toggleMenu}>
                  Generate Itinerary
                </Link>
                <Link href="/dashboard" className="hover:text-primary" onClick={toggleMenu}>
                  My Trips
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-destructive hover:text-destructive/80"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="#features" className="hover:text-primary" onClick={toggleMenu}>
                  Features
                </Link>
                <Link href="#testimonials" className="hover:text-primary" onClick={toggleMenu}>
                  Testimonials
                </Link>
                <Link href="#about" className="hover:text-primary" onClick={toggleMenu}>
                  About Us
                </Link>
                <Link href="#contact" className="hover:text-primary" onClick={toggleMenu}>
                  Contact
                </Link>
                <Button
                  className="w-full"
                  onClick={() => {
                    toggleMenu()
                    if (onSignInClick) {
                      onSignInClick()
                    }
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
