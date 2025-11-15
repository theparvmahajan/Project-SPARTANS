import { NextResponse } from "next/server"
import { sendMessageNotificationEmail } from "@/lib/email-service"

export async function GET() {
  try {
    console.log("[v0] Testing email service...")
    
    const mockSoldier = {
      id: "soldier_1",
      name: "James Mitchell",
      rank: "Captain",
      unit: "Alpha Squadron",
      status: "active",
      vitals: {
        pulse: 77,
        tempC: 24,
        bloodOxygen: 97,
        battery: 97,
        humidity: 40,
        latitude: 28.604,
        longitude: 77.204,
      }
    }

    const testMessage = "This is a test message from the SPARTANS system to verify email notifications are working correctly."
    
    const testResult = await sendMessageNotificationEmail(
      testMessage,
      mockSoldier,
      "Parv_M"
    )

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully! Check spartans01project@gmail.com",
      details: testResult
    })
  } catch (error: any) {
    console.error("[v0] Email test error:", error)
    return NextResponse.json({
      success: false,
      message: "Email test failed",
      error: error.message
    }, { status: 500 })
  }
}
