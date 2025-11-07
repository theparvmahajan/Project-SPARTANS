"use client"

import { useState } from "react"
import { Loader2, Search } from "lucide-react"

interface Soldier {
  id: string
  name: string
  rank: string
  status: "active" | "inactive" | "critical"
  pulse: number
}

interface SoldiersListProps {
  soldiers: Soldier[]
  selectedId?: string
  onSelect: (soldier: Soldier) => void
  isLoading: boolean
}

export function SoldiersList({ soldiers, selectedId, onSelect, isLoading }: SoldiersListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "critical">("all")

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "critical":
        return "bg-destructive/10 border-destructive/30 text-destructive"
      case "active":
        return "bg-accent/10 border-accent/30 text-accent"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusDot = (status: string): string => {
    switch (status) {
      case "critical":
        return "bg-destructive animate-pulse"
      case "active":
        return "bg-accent"
      default:
        return "bg-muted-foreground"
    }
  }

  const filteredSoldiers = soldiers.filter((soldier) => {
    const matchesSearch =
      soldier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      soldier.rank.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || soldier.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col h-full">
      <div className="bg-card/50 border-b border-border px-4 py-3">
        <h2 className="font-semibold text-accent">DEPLOYED SOLDIERS</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {filteredSoldiers.length} of {soldiers.length}
        </p>
      </div>

      <div className="border-b border-border px-4 py-3 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search soldiers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "critical", "inactive"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 px-2 py-1 text-xs font-semibold rounded border transition-colors ${
                filterStatus === status
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
      ) : filteredSoldiers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground text-sm">No soldiers found</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredSoldiers.map((soldier) => (
            <button
              key={soldier.id}
              onClick={() => onSelect(soldier)}
              className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                selectedId === soldier.id ? "bg-accent/20 border-accent/50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getStatusDot(soldier.status)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm truncate">{soldier.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(soldier.status)}`}>
                      {soldier.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{soldier.rank}</p>
                  <div className="mt-2 text-xs text-accent">
                    <span className="font-mono">HR: {soldier.pulse} bpm</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
