import { NextResponse } from "next/server"

export async function GET() {
  const iotData = {
    timestamp: new Date().toISOString(),
    sensors: [
      {
        soldierId: "SOL001",
        sensorId: "HEART_001",
        type: "heart_rate",
        value: 72 + Math.random() * 10 - 5,
        unit: "bpm",
        status: "normal",
      },
      {
        soldierId: "SOL001",
        sensorId: "TEMP_001",
        type: "temperature",
        value: 36.8 + (Math.random() * 0.4 - 0.2),
        unit: "celsius",
        status: "normal",
      },
      {
        soldierId: "SOL001",
        sensorId: "O2_001",
        type: "oxygen",
        value: 98 + Math.random() * 2 - 1,
        unit: "percent",
        status: "normal",
      },
      {
        soldierId: "SOL004",
        sensorId: "HEART_004",
        type: "heart_rate",
        value: 128 + Math.random() * 10 - 5,
        unit: "bpm",
        status: "critical",
      },
      {
        soldierId: "SOL004",
        sensorId: "TEMP_004",
        type: "temperature",
        value: 39.1 + (Math.random() * 0.4 - 0.2),
        unit: "celsius",
        status: "critical",
      },
      {
        soldierId: "SOL004",
        sensorId: "O2_004",
        type: "oxygen",
        value: 91 + Math.random() * 4 - 2,
        unit: "percent",
        status: "critical",
      },
    ],
    totalSensors: 6,
  }

  return NextResponse.json(iotData, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  })
}
