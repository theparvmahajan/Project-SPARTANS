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

function generateCriticalVitals() {
  return {
    heartRate: Math.floor(Math.random() * 30) + 150, // 150-180 bpm (critical high)
    temperature: Math.random() * 2 + 39.5, // 39.5-41.5°C (critical high fever)
    bloodOxygenSaturation: Math.floor(Math.random() * 10) + 75, // 75-85% (critical low)
    battery: Math.floor(Math.random() * 20) + 10, // 10-30% (low battery)
    humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
    latitude: 28.617 + (Math.random() - 0.5) * 0.01, // Near base location
    longitude: 77.199 + (Math.random() - 0.5) * 0.01,
    timestamp: new Date().toISOString(),
  }
}

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

    const amandaCriticalVitals = generateCriticalVitals()

    const soldiers = soldierRoster.map((soldier) => {
      // Use critical random values for Amanda Davis
      if (soldier.id === "soldier_8") {
        return {
          id: soldier.id,
          name: soldier.name,
          rank: soldier.rank,
          unit: soldier.unit,
          status: "critical" as const,
          pulse: amandaCriticalVitals.heartRate,
          temperature: amandaCriticalVitals.temperature,
          bloodOxygen: amandaCriticalVitals.bloodOxygenSaturation,
          battery: amandaCriticalVitals.battery,
          humidity: amandaCriticalVitals.humidity,
          lastUpdate: amandaCriticalVitals.timestamp,
          position: { lat: amandaCriticalVitals.latitude, lng: amandaCriticalVitals.longitude },
        }
      }

      // Use ThingSpeak data for all other soldiers
      return {
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
      }
    })

    const alerts = soldiers
      .filter((s) => s.status === "critical")
      .map((s) => ({
        id: `ALR${s.id}`,
        soldierId: s.id,
        soldierName: s.name,
        type: "critical" as const,
        message: `Critical vitals detected - HR: ${s.pulse}bpm, Temp: ${s.temperature.toFixed(1)}°C, O2: ${s.bloodOxygen}%`,
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
