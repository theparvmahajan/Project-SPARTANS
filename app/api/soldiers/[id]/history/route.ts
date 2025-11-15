import { NextResponse } from "next/server"
import { fetchThingSpeakData, parseThingSpeakVitals } from "@/lib/thingspeak"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const soldierId = params.id

    // Only fetch real ThingSpeak data for soldier_1 (James Mitchell)
    if (soldierId === "soldier_1") {
      const data = await fetchThingSpeakData(50) // Get last 50 readings
      
      const history = data.feeds.map((feed) => {
        const vitals = parseThingSpeakVitals(feed, soldierId)
        return {
          timestamp: vitals.timestamp,
          pulse: vitals.heartRate,
        }
      }).reverse() // Reverse to show oldest to newest

      return NextResponse.json({
        success: true,
        history,
        count: history.length,
      })
    }

    // For other soldiers, return empty history
    return NextResponse.json({
      success: true,
      history: [],
      count: 0,
    })
  } catch (error) {
    console.error("[v0] Error fetching pulse history:", error)
    return NextResponse.json(
      { error: "Failed to fetch pulse history" },
      { status: 500 }
    )
  }
}
