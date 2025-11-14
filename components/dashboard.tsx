"use client"

import { useState, useEffect } from "react"
import { SoldiersList } from "./soldiers-list"
import { SoldierDetail } from "./soldier-detail"
import { AlertsPanel } from "./alerts-panel"
import { Button } from "@/components/ui/button"
import { Shield, LogOut, AlertTriangle } from 'lucide-react'
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

  useEffect(() => {
    fetchSoldiers()
    const interval = setInterval(fetchSoldiers, 2000) // Fetch data every 2 seconds for near real-time updates
    return () => clearInterval(interval)
  }, [])

  const fetchSoldiers = async () => {
    try {
      console.log("[v0] Fetching soldiers data...")
      const response = await fetch("/api/soldiers", {
        cache: "no-store", // Prevent caching
      })
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Received soldiers data:", data)
        setSoldiers(data.soldiers || [])
        setAlerts(data.alerts || [])

        if (selectedSoldier && data.soldiers.length > 0) {
          const updatedSoldier = data.soldiers.find((s: Soldier) => s.id === selectedSoldier.id)
          if (updatedSoldier) {
            setSelectedSoldier(updatedSoldier)
          }
        } else if (!selectedSoldier && data.soldiers.length > 0) {
          // Auto-select first soldier
          setSelectedSoldier(data.soldiers[0])
        }
      }
    } catch (error) {
      console.log("[v0] Error fetching soldiers:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const criticalAlerts = (alerts || []).filter((a) => a.type === "critical" && !a.resolved)

  const handleLogout = () => {
    setShowLogoutDialog(false)
    onLogout()
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
            {criticalAlerts.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
                <span className="font-semibold text-destructive">{criticalAlerts.length} CRITICAL</span>
              </div>
            )}
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="outline"
              size="sm"
              className="border-accent text-accent hover:bg-accent/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              LOGOUT
            </Button>
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
              onSelect={setSelectedSoldier}
              isLoading={isLoading}
            />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-3 space-y-6">
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
