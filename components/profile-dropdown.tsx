"use client"

import { useState, useEffect } from "react"
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ProfileDropdownProps {
  onLogout: () => void
}

interface UserData {
  name: string
  email: string
  role?: string
  joinedDate?: string
}

export function ProfileDropdown({ onLogout }: ProfileDropdownProps) {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUserData(user)
      } catch (error) {
        console.error("[v0] Error parsing user data:", error)
      }
    }
  }, [])

  const getInitials = (name: string) => {
    if (!name) return "CM"
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Recently"
    }
  }

  if (!userData) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="cursor-pointer border-2 border-accent hover:border-accent/70 transition-colors">
          <AvatarFallback className="bg-accent text-accent-foreground font-bold">
            {getInitials(userData.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-card border-border">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-3 p-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-accent">
                <AvatarFallback className="bg-accent text-accent-foreground font-bold text-lg">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-foreground">{userData.name}</p>
                <p className="text-xs text-muted-foreground">{userData.role || "Commander"}</p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <div className="p-2 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5 text-sm">
            <Mail className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground truncate">{userData.email}</span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 text-sm">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Security: Active</span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 text-sm">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Joined: {formatDate(userData.joinedDate)}</span>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-semibold">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
