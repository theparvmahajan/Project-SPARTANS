"use client"

import { MapPin, Thermometer, Wind, Clock, User, AlertCircle, Heart, Battery, Droplets, LineChartIcon } from 'lucide-react'
import { VitalsChart } from "./vitals-chart"
import { MapComponent } from "./map-component"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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
  battery?: number
  humidity?: number
}

interface SoldierDetailProps {
  soldier: Soldier
}

export function SoldierDetail({ soldier }: SoldierDetailProps) {
  const getHealthStatus = (pulse: number, temp: number, o2: number): string => {
    // Temperature from sensor is in Celsius - 24°C is normal room temp, not body temp
    // Adjusted for environmental temperature readings
    if (pulse > 120 || pulse < 40 || temp > 45 || temp < -10 || o2 < 90) return "CRITICAL"
    if (pulse > 100 || pulse < 50 || temp > 40 || temp < 0 || o2 < 94) return "WARNING"
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

  const [showPulseChart, setShowPulseChart] = useState(false)
  const [pulseData, setPulseData] = useState<Array<{ time: string; pulse: number }>>([])
  const [isLoadingPulseData, setIsLoadingPulseData] = useState(false)

  useEffect(() => {
    if (showPulseChart && soldier.id === "soldier_1") {
      setIsLoadingPulseData(true)
      fetch("/api/soldiers/" + soldier.id + "/history")
        .then((res) => res.json())
        .then((data) => {
          if (data.history && Array.isArray(data.history)) {
            const formattedData = data.history.map((item: any) => ({
              time: new Date(item.timestamp).toLocaleTimeString("en-US", { 
                hour: "2-digit", 
                minute: "2-digit" 
              }),
              pulse: item.pulse || 0,
            }))
            setPulseData(formattedData)
          }
        })
        .catch((err) => {
          console.error("[v0] Error fetching pulse history:", err)
          setPulseData([])
        })
        .finally(() => {
          setIsLoadingPulseData(false)
        })
    }
  }, [showPulseChart, soldier.id])

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
      <div className="grid md:grid-cols-3 gap-4">
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
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">HEART RATE</p>
              <p className="font-semibold text-sm">Pulse</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPulseChart(true)}
              className="gap-2 border-accent/30 text-accent hover:bg-accent/10"
            >
              <LineChartIcon className="w-4 h-4" />
              Analyze
            </Button>
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
      </div>

      {/* Battery & Humidity */}
      {(soldier.battery !== undefined || soldier.humidity !== undefined) && (
        <div className="grid md:grid-cols-2 gap-4">
          {soldier.battery !== undefined && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/20">
                  <Battery className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">BATTERY LEVEL</p>
                  <p className="font-semibold text-sm">Device Power</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-accent font-mono">{soldier.battery.toFixed(0)}</div>
              <p className="text-sm text-muted-foreground">%</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    soldier.battery < 20 ? "bg-destructive" : soldier.battery < 50 ? "bg-yellow-500" : "bg-accent"
                  }`}
                  style={{ width: `${Math.min(soldier.battery, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {soldier.battery < 20 ? "Low battery!" : soldier.battery < 50 ? "Battery running low" : "Battery OK"}
              </p>
            </div>
          )}

          {soldier.humidity !== undefined && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/20">
                  <Droplets className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">HUMIDITY</p>
                  <p className="font-semibold text-sm">Environment</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-accent font-mono">{soldier.humidity.toFixed(0)}</div>
              <p className="text-sm text-muted-foreground">%</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.min(soldier.humidity, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {soldier.humidity > 70 ? "High humidity" : soldier.humidity < 30 ? "Low humidity" : "Humidity normal"}
              </p>
            </div>
          )}
        </div>
      )}

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
        <p className="text-lg font-mono text-accent truncate">
          {new Date(soldier.lastUpdate).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
        <p className="text-sm text-muted-foreground">
          {Math.round((Date.now() - new Date(soldier.lastUpdate).getTime()) / 1000)}s ago
        </p>
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

      {/* Pulse Chart Dialog */}
      <Dialog open={showPulseChart} onOpenChange={setShowPulseChart}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-accent flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Pulse Analysis - {soldier.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-1">
                <p className="text-xs text-muted-foreground">CURRENT</p>
                <p className="text-2xl font-bold text-accent">{soldier.pulse} bpm</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 space-y-1">
                <p className="text-xs text-muted-foreground">AVERAGE</p>
                <p className="text-2xl font-bold text-accent">
                  {pulseData.length > 0
                    ? Math.round(pulseData.reduce((sum, d) => sum + d.pulse, 0) / pulseData.length)
                    : soldier.pulse} bpm
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 space-y-1">
                <p className="text-xs text-muted-foreground">STATUS</p>
                <p className={`text-2xl font-bold ${getHealthColor(healthStatus)}`}>
                  {healthStatus}
                </p>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-accent">Historical Pulse Trend</h3>
              {isLoadingPulseData ? (
                <div className="flex items-center justify-center h-[280px]">
                  <p className="text-muted-foreground">Loading pulse data...</p>
                </div>
              ) : pulseData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={pulseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(238, 82, 83, 0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="rgba(255, 255, 255, 0.5)"
                      tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="rgba(255, 255, 255, 0.5)"
                      tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
                      domain={[40, 140]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "2px solid rgba(238, 82, 83, 0.5)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pulse"
                      stroke="rgba(239, 68, 68, 1)"
                      strokeWidth={3}
                      name="Heart Rate (bpm)"
                      dot={{ fill: "rgba(239, 68, 68, 1)", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[280px]">
                  <p className="text-muted-foreground">No historical data available</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
