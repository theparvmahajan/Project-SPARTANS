import { NextResponse } from "next/server"
import { fetchThingSpeakData, parseThingSpeakVitals, determineSoldierStatus, generateAlert } from "@/lib/thingspeak"

export async function GET() {
  try {
    const thingSpeakData = await fetchThingSpeakData(100)

    if (!thingSpeakData.feeds || thingSpeakData.feeds.length === 0) {
      return NextResponse.json({ alerts: [], timestamp: new Date().toISOString() })
    }

    const alerts = thingSpeakData.feeds
      .slice(0, 4)
      .map((feed, index) => {
        const vitals = parseThingSpeakVitals(feed, `SOL00${index + 1}`)
        const status = determineSoldierStatus(vitals.heartRate, vitals.temperature, vitals.bloodOxygenSaturation)
        const alert = generateAlert(
          vitals.soldierId,
          vitals.soldierName,
          vitals.heartRate,
          vitals.temperature,
          vitals.bloodOxygenSaturation,
        )

        return {
          id: `ALR${index + 1}`,
          soldierId: vitals.soldierId,
          soldierName: vitals.soldierName,
          type: status === "critical" ? "critical" : status === "warning" ? "warning" : "normal",
          message: alert.message,
          timestamp: vitals.timestamp,
          isCritical: status === "critical",
          resolved: false,
        }
      })
      .filter((a) => a.type !== "normal")

    return NextResponse.json({
      alerts,
      timestamp: new Date().toISOString(),
      dataSource: "ThingSpeak IoT Cloud",
    })
  } catch (error) {
    console.error("[v0] Error in /api/alerts:", error)
    return NextResponse.json({ alerts: [], error: "Failed to fetch alerts" }, { status: 500 })
  }
}
