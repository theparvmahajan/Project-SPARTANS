"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type: Toast["type"], duration?: number) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast["type"], duration = 4000) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const context = useContext(ToastContext)
  if (!context) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {context.toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => context.removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const bgColor = {
    success: "bg-green-900 border-green-600",
    error: "bg-red-900 border-red-600",
    warning: "bg-yellow-900 border-yellow-600",
    info: "bg-blue-900 border-blue-600",
  }[toast.type]

  const textColor = {
    success: "text-green-100",
    error: "text-red-100",
    warning: "text-yellow-100",
    info: "text-blue-100",
  }[toast.type]

  return (
    <div className={`${bgColor} border ${textColor} px-4 py-3 rounded-lg shadow-lg max-w-md animate-slide-in-top`}>
      <div className="flex justify-between items-center">
        <span>{toast.message}</span>
        <button onClick={onClose} className="text-lg ml-4 opacity-70 hover:opacity-100">
          ×
        </button>
      </div>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
