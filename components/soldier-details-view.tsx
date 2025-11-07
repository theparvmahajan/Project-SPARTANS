"use client"

import type React from "react"

import { Heart, Droplet, Wind, Activity, Zap } from "lucide-react"
import { MapComponent } from "@/components/map-component"
import { VitalsChart } from "@/components/vitals-chart"

interface SoldierDetailsViewProps {
  soldier: {
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
}

export function SoldierDetailsView({ soldier }: SoldierDetailsViewProps) {
  const statusColors = {
    active: "text-green-400 bg-green-950/20 border-green-700",
    warning: "text-yellow-400 bg-yellow-950/20 border-yellow-700",
    critical: "text-red-400 bg-red-950/20 border-red-700",
  }

  const statusLabels = {
    active: "OPERATIONAL",
    warning: "CAUTION",
    critical: "CRITICAL",
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className={`bg-card border-2 rounded-xl p-6 ${statusColors[soldier.status]}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-black text-foreground">
              {soldier.rank} {soldier.name}
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              {soldier.unit} • {soldier.location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">{statusLabels[soldier.status]}</div>
            <p className="text-sm text-muted-foreground">Updated: {soldier.lastUpdate}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Deployment Status</p>
            <p className="font-bold text-foreground text-sm mt-1">{soldier.deploymentStatus}</p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Unit Status</p>
            <p className="font-bold text-foreground text-sm mt-1">{soldier.status.toUpperCase()}</p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Hydration</p>
            <p className="font-bold text-foreground text-sm mt-1">{soldier.hydrationStatus}</p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Fatigue Level</p>
            <p className="font-bold text-foreground text-sm mt-1">{soldier.fatigueMeter}%</p>
          </div>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <VitalCard
          icon={Heart}
          label="Heart Rate"
          value={`${soldier.heartRate}`}
          unit="bpm"
          status={soldier.heartRate > 120 ? "critical" : soldier.heartRate > 100 ? "warning" : "normal"}
          range="60-100 bpm"
        />
        <VitalCard
          icon={Droplet}
          label="Temperature"
          value={soldier.temperature.toFixed(1)}
          unit="°C"
          status={soldier.temperature > 39 ? "critical" : soldier.temperature > 38 ? "warning" : "normal"}
          range="36.5-37.5°C"
        />
        <VitalCard
          icon={Wind}
          label="Oxygen Level"
          value={`${soldier.oxygenLevel}`}
          unit="%"
          status={soldier.oxygenLevel < 95 ? "critical" : soldier.oxygenLevel < 97 ? "warning" : "normal"}
          range="95-100%"
        />
        <VitalCard
          icon={Activity}
          label="Blood Pressure"
          value={soldier.bloodPressure}
          unit=""
          status="normal"
          range="120/80 mmHg"
        />
      </div>

      {/* Secondary Vitals and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Secondary Vitals */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-accent">Advanced Metrics</h2>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-foreground">Blood Oxygen Saturation</p>
                <span className="text-lg font-black text-accent">{soldier.bloodOxygenSaturation}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full"
                  style={{ width: `${soldier.bloodOxygenSaturation}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-foreground">Fatigue Meter</p>
                <span className="text-lg font-black text-accent">{soldier.fatigueMeter}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${soldier.fatigueMeter}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-foreground">Core Temperature</p>
                <span className="text-lg font-black text-accent">{soldier.coreTemperature}°C</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(soldier.coreTemperature / 40) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <h3 className="text-lg font-black text-accent mb-3">Active Equipment</h3>
            <div className="bg-card border border-border rounded-xl p-4 space-y-2">
              {soldier.equipment.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-secondary rounded-lg">
                  <Zap size={16} className="text-accent" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <MapComponent
          latitude={soldier.latitude}
          longitude={soldier.longitude}
          soldierName={`${soldier.rank} ${soldier.name}`}
        />
      </div>

      {/* Vitals Chart */}
      <VitalsChart soldierName={`${soldier.rank} ${soldier.name}`} />
    </div>
  )
}

interface VitalCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical"
  range: string
}

function VitalCard({ icon: Icon, label, value, unit, status, range }: VitalCardProps) {
  const statusColors = {
    normal: "border-green-700 bg-green-950/20 ring-green-700",
    warning: "border-yellow-700 bg-yellow-950/20 ring-yellow-700",
    critical: "border-red-700 bg-red-950/20 ring-red-700",
  }

  return (
    <div className={`border-2 rounded-xl p-4 ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">Normal: {range}</p>
        </div>
        <Icon size={20} className="text-accent" />
      </div>
      <p className="text-3xl font-black text-foreground">
        {value}
        <span className="text-lg ml-1">{unit}</span>
      </p>
    </div>
  )
}
