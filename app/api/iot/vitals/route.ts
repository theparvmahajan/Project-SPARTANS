import { NextResponse } from "next/server"
import { fetchThingSpeakData, parseThingSpeakVitals } from "@/lib/thingspeak"

export async function GET() {
  try {
    const thingSpeakData = await fetchThingSpeakData(50)

    if (!thingSpeakData.feeds || thingSpeakData.feeds.length === 0) {
      return NextResponse.json({ error: "No vitals data available" }, { status: 503 })
    }

    const sensors = thingSpeakData.feeds.flatMap((feed, index) => {
      const vitals = parseThingSpeakVitals(feed, `SOL00${(index % 4) + 1}`)

      return [
        {
          soldierId: vitals.soldierId,
          sensorId: `HEART_${vitals.soldierId}`,
          type: "heart_rate",
          value: vitals.heartRate,
          unit: "bpm",
          status: vitals.heartRate > 120 ? "critical" : vitals.heartRate > 100 ? "warning" : "normal",
        },
        {
          soldierId: vitals.soldierId,
          sensorId: `TEMP_${vitals.soldierId}`,
          type: "temperature",
          value: vitals.temperature,
          unit: "celsius",
          status: vitals.temperature > 38.5 ? "critical" : vitals.temperature > 37.5 ? "warning" : "normal",
        },
        {
          soldierId: vitals.soldierId,
          sensorId: `O2_${vitals.soldierId}`,
          type: "oxygen",
          value: vitals.bloodOxygenSaturation,
          unit: "percent",
          status:
            vitals.bloodOxygenSaturation < 94 ? "critical" : vitals.bloodOxygenSaturation < 96 ? "warning" : "normal",
        },
        {
          soldierId: vitals.soldierId,
          sensorId: `BATTERY_${vitals.soldierId}`,
          type: "battery",
          value: vitals.battery,
          unit: "percent",
          status: vitals.battery < 20 ? "critical" : vitals.battery < 50 ? "warning" : "normal",
        },
        {
          soldierId: vitals.soldierId,
          sensorId: `HUMIDITY_${vitals.soldierId}`,
          type: "humidity",
          value: vitals.humidity,
          unit: "percent",
          status: vitals.humidity > 80 ? "warning" : vitals.humidity < 20 ? "warning" : "normal",
        },
      ]
    })

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        sensors: sensors.slice(0, 20),
        totalSensors: sensors.length,
        dataSource: "ThingSpeak IoT Cloud",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      },
    )
  } catch (error) {
    console.error("Error in /api/iot/vitals:", error)
    return NextResponse.json({ error: "Failed to fetch vitals data" }, { status: 500 })
  }
}
