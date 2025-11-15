import { NextRequest, NextResponse } from "next/server"
import { messageStorage } from "@/lib/message-storage"
import { sendMessageNotificationEmail } from "@/lib/email-service"

const TELEGRAM_BOT_TOKEN = "8558888065:AAFiwXSLZL9Ov2iV5gyavNHSqICSWReLnXw"

// Soldier mapping - map Telegram usernames to soldier IDs
const SOLDIER_MAPPING: Record<string, { id: string; name: string; rank: string; unit: string }> = {
  "Parv_M": { 
    id: "soldier_1", 
    name: "James Mitchell",
    rank: "Captain",
    unit: "Alpha Squadron"
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] ========== TELEGRAM WEBHOOK TRIGGERED ==========")
    console.log("[v0] Message body:", JSON.stringify(body, null, 2))

    // Handle incoming message from Telegram
    if (body.message && body.message.text) {
      const telegramUsername = body.message.from.username || body.message.from.first_name
      const messageText = body.message.text
      const chatId = body.message.chat.id

      console.log("[v0] Message from:", telegramUsername)
      console.log("[v0] Message text:", messageText)

      // Map Telegram user to soldier
      const soldierInfo = SOLDIER_MAPPING[telegramUsername] || {
        id: "unknown",
        name: "Unknown Soldier",
        rank: "Unknown",
        unit: "Unknown"
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
      console.log("[v0] Message stored in memory")

      try {
        console.log("[v0] Fetching soldier data from API...")
        
        // Get base URL from the incoming request
        const requestUrl = new URL(request.url)
        const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
        const apiUrl = `${baseUrl}/api/soldiers`
        
        console.log("[v0] Request URL:", request.url)
        console.log("[v0] Base URL:", baseUrl)
        console.log("[v0] API URL:", apiUrl)
        
        const soldierResponse = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!soldierResponse.ok) {
          throw new Error(`Soldier API returned ${soldierResponse.status}`)
        }
        
        const soldierData = await soldierResponse.json()
        console.log("[v0] Soldier API response received")
        
        // Find the specific soldier
        const soldier = soldierData.soldiers?.find((s: any) => s.id === soldierInfo.id)
        
        if (soldier) {
          console.log("[v0] Found soldier:", soldier.name)
          console.log("[v0] Soldier vitals - Pulse:", soldier.pulse, "Temp:", soldier.tempC, "Battery:", soldier.battery)
          await sendMessageNotificationEmail(messageText, soldier, telegramUsername)
          console.log("[v0] ✅ Email sent successfully with full soldier data")
        } else {
          console.log("[v0] ⚠️ Soldier not found in API response, sending with basic info")
          // Fallback to basic info if soldier not found
          const soldierForEmail = {
            id: soldierInfo.id,
            name: soldierInfo.name,
            rank: soldierInfo.rank,
            unit: soldierInfo.unit,
            status: "active",
            pulse: 0,
            tempC: 0,
            battery: 0,
            humidity: 0,
            latitude: 0,
            longitude: 0,
          }
          await sendMessageNotificationEmail(messageText, soldierForEmail, telegramUsername)
          console.log("[v0] ✅ Email sent with basic soldier info")
        }
      } catch (emailError: any) {
        console.error("[v0] ========== EMAIL ERROR ==========")
        console.error("[v0] Error message:", emailError.message)
        console.error("[v0] Error stack:", emailError.stack)
        console.error("[v0] ==========================================")
        // Continue even if email fails - don't block webhook
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

      console.log("[v0] Acknowledgment sent to Telegram")
      console.log("[v0] ========== WEBHOOK COMPLETE ==========")

      return NextResponse.json({
        success: true,
        message: message,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] ========== WEBHOOK FATAL ERROR ==========")
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: "Telegram webhook endpoint active" })
}
