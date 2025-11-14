import { NextResponse } from "next/server"
import { messageStorage } from "@/lib/message-storage"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const messageId = params.id
  messageStorage.markAsRead(messageId)
  return NextResponse.json({ success: true })
}
