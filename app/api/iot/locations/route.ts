import { NextResponse } from "next/server"

export async function GET() {
  const locationData = {
    timestamp: new Date().toISOString(),
    locations: [
      {
        soldierId: "SOL001",
        name: "James Marcus",
        rank: "LT",
        latitude: 40.7128 + Math.random() * 0.01 - 0.005,
        longitude: -74.006 + Math.random() * 0.01 - 0.005,
        accuracy: 5,
        altitude: 10,
        heading: Math.random() * 360,
        speed: Math.random() * 5,
        lastUpdate: new Date().toISOString(),
      },
      {
        soldierId: "SOL002",
        name: "Sarah Chen",
        rank: "SGT",
        latitude: 40.7131 + Math.random() * 0.01 - 0.005,
        longitude: -74.0072 + Math.random() * 0.01 - 0.005,
        accuracy: 5,
        altitude: 12,
        heading: Math.random() * 360,
        speed: Math.random() * 4,
        lastUpdate: new Date().toISOString(),
      },
      {
        soldierId: "SOL003",
        name: "David Rodriguez",
        rank: "CPL",
        latitude: 40.7135 + Math.random() * 0.01 - 0.005,
        longitude: -74.0068 + Math.random() * 0.01 - 0.005,
        accuracy: 5,
        altitude: 9,
        heading: Math.random() * 360,
        speed: Math.random() * 6,
        lastUpdate: new Date().toISOString(),
      },
      {
        soldierId: "SOL004",
        name: "Emily Watson",
        rank: "LT",
        latitude: 40.714 + Math.random() * 0.01 - 0.005,
        longitude: -74.0065 + Math.random() * 0.01 - 0.005,
        accuracy: 5,
        altitude: 11,
        heading: Math.random() * 360,
        speed: Math.random() * 3,
        lastUpdate: new Date().toISOString(),
      },
    ],
    totalLocations: 4,
  }

  return NextResponse.json(locationData, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  })
}
