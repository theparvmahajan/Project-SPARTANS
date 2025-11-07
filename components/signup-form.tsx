"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/toast-provider"
import { AlertCircle, CheckCircle, Lock, Mail, User } from "lucide-react"

interface SignupFormProps {
  onSuccess: () => void
  onSwitchToLogin: () => void
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const { addToast } = useToast()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        addToast("Account created successfully", "success")
        setTimeout(onSuccess, 500)
      } else {
        addToast(data.message || "Signup failed", "error")
      }
    } catch {
      addToast("Connection error", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  return (
    <div className="space-y-6 bg-card border border-border rounded-xl p-8 animate-slide-in-top shadow-2xl">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-accent">SPARTANS</h1>
        <p className="text-muted-foreground text-sm">Create Commander Account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-accent" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleInputChange("name")}
            className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all ${
              errors.name ? "border-destructive focus:ring-destructive" : "border-border focus:ring-accent"
            }`}
            placeholder="Commander Name"
            disabled={loading}
          />
          {errors.name && (
            <div className="flex items-center gap-2 mt-1 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.name}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-accent" />
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={handleInputChange("email")}
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
            value={formData.password}
            onChange={handleInputChange("password")}
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
          {!errors.password && formData.password && (
            <p className="text-xs text-muted-foreground mt-1">Password strength: Strong</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent" />
            Confirm Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 transition-all ${
              errors.confirmPassword ? "border-destructive focus:ring-destructive" : "border-border focus:ring-accent"
            }`}
            placeholder="••••••••"
            disabled={loading}
          />
          {errors.confirmPassword && (
            <div className="flex items-center gap-2 mt-1 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.confirmPassword}
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
              Creating account...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Sign Up
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin} className="text-accent font-bold hover:text-red-400 transition-colors">
            Login here
          </button>
        </p>
      </div>
    </div>
  )
}
