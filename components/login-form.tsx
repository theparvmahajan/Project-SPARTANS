"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/toast-provider"
import { AlertCircle, CheckCircle, Lock, Mail } from "lucide-react"

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToSignup: () => void
}

export function LoginForm({ onSuccess, onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const { addToast } = useToast()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        addToast("Login successful", "success")
        setTimeout(onSuccess, 500)
      } else {
        addToast(data.message || "Login failed", "error")
      }
    } catch {
      addToast("Connection error", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 bg-card border border-border rounded-xl p-8 animate-slide-in-top shadow-2xl">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-accent">SPARTANS</h1>
        <p className="text-muted-foreground text-sm">Commander Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-accent" />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all ${
              errors.email ? "border-destructive focus:ring-destructive" : "border-border focus:ring-accent"
            }`}
            placeholder="commander@spartans.mil"
            disabled={loading}
          />
          {errors.email && (
            <div className="flex items-center gap-2 mt-1 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors({ ...errors, password: undefined })
            }}
            className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all ${
              errors.password ? "border-destructive focus:ring-destructive" : "border-border focus:ring-accent"
            }`}
            placeholder="••••••••"
            disabled={loading}
          />
          {errors.password && (
            <div className="flex items-center gap-2 mt-1 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.password}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin"></div>
              Logging in...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Login
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Don't have an account?{" "}
          <button onClick={onSwitchToSignup} className="text-accent font-bold hover:text-red-400 transition-colors">
            Sign up here
          </button>
        </p>
      </div>
    </div>
  )
}
