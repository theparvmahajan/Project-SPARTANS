"use client"

import { MapPin, Thermometer, Wind, Clock, User, AlertCircle, Heart } from "lucide-react"
import { VitalsChart } from "./vitals-chart"
import { MapComponent } from "./map-component"

interface Soldier {
  id: string
  name: string
  rank: string
  unit?: string
  status: "active" | "inactive" | "critical"
  pulse: number
  position: { lat: number; lng: number }
  lastUpdate: string
  bloodOxygen: number
  temperature: number
}

interface SoldierDetailProps {
  soldier: Soldier
}

export function SoldierDetail({ soldier }: SoldierDetailProps) {
  const getHealthStatus = (pulse: number, temp: number, o2: number): string => {
    if (pulse > 120 || pulse < 40 || temp > 38.5 || temp < 35.5 || o2 < 94) return "CRITICAL"
    if (pulse > 100 || pulse < 50 || temp > 38 || temp < 36 || o2 < 96) return "WARNING"
    return "NORMAL"
  }

  const getHealthColor = (status: string): string => {
    switch (status) {
      case "CRITICAL":
        return "text-destructive"
      case "WARNING":
        return "text-yellow-500"
      default:
        return "text-accent"
    }
  }

  const getStatusBgColor = (status: string): string => {
    switch (status) {
      case "CRITICAL":
        return "bg-destructive/10 border-destructive/30"
      case "WARNING":
        return "bg-yellow-500/10 border-yellow-500/30"
      default:
        return "bg-accent/10 border-accent/30"
    }
  }

  const healthStatus = getHealthStatus(soldier.pulse, soldier.temperature, soldier.bloodOxygen)

  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{soldier.name}</h2>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="text-lg">{soldier.rank}</span>
              {soldier.unit && (
                <>
                  <span>•</span>
                  <span>{soldier.unit}</span>
                </>
              )}
            </div>
          </div>
          <div className={`text-right space-y-1 px-4 py-2 rounded-lg border ${getStatusBgColor(healthStatus)}`}>
            <p className="text-xs text-muted-foreground">HEALTH STATUS</p>
            <p className={`font-bold text-lg ${getHealthColor(healthStatus)}`}>{healthStatus}</p>
          </div>
        </div>
        {healthStatus !== "NORMAL" && (
          <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
            <AlertCircle className={`w-4 h-4 ${getHealthColor(healthStatus)}`} />
            <p className="text-sm text-muted-foreground">
              {healthStatus === "CRITICAL"
                ? "Soldier requires immediate medical attention"
                : "Soldier vitals show warning indicators"}
            </p>
          </div>
        )}
      </div>

      {/* Vitals grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                healthStatus === "CRITICAL"
                  ? "bg-destructive/20"
                  : healthStatus === "WARNING"
                    ? "bg-yellow-500/20"
                    : "bg-accent/20"
              }`}
            >
              <Heart className={`w-5 h-5 ${getHealthColor(healthStatus)}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">HEART RATE</p>
              <p className="font-semibold text-sm">Pulse</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-accent font-mono">{soldier.pulse}</div>
          <p className="text-sm text-muted-foreground">bpm</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                healthStatus === "CRITICAL"
                  ? "bg-destructive"
                  : healthStatus === "WARNING"
                    ? "bg-yellow-500"
                    : "bg-accent"
              }`}
              style={{ width: `${Math.min((soldier.pulse / 150) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Normal: 60-100 bpm</p>
        </div>

        {/* Blood Oxygen */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/20">
              <Wind className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">O₂ SATURATION</p>
              <p className="font-semibold text-sm">SpO2</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-accent font-mono">{soldier.bloodOxygen}</div>
          <p className="text-sm text-muted-foreground">%</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${Math.min((soldier.bloodOxygen / 100) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Normal: ≥96%</p>
        </div>

        {/* Temperature */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/20">
              <Thermometer className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">TEMPERATURE</p>
              <p className="font-semibold text-sm">Core Temp</p>
            </div>
          </div>
          <div className="text-4xl font-bold text-accent font-mono">{soldier.temperature.toFixed(1)}</div>
          <p className="text-sm text-muted-foreground">°C</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${Math.min(((soldier.temperature - 35) / 5) * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Normal: 36.1-37.2°C</p>
        </div>

        {/* Last Update */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/20">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">LAST UPDATE</p>
              <p className="font-semibold text-sm">Timestamp</p>
            </div>
          </div>
          <p className="text-lg font-mono text-accent truncate">{new Date(soldier.lastUpdate).toLocaleTimeString()}</p>
          <p className="text-sm text-muted-foreground">
            {Math.round((Date.now() - new Date(soldier.lastUpdate).getTime()) / 1000)}s ago
          </p>
        </div>
      </div>

      {/* Position */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">GPS POSITION</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-4 space-y-1">
            <p className="text-xs text-muted-foreground">LATITUDE</p>
            <p className="text-lg font-mono text-accent">{soldier.position.lat.toFixed(6)}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 space-y-1">
            <p className="text-xs text-muted-foreground">LONGITUDE</p>
            <p className="text-lg font-mono text-accent">{soldier.position.lng.toFixed(6)}</p>
          </div>
        </div>
      </div>

      {/* Soldier ID */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          <h3 className="font-semibold">SOLDIER ID</h3>
        </div>
        <p className="font-mono text-accent text-sm bg-muted/30 rounded-lg p-3">{soldier.id}</p>
      </div>

      <VitalsChart soldierName={soldier.name} />

      <MapComponent latitude={soldier.position.lat} longitude={soldier.position.lng} soldierName={soldier.name} />
    </div>
  )
}
