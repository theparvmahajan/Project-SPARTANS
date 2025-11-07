import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      status: "operational",
      timestamp: new Date().toISOString(),
      services: {
        authentication: "operational",
        soldiers: "operational",
        iotSensors: "operational",
        gpsTracking: "operational",
        alerts: "operational",
      },
      uptime: Math.floor(process.uptime()),
      version: "1.0.0",
    },
    { status: 200 },
  )
}
