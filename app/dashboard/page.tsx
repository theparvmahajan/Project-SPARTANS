"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SoldierList } from "@/components/soldier-list"
import { AlertPanel } from "@/components/alert-panel"
import { LogOut } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedSoldier, setSelectedSoldier] = useState<string | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-accent">SPARTANS</h1>
            <p className="text-xs text-muted-foreground">Soldier Health Monitoring System</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <LogOut className="text-accent" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Soldier List */}
          <div className="lg:col-span-2">
            <SoldierList onSelectSoldier={setSelectedSoldier} selectedId={selectedSoldier} />
          </div>

          {/* Alert Panel */}
          <div>
            <AlertPanel />
          </div>
        </div>
      </main>
    </div>
  )
}
