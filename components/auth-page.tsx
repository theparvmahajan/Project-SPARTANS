"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"

interface AuthPageProps {
  onAuthSuccess: () => void
  initialMode: "login" | "signup"
  onSwitchMode: (mode: "login" | "signup") => void
}

export function AuthPage({ onAuthSuccess, initialMode, onSwitchMode }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode)

  const handleSwitchMode = (newMode: "login" | "signup") => {
    setMode(newMode)
    onSwitchMode(newMode)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === "login" ? (
          <LoginForm onSuccess={onAuthSuccess} onSwitchToSignup={() => handleSwitchMode("signup")} />
        ) : (
          <SignupForm onSuccess={onAuthSuccess} onSwitchToLogin={() => handleSwitchMode("login")} />
        )}
      </div>
    </div>
  )
}
