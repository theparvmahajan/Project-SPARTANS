import { type NextRequest, NextResponse } from "next/server"

const mockSoldiers = [
  {
    id: "1",
    name: "James Mitchell",
    rank: "LTC",
    unit: "Alpha Squadron",
    status: "active",
    heartRate: 78,
    temperature: 37.2,
    oxygenLevel: 98,
    lastUpdate: "2 seconds ago",
    latitude: 40.7128,
    longitude: -74.006,
    location: "Forward Operating Base Alpha",
    bloodPressure: "120/80",
    bloodOxygenSaturation: 98,
    coreTemperature: 37.2,
    fatigueMeter: 35,
    hydrationStatus: "Optimal",
    deploymentStatus: "Active Mission",
    equipment: ["GPS Device", "Heart Monitor", "Temperature Sensor", "O₂ Monitor"],
  },
  {
    id: "2",
    name: "Sarah Rodriguez",
    rank: "CPT",
    unit: "Bravo Squadron",
    status: "warning",
    heartRate: 95,
    temperature: 38.1,
    oxygenLevel: 96,
    lastUpdate: "5 seconds ago",
    latitude: 40.758,
    longitude: -73.9855,
    location: "Patrol Route Delta",
    bloodPressure: "128/85",
    bloodOxygenSaturation: 96,
    coreTemperature: 38.1,
    fatigueMeter: 62,
    hydrationStatus: "Low",
    deploymentStatus: "Active Patrol",
    equipment: ["GPS Device", "Heart Monitor", "Temperature Sensor", "O₂ Monitor"],
  },
  {
    id: "3",
    name: "David Chen",
    rank: "PVT",
    unit: "Charlie Squadron",
    status: "critical",
    heartRate: 132,
    temperature: 39.5,
    oxygenLevel: 92,
    lastUpdate: "1 second ago",
    latitude: 40.7249,
    longitude: -73.968,
    location: "Sector 7-B",
    bloodPressure: "145/95",
    bloodOxygenSaturation: 92,
    coreTemperature: 39.5,
    fatigueMeter: 89,
    hydrationStatus: "Critical",
    deploymentStatus: "Emergency Medical Required",
    equipment: ["GPS Device", "Heart Monitor", "Temperature Sensor", "O₂ Monitor"],
  },
  {
    id: "4",
    name: "Michael Torres",
    rank: "SGT",
    unit: "Delta Squadron",
    status: "active",
    heartRate: 82,
    temperature: 36.9,
    oxygenLevel: 99,
    lastUpdate: "3 seconds ago",
    latitude: 40.7505,
    longitude: -73.9972,
    location: "Base Camp",
    bloodPressure: "118/78",
    bloodOxygenSaturation: 99,
    coreTemperature: 36.9,
    fatigueMeter: 25,
    hydrationStatus: "Optimal",
    deploymentStatus: "Standby",
    equipment: ["GPS Device", "Heart Monitor", "Temperature Sensor", "O₂ Monitor"],
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const soldier = mockSoldiers.find((s) => s.id === id)

  if (!soldier) {
    return NextResponse.json({ message: "Soldier not found" }, { status: 404 })
  }

  return NextResponse.json(soldier)
}
