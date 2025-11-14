import { NextResponse } from "next/server"
import { messageStorage } from "@/lib/message-storage"

export async function GET() {
  const messages = messageStorage.getAll()
  return NextResponse.json({ messages })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    messageStorage.add(body.message)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error storing message:", error)
    return NextResponse.json({ error: "Failed to store message" }, { status: 500 })
  }
}
