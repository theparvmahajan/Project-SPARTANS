"use client"

import { useEffect, useState } from "react"
import { SoldierCard } from "@/components/soldier-card"

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
}

interface SoldierListProps {
  onSelectSoldier: (id: string) => void
  selectedId: string | null
}

export function SoldierList({ onSelectSoldier, selectedId }: SoldierListProps) {
  const [soldiers, setSoldiers] = useState<Soldier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSoldiers = async () => {
      try {
        const response = await fetch("/api/soldiers")
        const data = await response.json()
        setSoldiers(data)
      } catch {
        console.error("Failed to fetch soldiers")
      } finally {
        setLoading(false)
      }
    }

    fetchSoldiers()
    const interval = setInterval(fetchSoldiers, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground">Loading soldier data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-black text-accent mb-2">Deployed Soldiers</h2>
        <p className="text-muted-foreground text-sm">Click on a soldier to view detailed vitals and position</p>
      </div>

      <div className="space-y-3">
        {soldiers.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No soldiers deployed</p>
          </div>
        ) : (
          soldiers.map((soldier) => (
            <SoldierCard
              key={soldier.id}
              soldier={soldier}
              isSelected={selectedId === soldier.id}
              onClick={() => onSelectSoldier(soldier.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
