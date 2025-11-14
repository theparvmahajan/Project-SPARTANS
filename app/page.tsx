"use client"

import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing-page"
import { HomePage } from "@/components/home-page"
import { AuthPage } from "@/components/auth-page"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [showLanding, setShowLanding] = useState(true)
  const [currentPage, setCurrentPage] = useState<"home" | "login" | "signup">("home")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowLanding(true)
    setCurrentPage("home")
    setTimeout(() => {
      setShowLanding(false)
    }, 5000)
  }

  if (showLanding) {
    return <LandingPage />
  }

  if (!isLoggedIn) {
    if (currentPage === "home") {
      return <HomePage onLoginClick={() => setCurrentPage("login")} onSignupClick={() => setCurrentPage("signup")} />
    }
    return (
      <AuthPage
        onAuthSuccess={() => setIsLoggedIn(true)}
        initialMode={currentPage === "signup" ? "signup" : "login"}
        onSwitchMode={(mode) => {
          if (mode === "home") {
            setCurrentPage("home")
          } else {
            setCurrentPage(mode)
          }
        }}
      />
    )
  }

  return <Dashboard onLogout={handleLogout} />
}
