import { NextResponse } from "next/server"
import { fetchThingSpeakData, parseThingSpeakVitals } from "@/lib/thingspeak"

export async function GET() {
  try {
    const thingSpeakData = await fetchThingSpeakData(50)

    if (!thingSpeakData.feeds || thingSpeakData.feeds.length === 0) {
      return NextResponse.json({ error: "No location data available" }, { status: 503 })
    }

    const locations = thingSpeakData.feeds.slice(0, 4).map((feed, index) => {
      const vitals = parseThingSpeakVitals(feed, `SOL00${index + 1}`)

      return {
        soldierId: vitals.soldierId,
        name: `Soldier ${index + 1}`,
        rank: ["LT", "SGT", "CPL", "PVT"][index % 4],
        latitude: vitals.latitude,
        longitude: vitals.longitude,
        accuracy: 5,
        altitude: 10 + Math.random() * 5,
        heading: Math.random() * 360,
        speed: Math.random() * 5,
        lastUpdate: vitals.timestamp,
      }
    })

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        locations,
        totalLocations: locations.length,
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
    console.error("Error in /api/iot/locations:", error)
    return NextResponse.json({ error: "Failed to fetch location data" }, { status: 500 })
  }
}
