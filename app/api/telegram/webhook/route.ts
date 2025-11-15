import { NextRequest, NextResponse } from "next/server"
import { messageStorage } from "@/lib/message-storage"
import { sendMessageNotificationEmail } from "@/lib/email-service"

const TELEGRAM_BOT_TOKEN = "8558888065:AAFiwXSLZL9Ov2iV5gyavNHSqICSWReLnXw"

// Soldier mapping - map Telegram usernames to soldier IDs
const SOLDIER_MAPPING: Record<string, { id: string; name: string }> = {
  "Parv_M": { id: "soldier_1", name: "James Mitchell" },
  // Add more mappings as needed
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] ========== TELEGRAM WEBHOOK TRIGGERED ==========")
    console.log("[v0] Full webhook body:", JSON.stringify(body, null, 2))
    console.log("[v0] Request headers:", Object.fromEntries(request.headers))

    // Handle incoming message from Telegram
    if (body.message && body.message.text) {
      const telegramUsername = body.message.from.username || body.message.from.first_name
      const messageText = body.message.text
      const chatId = body.message.chat.id

      console.log("[v0] ===== MESSAGE DETAILS =====")
      console.log("[v0] From username:", telegramUsername)
      console.log("[v0] Message text:", messageText)
      console.log("[v0] Chat ID:", chatId)

      // Map Telegram user to soldier
      const soldierInfo = SOLDIER_MAPPING[telegramUsername] || {
        id: "unknown",
        name: "Unknown Soldier"
      }

      console.log("[v0] Mapped to soldier:", soldierInfo)

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
      console.log("[v0] Message stored in messageStorage")

      try {
        console.log("[v0] ===== STARTING EMAIL NOTIFICATION PROCESS =====")
        const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://v0-soldier-monitoring-system.vercel.app"}/api/soldiers`
        console.log("[v0] Fetching from:", apiUrl)
        
        const soldiersResponse = await fetch(apiUrl)
        
        if (!soldiersResponse.ok) {
          throw new Error(`Failed to fetch soldiers: ${soldiersResponse.status}`)
        }
        
        const soldiersData = await soldiersResponse.json()
        console.log("[v0] Fetched soldiers count:", soldiersData.soldiers?.length)
        
        const soldier = soldiersData.soldiers?.find((s: any) => s.id === soldierInfo.id)

        if (soldier) {
          console.log("[v0] Soldier found:", soldier.name)
          console.log("[v0] Calling sendMessageNotificationEmail...")
          
          const emailResult = await sendMessageNotificationEmail(messageText, soldier, telegramUsername)
          
          console.log("[v0] Email result:", JSON.stringify(emailResult))
          console.log("[v0] ===== EMAIL SENT SUCCESSFULLY =====")
        } else {
          console.log("[v0] ERROR: Soldier not found in database for ID:", soldierInfo.id)
        }
      } catch (emailError: any) {
        console.error("[v0] ===== EMAIL ERROR =====")
        console.error("[v0] Error message:", emailError.message)
        console.error("[v0] Error stack:", emailError.stack)
        // Don't fail the webhook if email fails
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
    } else {
      console.log("[v0] Webhook received but no valid message found")
      console.log("[v0] Body structure:", Object.keys(body))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] ===== WEBHOOK FATAL ERROR =====")
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "Telegram webhook endpoint active" })
}
