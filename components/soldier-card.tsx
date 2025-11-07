"use client"

import { AlertTriangle, CheckCircle2, Heart, Droplet, Wind } from "lucide-react"

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

interface SoldierCardProps {
  soldier: Soldier
  isSelected: boolean
  onClick: () => void
}

export function SoldierCard({ soldier, isSelected, onClick }: SoldierCardProps) {
  const statusColors = {
    active: "border-green-700 bg-green-950/20",
    warning: "border-yellow-700 bg-yellow-950/20",
    critical: "border-red-700 bg-red-950/20",
  }

  const statusIcons = {
    active: <CheckCircle2 className="text-green-500" size={20} />,
    warning: <AlertTriangle className="text-yellow-500" size={20} />,
    critical: <AlertTriangle className="text-red-500" size={20} />,
  }

  const isVitalCritical = soldier.heartRate > 120 || soldier.temperature > 39 || soldier.oxygenLevel < 95

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
        isSelected ? "border-accent bg-accent/10" : statusColors[soldier.status]
      } hover:border-accent hover:bg-accent/5`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-foreground">
            {soldier.rank} {soldier.name}
          </h3>
          <p className="text-sm text-muted-foreground">{soldier.unit}</p>
        </div>
        <div>{statusIcons[soldier.status]}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className={`bg-secondary rounded p-3 ${isVitalCritical ? "ring-1 ring-red-500" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <Heart size={16} className="text-red-500" />
            <span className="text-xs text-muted-foreground">HR</span>
          </div>
          <p className="font-bold text-foreground">{soldier.heartRate} bpm</p>
        </div>

        <div className={`bg-secondary rounded p-3 ${isVitalCritical ? "ring-1 ring-red-500" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <Droplet size={16} className="text-yellow-500" />
            <span className="text-xs text-muted-foreground">TEMP</span>
          </div>
          <p className="font-bold text-foreground">{soldier.temperature.toFixed(1)}°C</p>
        </div>

        <div className={`bg-secondary rounded p-3 ${isVitalCritical ? "ring-1 ring-red-500" : ""}`}>
          <div className="flex items-center gap-2 mb-1">
            <Wind size={16} className="text-blue-500" />
            <span className="text-xs text-muted-foreground">O₂</span>
          </div>
          <p className="font-bold text-foreground">{soldier.oxygenLevel}%</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">Last update: {soldier.lastUpdate}</p>
    </button>
  )
}
