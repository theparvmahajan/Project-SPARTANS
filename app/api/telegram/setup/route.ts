import { NextResponse } from "next/server"

const TELEGRAM_BOT_TOKEN = "8558888065:AAFiwXSLZL9Ov2iV5gyavNHSqICSWReLnXw"

export async function POST() {
  try {
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`
    
    console.log("[v0] Setting webhook URL:", webhookUrl)
    
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl,
        }),
      }
    )

    const result = await response.json()
    
    console.log("[v0] Webhook setup result:", result)
    
    return NextResponse.json({
      success: result.ok,
      webhookUrl: webhookUrl,
      result: result,
    })
  } catch (error) {
    console.error("[v0] Webhook setup error:", error)
    return NextResponse.json({ error: "Failed to setup webhook" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const webhookUrl = `${url.origin}/api/telegram/webhook`
    
    console.log("[v0] Setting webhook URL:", webhookUrl)
    
    const setWebhookResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: webhookUrl,
        }),
      }
    )

    const setResult = await setWebhookResponse.json()
    console.log("[v0] Webhook setup result:", setResult)

    const getInfoResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`
    )
    const infoResult = await getInfoResponse.json()
    
    return NextResponse.json({
      success: setResult.ok,
      webhookUrl: webhookUrl,
      setWebhookResult: setResult,
      currentWebhookInfo: infoResult,
    })
  } catch (error) {
    console.error("[v0] Webhook setup error:", error)
    return NextResponse.json({ error: "Failed to setup webhook" }, { status: 500 })
  }
}
