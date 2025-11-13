import { type NextRequest, NextResponse } from "next/server"
import { fetchLatestThingSpeakReading, parseThingSpeakVitals, determineSoldierStatus } from "@/lib/thingspeak"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (id !== "soldier_1") {
      return NextResponse.json({ message: "Soldier not found" }, { status: 404 })
    }

    const latestFeed = await fetchLatestThingSpeakReading()

    if (!latestFeed) {
      return NextResponse.json({ message: "No IoT data available" }, { status: 503 })
    }

    const vitals = parseThingSpeakVitals(latestFeed, id)
    const status = determineSoldierStatus(vitals.heartRate, vitals.temperature, vitals.bloodOxygenSaturation)

    const soldierDetail = {
      id,
      name: "Soldier 1",
      rank: "SGT",
      unit: "Alpha Squadron",
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
