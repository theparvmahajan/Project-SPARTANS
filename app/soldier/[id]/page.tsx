"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { SoldierDetailsView } from "@/components/soldier-details-view"
import { ArrowLeft } from "lucide-react"

interface Soldier {
  id: string
  name: string
  rank: string
  unit: string
  status: "active" | "warning" | "critical"
  heartRate: number
  temperature: number
  oxygenLevel: number
  lastUpdate: string
  latitude: number
  longitude: number
  location: string
  bloodPressure: string
  bloodOxygenSaturation: number
  coreTemperature: number
  fatigueMeter: number
  hydrationStatus: string
  deploymentStatus: string
  equipment: string[]
}

export default function SoldierDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [soldier, setSoldier] = useState<Soldier | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSoldier = async () => {
      try {
        const response = await fetch(`/api/soldiers/${params.id}`)
        const data = await response.json()
        setSoldier(data)
      } catch {
        console.error("Failed to fetch soldier details")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSoldier()
      const interval = setInterval(fetchSoldier, 3000)
      return () => clearInterval(interval)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading soldier details...</p>
      </div>
    )
  }

  if (!soldier) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Soldier not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ArrowLeft className="text-accent" size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-accent">SPARTANS</h1>
            <p className="text-xs text-muted-foreground">Soldier Detail View</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SoldierDetailsView soldier={soldier} />
      </main>
    </div>
  )
}
