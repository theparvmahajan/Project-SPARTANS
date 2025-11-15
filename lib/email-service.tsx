import nodemailer from "nodemailer"

const GMAIL_USER = "spartans01project@gmail.com"
const GMAIL_APP_PASSWORD = "zubh ffok ptam yzal"

interface SoldierInfo {
  id: string
  name: string
  rank: string
  unit: string
  status: string
  pulse?: number
  temperature?: number
  bloodOxygen?: number
  battery?: number
  humidity?: number
  position?: { lat: number; lng: number }
  lastUpdate?: string
}

export async function sendMessageNotificationEmail(
  message: string,
  soldierInfo: SoldierInfo,
  telegramUsername: string
) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    })

    // Format soldier stats
    const statsHtml = `
      <div style="background-color: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #ef4444; margin-top: 0;">Soldier Status</h3>
        <table style="width: 100%; color: #e5e7eb;">
          <tr>
            <td style="padding: 8px;"><strong>Status:</strong></td>
            <td style="padding: 8px; color: ${soldierInfo.status === "critical" ? "#ef4444" : soldierInfo.status === "active" ? "#10b981" : "#fbbf24"};">${soldierInfo.status.toUpperCase()}</td>
          </tr>
          ${soldierInfo.pulse ? `
          <tr>
            <td style="padding: 8px;"><strong>Heart Rate:</strong></td>
            <td style="padding: 8px;">${soldierInfo.pulse} bpm</td>
          </tr>` : ""}
          ${soldierInfo.temperature ? `
          <tr>
            <td style="padding: 8px;"><strong>Temperature:</strong></td>
            <td style="padding: 8px;">${soldierInfo.temperature.toFixed(1)}°C</td>
          </tr>` : ""}
          ${soldierInfo.bloodOxygen ? `
          <tr>
            <td style="padding: 8px;"><strong>Blood Oxygen:</strong></td>
            <td style="padding: 8px;">${soldierInfo.bloodOxygen}%</td>
          </tr>` : ""}
          ${soldierInfo.battery ? `
          <tr>
            <td style="padding: 8px;"><strong>Battery:</strong></td>
            <td style="padding: 8px;">${soldierInfo.battery}%</td>
          </tr>` : ""}
          ${soldierInfo.humidity ? `
          <tr>
            <td style="padding: 8px;"><strong>Humidity:</strong></td>
            <td style="padding: 8px;">${soldierInfo.humidity}%</td>
          </tr>` : ""}
          ${soldierInfo.position ? `
          <tr>
            <td style="padding: 8px;"><strong>Location:</strong></td>
            <td style="padding: 8px;">${soldierInfo.position.lat.toFixed(5)}, ${soldierInfo.position.lng.toFixed(5)}</td>
          </tr>` : ""}
          ${soldierInfo.lastUpdate ? `
          <tr>
            <td style="padding: 8px;"><strong>Last Update:</strong></td>
            <td style="padding: 8px;">${new Date(soldierInfo.lastUpdate).toLocaleString()}</td>
          </tr>` : ""}
        </table>
      </div>
    `

    // Create email HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #e5e7eb; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #1f1f1f; border: 2px solid #ef4444; border-radius: 12px; padding: 30px; }
            .header { text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { color: #ef4444; font-size: 32px; font-weight: bold; letter-spacing: 2px; }
            .message-box { background-color: #2a2a2a; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151; color: #9ca3af; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SPARTANS</div>
              <p style="color: #9ca3af; margin: 10px 0 0 0;">Soldier Health Monitoring System</p>
            </div>
            
            <h2 style="color: #ef4444;">New Message from Field</h2>
            
            <div style="margin: 20px 0;">
              <p><strong>Soldier:</strong> ${soldierInfo.name}</p>
              <p><strong>Rank:</strong> ${soldierInfo.rank}</p>
              <p><strong>Unit:</strong> ${soldierInfo.unit}</p>
              <p><strong>Telegram:</strong> @${telegramUsername}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <div class="message-box">
              <h3 style="color: #ef4444; margin-top: 0;">Message:</h3>
              <p style="font-size: 16px; line-height: 1.6;">${message}</p>
            </div>

            ${statsHtml}

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://v0-soldier-monitoring-system.vercel.app" 
                 style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View in Dashboard
              </a>
            </div>

            <div class="footer">
              <p>This is an automated notification from SPARTANS System</p>
              <p>Reply to this soldier from the dashboard's Messages inbox</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email
    const info = await transporter.sendMail({
      from: `"SPARTANS Command" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `🚨 New Message from ${soldierInfo.name} (${soldierInfo.rank})`,
      html: htmlContent,
    })

    console.log("[v0] Email sent successfully:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("[v0] Failed to send email:", error)
    return { success: false, error }
  }
}
