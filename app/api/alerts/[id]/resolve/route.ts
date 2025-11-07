import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // In production, this would update the database
    // For now, return success
    return NextResponse.json(
      {
        message: "Alert resolved successfully",
        alertId: id,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Alert resolve error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
