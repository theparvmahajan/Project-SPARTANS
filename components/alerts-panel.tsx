"use client"

import { AlertTriangle, AlertCircle, X, Bell, Heart } from "lucide-react"
import { useState } from "react"

interface Alert {
  id: string
  soldierId: string
  soldierName: string
  type: "critical" | "warning"
  message: string
  timestamp: string
  resolved: boolean
  vitalType?: "pulse" | "temperature" | "oxygen"
  value?: number
}

interface AlertsPanelProps {
  alerts: Alert[]
  onResolve: () => void
}

export function AlertsPanel({ alerts, onResolve }: AlertsPanelProps) {
  const [resolvedAlerts, setResolvedAlerts] = useState<Set<string>>(new Set())
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set())

  const activeAlerts = alerts.filter((a) => !a.resolved && !resolvedAlerts.has(a.id))

  if (activeAlerts.length === 0) return null

  const criticalAlerts = activeAlerts.filter((a) => a.type === "critical")
  const warningAlerts = activeAlerts.filter((a) => a.type === "warning")

  const handleResolve = (id: string) => {
    const newResolved = new Set(resolvedAlerts)
    newResolved.add(id)
    setResolvedAlerts(newResolved)
  }

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedAlerts)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedAlerts(newExpanded)
  }

  const getVitalIcon = (vitalType?: string) => {
    switch (vitalType) {
      case "pulse":
        return <Heart className="w-4 h-4" />
      case "temperature":
        return <AlertCircle className="w-4 h-4" />
      case "oxygen":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-4">
      {criticalAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg">
            <Bell className="w-5 h-5 text-destructive animate-pulse" />
            <h3 className="font-bold text-destructive">CRITICAL ALERTS ({criticalAlerts.length})</h3>
          </div>
          {criticalAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-destructive/10 border-2 border-destructive/30 rounded-lg overflow-hidden hover:border-destructive/50 transition-colors"
            >
              <button
                onClick={() => toggleExpanded(alert.id)}
                className="w-full text-left p-4 flex items-start gap-3 hover:bg-destructive/5 transition-colors"
              >
                <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-destructive text-sm">CRITICAL ALERT</p>
                  <p className="text-destructive font-semibold">{alert.soldierName}</p>
                  <p className="text-destructive/80 text-sm mt-1">{alert.message}</p>
                  {alert.value && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-destructive/70">
                      {getVitalIcon(alert.vitalType)}
                      <span>Value: {alert.value}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-destructive/60 whitespace-nowrap">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResolve(alert.id)
                    }}
                    className="text-destructive hover:bg-destructive/20 p-2 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </button>
              {expandedAlerts.has(alert.id) && (
                <div className="border-t border-destructive/20 px-4 py-3 bg-destructive/5 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2 text-destructive/80">
                    <div>
                      <p className="text-xs text-destructive/60 uppercase">Soldier ID</p>
                      <p className="font-mono text-xs">{alert.soldierId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-destructive/60 uppercase">Timestamp</p>
                      <p className="font-mono text-xs">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {warningAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-yellow-500">WARNINGS ({warningAlerts.length})</h3>
          </div>
          {warningAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg overflow-hidden hover:border-yellow-500/50 transition-colors"
            >
              <button
                onClick={() => toggleExpanded(alert.id)}
                className="w-full text-left p-4 flex items-start gap-3 hover:bg-yellow-500/5 transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-yellow-500 text-sm">WARNING</p>
                  <p className="text-yellow-500 font-semibold">{alert.soldierName}</p>
                  <p className="text-yellow-500/80 text-sm mt-1">{alert.message}</p>
                  {alert.value && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-yellow-500/70">
                      {getVitalIcon(alert.vitalType)}
                      <span>Value: {alert.value}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-yellow-500/60 whitespace-nowrap">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResolve(alert.id)
                    }}
                    className="text-yellow-500 hover:bg-yellow-500/20 p-2 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </button>
              {expandedAlerts.has(alert.id) && (
                <div className="border-t border-yellow-500/20 px-4 py-3 bg-yellow-500/5 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2 text-yellow-500/80">
                    <div>
                      <p className="text-xs text-yellow-500/60 uppercase">Soldier ID</p>
                      <p className="font-mono text-xs">{alert.soldierId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-yellow-500/60 uppercase">Timestamp</p>
                      <p className="font-mono text-xs">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
