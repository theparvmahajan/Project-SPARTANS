"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/toast-provider"
import { AlertCircle, CheckCircle, Lock, Mail, User } from 'lucide-react'

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

  const calculatePasswordStrength = (password: string) => {
    if (!password) return { strength: "none", score: 0, color: "text-muted-foreground" }

    let score = 0
    const checks = {
      length: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isLong: password.length >= 12,
    }

    // Calculate score
    if (checks.length) score += 1
    if (checks.hasLower) score += 1
    if (checks.hasUpper) score += 1
    if (checks.hasNumber) score += 1
    if (checks.hasSpecial) score += 1
    if (checks.isLong) score += 1

    // Determine strength
    if (score <= 2) return { strength: "Weak", score, color: "text-destructive" }
    if (score <= 4) return { strength: "Medium", score, color: "text-yellow-500" }
    return { strength: "Strong", score, color: "text-green-500" }
  }

  const validatePassword = (password: string) => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters"
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter"
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter"
    if (!/\d/.test(password)) return "Password must contain at least one number"
    return null
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

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
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
        const userData = {
          ...data.user,
          joinedDate: new Date().toISOString(),
        }
        localStorage.setItem("user", JSON.stringify(userData))
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

  const passwordStrength = calculatePasswordStrength(formData.password)

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
          {!errors.password && formData.password && passwordStrength.strength !== "none" && (
            <div className="mt-2 space-y-1">
              <p className={`text-xs font-semibold ${passwordStrength.color}`}>
                Password strength: {passwordStrength.strength}
              </p>
              <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    passwordStrength.strength === "Weak"
                      ? "bg-destructive w-1/3"
                      : passwordStrength.strength === "Medium"
                        ? "bg-yellow-500 w-2/3"
                        : "bg-green-500 w-full"
                  }`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Must contain: uppercase, lowercase, number (8+ characters)
              </p>
            </div>
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
