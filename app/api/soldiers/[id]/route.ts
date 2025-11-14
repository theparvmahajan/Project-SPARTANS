import { type NextRequest, NextResponse } from "next/server"
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
    latitude: 28.617 + (Math.random() - 0.5) * 0.01,
    longitude: 77.199 + (Math.random() - 0.5) * 0.01,
    timestamp: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const soldierInfo = soldierRoster.find((s) => s.id === id)

    if (!soldierInfo) {
      return NextResponse.json({ message: "Soldier not found" }, { status: 404 })
    }

    let vitals
    let status

    if (id === "soldier_8") {
      // Generate critical vitals for Amanda Davis
      const criticalVitals = generateCriticalVitals()
      vitals = {
        heartRate: criticalVitals.heartRate,
        temperature: criticalVitals.temperature,
        bloodOxygenSaturation: criticalVitals.bloodOxygenSaturation,
        battery: criticalVitals.battery,
        humidity: criticalVitals.humidity,
        latitude: criticalVitals.latitude,
        longitude: criticalVitals.longitude,
        timestamp: criticalVitals.timestamp,
      }
      status = "critical" as const
    } else {
      // Fetch from ThingSpeak for other soldiers
      const latestFeed = await fetchLatestThingSpeakReading()

      if (!latestFeed) {
        return NextResponse.json({ message: "No IoT data available" }, { status: 503 })
      }

      vitals = parseThingSpeakVitals(latestFeed, "soldier_1")
      status = determineSoldierStatus(vitals.heartRate, vitals.temperature, vitals.bloodOxygenSaturation, vitals.timestamp)
    }

    const soldierDetail = {
      id,
      name: soldierInfo.name,
      rank: soldierInfo.rank,
      unit: soldierInfo.unit,
      status,
      pulse: vitals.heartRate,
      heartRate: vitals.heartRate,
      temperature: vitals.temperature,
      bloodOxygen: vitals.bloodOxygenSaturation,
      oxygenLevel: vitals.bloodOxygenSaturation,
      battery: vitals.battery,
      humidity: vitals.humidity,
      lastUpdate: vitals.timestamp,
      position: {
        lat: vitals.latitude,
        lng: vitals.longitude,
      },
      latitude: vitals.latitude,
      longitude: vitals.longitude,
      location: "Forward Operating Base Alpha",
      bloodPressure: status === "critical" ? "160/110" : "120/80",
      bloodOxygenSaturation: vitals.bloodOxygenSaturation,
      coreTemperature: vitals.temperature,
      hydrationStatus: vitals.humidity > 70 ? "High" : vitals.humidity < 30 ? "Low" : "Optimal",
      deploymentStatus: status === "critical" ? "Emergency Medical Required" : "Active Mission",
      equipment: ["GPS Device", "Heart Monitor", "Temperature Sensor", "Humidity Sensor", "Battery Monitor"],
    }

    console.log("[v0] Sending soldier detail:", soldierDetail)

    return NextResponse.json(soldierDetail)
  } catch (error) {
    console.error("[v0] Error in /api/soldiers/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch soldier details" }, { status: 500 })
  }
}
