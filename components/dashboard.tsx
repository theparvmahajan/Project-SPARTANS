"use client"

import { useState, useEffect } from "react"
import { SoldiersList } from "./soldiers-list"
import { SoldierDetail } from "./soldier-detail"
import { AlertsPanel } from "./alerts-panel"
import { MessagesInbox } from "./messages-inbox"
import { ProfileDropdown } from "./profile-dropdown"
import { Shield, AlertTriangle, LogOut, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Soldier {
  id: string
  name: string
  rank: string
  status: "active" | "inactive" | "critical"
  pulse: number
  position: { lat: number; lng: number }
  lastUpdate: string
  bloodOxygen: number
  temperature: number
}

interface Alert {
  id: string
  soldierId: string
  soldierName: string
  type: "critical" | "warning"
  message: string
  timestamp: string
  resolved: boolean
}

interface DashboardProps {
  onLogout: () => void
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [soldiers, setSoldiers] = useState<Soldier[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [selectedSoldierId, setSelectedSoldierId] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0)
  const [showMessages, setShowMessages] = useState(false)

  useEffect(() => {
    fetchSoldiers()
    const interval = setInterval(fetchSoldiers, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const checkUnreadMessages = () => {
      const storedMessages = localStorage.getItem("spartans_messages")
      if (storedMessages) {
        const messages = JSON.parse(storedMessages)
        const unread = messages.filter((msg: any) => !msg.read).length
        setUnreadMessagesCount(unread)
      }
    }
    
    checkUnreadMessages()
    const interval = setInterval(checkUnreadMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchSoldiers = async () => {
    try {
      console.log("[v0] Fetching soldiers data...")
      const response = await fetch("/api/soldiers", {
        cache: "no-store",
      })
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Received soldiers data, soldier count:", data.soldiers?.length)
        setSoldiers(data.soldiers || [])
        setAlerts(data.alerts || [])

        if (isInitialLoad && data.soldiers.length > 0) {
          const firstSoldier = data.soldiers[0]
          setSelectedSoldier(firstSoldier)
          setSelectedSoldierId(firstSoldier.id)
          setIsInitialLoad(false)
          console.log("[v0] Initial load - auto-selected first soldier:", firstSoldier.name)
        } else if (selectedSoldierId && data.soldiers.length > 0) {
          const updatedSoldier = data.soldiers.find((s: Soldier) => s.id === selectedSoldierId)
          if (updatedSoldier) {
            setSelectedSoldier(updatedSoldier)
            console.log("[v0] Updated selected soldier data:", updatedSoldier.name)
          }
        }
      }
    } catch (error) {
      console.log("[v0] Error fetching soldiers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectSoldier = (soldier: Soldier) => {
    console.log("[v0] User selected soldier:", soldier.name, soldier.id)
    setSelectedSoldier(soldier)
    setSelectedSoldierId(soldier.id)
  }

  const criticalAlerts = (alerts || []).filter((a) => a.type === "critical" && !a.resolved)

  const handleLogout = () => {
    setShowLogoutDialog(false)
    onLogout()
  }

  const handleLogoutButtonClick = () => {
    setShowLogoutDialog(true)
  }

  const handleProfileLogout = () => {
    setShowLogoutDialog(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold tracking-wider text-accent">SPARTANS</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowMessages(!showMessages)}
              variant="outline"
              className="border-accent/30 hover:bg-accent/10 hover:border-accent relative"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
              {unreadMessagesCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {unreadMessagesCount}
                </Badge>
              )}
            </Button>
            {criticalAlerts.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
                <span className="font-semibold text-destructive">{criticalAlerts.length} CRITICAL</span>
              </div>
            )}
            <Button
              onClick={handleLogoutButtonClick}
              variant="outline"
              className="border-accent/30 hover:bg-accent/10 hover:border-accent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <ProfileDropdown onLogout={handleProfileLogout} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Soldiers list */}
          <div className="lg:col-span-1">
            <SoldiersList
              soldiers={soldiers}
              selectedId={selectedSoldier?.id}
              onSelect={handleSelectSoldier}
              isLoading={isLoading}
            />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
            {showMessages ? (
              <MessagesInbox soldiers={soldiers} />
            ) : (
              <>
                {/* Alerts panel */}
                {alerts.length > 0 && <AlertsPanel alerts={alerts} onResolve={fetchSoldiers} />}

                {/* Soldier detail */}
                {selectedSoldier ? (
                  <SoldierDetail soldier={selectedSoldier} />
                ) : (
                  <div className="bg-card border border-border rounded-lg p-8 text-center space-y-4">
                    <Shield className="w-12 h-12 text-muted-foreground mx-auto" />
                    <h3 className="text-xl font-semibold">SELECT A SOLDIER</h3>
                    <p className="text-muted-foreground">
                      Choose a soldier from the list to view their real-time vitals and position data.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will be redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-accent hover:bg-accent/90">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
