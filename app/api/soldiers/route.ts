import { NextResponse } from "next/server"
import { fetchLatestThingSpeakReading, parseThingSpeakVitals, determineSoldierStatus } from "@/lib/thingspeak"

const soldierRoster = [
  { id: "soldier_1", name: "James Mitchell", rank: "SGT", unit: "Alpha Squadron" },
  { id: "soldier_2", name: "Sarah Rodriguez", rank: "CPL", unit: "Alpha Squadron" },
  { id: "soldier_3", name: "Marcus Johnson", rank: "SPC", unit: "Bravo Squadron" },
  { id: "soldier_4", name: "Emily Chen", rank: "SGT", unit: "Bravo Squadron" },
  { id: "soldier_5", name: "David Thompson", rank: "PFC", unit: "Charlie Squadron" },
  { id: "soldier_6", name: "Jessica Martinez", rank: "CPL", unit: "Charlie Squadron" },
  { id: "soldier_7", name: "Robert Williams", rank: "SGT", unit: "Delta Squadron" },
  { id: "soldier_8", name: "Amanda Davis", rank: "SPC", unit: "Delta Squadron" },
]

export async function GET() {
  try {
    const latestFeed = await fetchLatestThingSpeakReading()

    if (!latestFeed) {
      console.error("[v0] No feeds available from ThingSpeak")
      return NextResponse.json({ error: "No data available from IoT sensors" }, { status: 503 })
    }

    console.log("[v0] Received ThingSpeak data:", latestFeed)

    const vitals = parseThingSpeakVitals(latestFeed, "soldier_1")
    const status = determineSoldierStatus(vitals.heartRate, vitals.temperature, vitals.bloodOxygenSaturation, vitals.timestamp)

    const soldiers = soldierRoster.map((soldier) => ({
      id: soldier.id,
      name: soldier.name,
      rank: soldier.rank,
      unit: soldier.unit,
      status,
      pulse: vitals.heartRate,
      temperature: vitals.temperature,
      bloodOxygen: vitals.bloodOxygenSaturation,
      battery: vitals.battery,
      humidity: vitals.humidity,
      lastUpdate: vitals.timestamp,
      position: { lat: vitals.latitude, lng: vitals.longitude },
    }))

    const alerts = soldiers
      .filter((s) => s.status === "critical")
      .map((s) => ({
        id: `ALR${s.id}`,
        soldierId: s.id,
        soldierName: s.name,
        type: "critical" as const,
        message: `Critical vitals detected - HR: ${s.pulse}bpm, Temp: ${s.temperature}°C, O2: ${s.bloodOxygen}%`,
        timestamp: s.lastUpdate,
        resolved: false,
      }))

    console.log("[v0] Sending soldier data:", { soldierCount: soldiers.length, alerts })

    return NextResponse.json({
      soldiers,
      alerts,
      timestamp: new Date().toISOString(),
      dataSource: "ThingSpeak IoT Cloud - Channel 3159678",
    })
  } catch (error) {
    console.error("[v0] Error in /api/soldiers:", error)
    return NextResponse.json({ error: "Failed to fetch soldier data from IoT sensors" }, { status: 500 })
  }
}
