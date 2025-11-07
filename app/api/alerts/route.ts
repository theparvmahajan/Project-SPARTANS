import { NextResponse } from "next/server"

export async function GET() {
  const alerts = [
    {
      id: "1",
      soldierName: "David Chen (PVT)",
      type: "critical" as const,
      message: "Heart rate critically elevated (132 bpm) + High fever (39.5°C)",
      timestamp: "1 second ago",
      isCritical: true,
    },
    {
      id: "2",
      soldierName: "Sarah Rodriguez (CPT)",
      type: "warning" as const,
      message: "Elevated heart rate (95 bpm) and low hydration levels",
      timestamp: "5 seconds ago",
      isCritical: false,
    },
  ]

  return NextResponse.json(alerts)
}
