import { NextResponse } from "next/server"
import { fetchThingSpeakData, parseThingSpeakVitals } from "@/lib/thingspeak"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const soldierId = params.id

    // Only fetch real ThingSpeak data for soldier_1 (James Mitchell)
    if (soldierId === "soldier_1") {
      console.log("[v0] Fetching ThingSpeak data for pulse history...")
      const data = await fetchThingSpeakData(50) // Get last 50 readings
      
      if (!data || !data.feeds || data.feeds.length === 0) {
        console.log("[v0] No feeds available from ThingSpeak")
        return NextResponse.json({
          success: true,
          history: [],
          count: 0,
        })
      }

      const history = data.feeds.map((feed) => {
        const vitals = parseThingSpeakVitals(feed, soldierId)
        return {
          timestamp: vitals.timestamp,
          pulse: vitals.heartRate,
        }
      })
      
      console.log("[v0] Processed", history.length, "pulse readings from ThingSpeak")

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
      { error: "Failed to fetch pulse history", success: false, history: [], count: 0 },
      { status: 500 }
    )
  }
}
