import { NextRequest, NextResponse } from "next/server"
import { messageStorage } from "@/lib/message-storage"

const TELEGRAM_BOT_TOKEN = "8558888065:AAFiwXSLZL9Ov2iV5gyavNHSqICSWReLnXw"

export async function POST(request: NextRequest) {
  try {
    const { messageId, reply } = await request.json()

    const originalMessage = messageStorage.getById(messageId)
    
    if (!originalMessage?.telegramChatId) {
      return NextResponse.json(
        { error: "Original message not found or missing chat ID" },
        { status: 400 }
      )
    }

    // Send reply to soldier via Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: originalMessage.telegramChatId,
          text: `📡 SPARTANS Command:\n\n${reply}`,
        }),
      }
    )

    const result = await telegramResponse.json()

    if (result.ok) {
      console.log("[v0] Reply sent to soldier via Telegram")
      messageStorage.updateReply(messageId, reply, new Date().toISOString())
      return NextResponse.json({ success: true })
    } else {
      console.error("[v0] Telegram API error:", result)
      return NextResponse.json(
        { error: "Failed to send message via Telegram" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[v0] Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
