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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const soldierInfo = soldierRoster.find((s) => s.id === id)

    if (!soldierInfo) {
      return NextResponse.json({ message: "Soldier not found" }, { status: 404 })
    }

    const latestFeed = await fetchLatestThingSpeakReading()

    if (!latestFeed) {
      return NextResponse.json({ message: "No IoT data available" }, { status: 503 })
    }

    const vitals = parseThingSpeakVitals(latestFeed, "soldier_1")
    const status = determineSoldierStatus(vitals.heartRate, vitals.temperature, vitals.bloodOxygenSaturation)

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
      bloodPressure: "120/80",
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
