import { NextResponse } from "next/server"

export async function GET() {
  const mockSoldiers = [
    {
      id: "SOL001",
      name: "James Marcus",
      rank: "LT",
      unit: "Alpha Squadron",
      status: "active" as const,
      pulse: 72 + Math.random() * 10 - 5,
      temperature: 36.8 + (Math.random() * 0.4 - 0.2),
      bloodOxygen: 98 + Math.random() * 2 - 1,
      lastUpdate: new Date().toISOString(),
      position: { lat: 40.7128 + Math.random() * 0.01, lng: -74.006 + Math.random() * 0.01 },
    },
    {
      id: "SOL002",
      name: "Sarah Chen",
      rank: "SGT",
      unit: "Bravo Squadron",
      status: "active" as const,
      pulse: 68 + Math.random() * 10 - 5,
      temperature: 36.5 + (Math.random() * 0.4 - 0.2),
      bloodOxygen: 99 + Math.random() * 1 - 0.5,
      lastUpdate: new Date().toISOString(),
      position: { lat: 40.7131 + Math.random() * 0.01, lng: -74.0072 + Math.random() * 0.01 },
    },
    {
      id: "SOL003",
      name: "David Rodriguez",
      rank: "CPL",
      unit: "Charlie Squadron",
      status: "active" as const,
      pulse: 85 + Math.random() * 15 - 7.5,
      temperature: 37.2 + (Math.random() * 0.6 - 0.3),
      bloodOxygen: 96 + Math.random() * 3 - 1.5,
      lastUpdate: new Date().toISOString(),
      position: { lat: 40.7135 + Math.random() * 0.01, lng: -74.0068 + Math.random() * 0.01 },
    },
    {
      id: "SOL004",
      name: "Emily Watson",
      rank: "LT",
      unit: "Delta Squadron",
      status: "critical" as const,
      pulse: 128 + Math.random() * 10 - 5,
      temperature: 39.1 + (Math.random() * 0.4 - 0.2),
      bloodOxygen: 91 + Math.random() * 4 - 2,
      lastUpdate: new Date().toISOString(),
      position: { lat: 40.714 + Math.random() * 0.01, lng: -74.0065 + Math.random() * 0.01 },
    },
  ]

  return NextResponse.json({
    soldiers: mockSoldiers,
    alerts: [
      {
        id: "ALR001",
        soldierId: "SOL004",
        soldierName: "Emily Watson",
        type: "critical",
        message: "Heart rate critically elevated - Immediate medical attention required",
        timestamp: new Date().toISOString(),
        resolved: false,
      },
    ],
    timestamp: new Date().toISOString(),
    dataSource: "IoT Sensors",
  })
}
