import { NextRequest, NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = "8558888065:AAFiwXSLZL9Ov2iV5gyavNHSqICSWReLnXw"

// Soldier mapping - map Telegram usernames to soldier IDs
const SOLDIER_MAPPING: Record<string, { id: string; name: string }> = {
  "Parv_M": { id: "soldier_1", name: "James Mitchell" },
  // Add more mappings as needed
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Telegram webhook received:", JSON.stringify(body))

    // Handle incoming message from Telegram
    if (body.message && body.message.text) {
      const telegramUsername = body.message.from.username || body.message.from.first_name
      const messageText = body.message.text
      const chatId = body.message.chat.id

      console.log("[v0] Message from:", telegramUsername, "Text:", messageText)

      // Map Telegram user to soldier
      const soldierInfo = SOLDIER_MAPPING[telegramUsername] || {
        id: "unknown",
        name: "Unknown Soldier"
      }

      // Create message object
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        soldierId: soldierInfo.id,
        soldierName: soldierInfo.name,
        telegramUsername: telegramUsername,
        telegramChatId: chatId,
        message: messageText,
        timestamp: new Date().toISOString(),
        read: false,
      }

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/telegram/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })

      // Send acknowledgment to soldier
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Message received from ${soldierInfo.name}. Command center will respond shortly.`,
        }),
      })

      // Return the message so it can be stored on client side
      return NextResponse.json({
        success: true,
        message: message,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Telegram webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "Telegram webhook endpoint active" })
}
