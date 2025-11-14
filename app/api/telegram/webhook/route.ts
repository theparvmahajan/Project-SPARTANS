import { NextRequest, NextResponse } from "next/server"
import { messageStorage } from "@/lib/message-storage"
import { sendEmailNotification } from "@/lib/email"

const TELEGRAM_BOT_TOKEN = "8558888065:AAFiwXSLZL9Ov2iV5gyavNHSqICSWReLnXw"

// Soldier mapping - map Telegram usernames to soldier IDs
const SOLDIER_MAPPING: Record<string, { id: string; name: string }> = {
  "Parv_M": { id: "soldier_1", name: "James Mitchell" },
  // Add more mappings as needed
}

// Soldier rank mapping for email notifications
const SOLDIER_RANKS: Record<string, string> = {
  "soldier_1": "Sergeant",
  "soldier_2": "Corporal",
  "soldier_3": "Private First Class",
  "soldier_4": "Specialist",
  "soldier_5": "Lance Corporal",
  "soldier_6": "Private",
  "soldier_7": "Staff Sergeant",
  "soldier_8": "Corporal"
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

      messageStorage.add(message)

      try {
        await sendEmailNotification({
          soldierName: soldierInfo.name,
          soldierRank: SOLDIER_RANKS[soldierInfo.id] || "Unknown Rank",
          soldierId: soldierInfo.id,
          message: messageText,
          timestamp: new Date()
        })
        console.log("[v0] Email notification sent for:", soldierInfo.name)
      } catch (emailError) {
        console.error("[v0] Email notification failed:", emailError)
        // Continue even if email fails
      }

      // Send acknowledgment to soldier
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Message received from ${soldierInfo.name}. Command center will respond shortly.`,
        }),
      })

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
