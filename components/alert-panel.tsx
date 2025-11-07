"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Bell } from "lucide-react"

interface Alert {
  id: string
  soldierName: string
  type: "critical" | "warning"
  message: string
  timestamp: string
  isCritical: boolean
}

export function AlertPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/alerts")
        const data = await response.json()
        setAlerts(data)
      } catch {
        console.error("Failed to fetch alerts")
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 3000)
    return () => clearInterval(interval)
  }, [])

  const criticalAlerts = alerts.filter((a) => a.type === "critical")
  const warningAlerts = alerts.filter((a) => a.type === "warning")

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-black text-accent mb-4 flex items-center gap-2">
          <Bell size={20} />
          System Alerts
        </h2>

        {/* Critical Alerts */}
        {criticalAlerts.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-bold text-red-400 uppercase mb-2">Critical ({criticalAlerts.length})</p>
            <div className="space-y-2">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="bg-red-950/40 border border-red-700 rounded-lg p-3 animate-pulse-glow">
                  <div className="flex gap-2">
                    <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
                    <div className="min-w-0">
                      <p className="font-bold text-red-100 text-sm">{alert.soldierName}</p>
                      <p className="text-xs text-red-200">{alert.message}</p>
                      <p className="text-xs text-red-300 mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning Alerts */}
        {warningAlerts.length > 0 && (
          <div>
            <p className="text-xs font-bold text-yellow-400 uppercase mb-2">Warnings ({warningAlerts.length})</p>
            <div className="space-y-2">
              {warningAlerts.map((alert) => (
                <div key={alert.id} className="bg-yellow-950/40 border border-yellow-700 rounded-lg p-3">
                  <div className="flex gap-2">
                    <AlertTriangle className="text-yellow-500 flex-shrink-0" size={16} />
                    <div className="min-w-0">
                      <p className="font-bold text-yellow-100 text-sm">{alert.soldierName}</p>
                      <p className="text-xs text-yellow-200">{alert.message}</p>
                      <p className="text-xs text-yellow-300 mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && <p className="text-muted-foreground text-sm">All systems nominal</p>}
      </div>

      {/* Critical Alert Button */}
      {criticalAlerts.length > 0 && (
        <button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-lg transition-colors animate-pulse-glow">
          ACTIVATE CRITICAL ALERT PROTOCOL
        </button>
      )}
    </div>
  )
}
