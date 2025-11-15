import nodemailer from "nodemailer"

const GMAIL_USER = "spartans01project@gmail.com"
const GMAIL_APP_PASSWORD = "zubh ffok ptam yzal"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
})

export async function sendMessageNotificationEmail(
  message: string,
  soldier: any,
  telegramUsername: string
) {
  try {
    console.log("[v0] Preparing email for soldier:", soldier.name)
    console.log("[v0] Soldier vitals being sent to email:", {
      pulse: soldier.pulse,
      tempC: soldier.tempC,
      battery: soldier.battery,
      humidity: soldier.humidity,
      latitude: soldier.latitude,
      longitude: soldier.longitude
    })

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #1a1a1a; color: #fff; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #2a2a2a; border: 2px solid #dc2626; border-radius: 8px; padding: 30px; }
          .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
          .soldier-info { background-color: #3a3a3a; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
          .vitals { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; }
          .vital-item { background-color: #2a2a2a; padding: 10px; border-radius: 4px; }
          .vital-label { color: #9ca3af; font-size: 12px; }
          .vital-value { color: #fff; font-size: 18px; font-weight: bold; }
          .message-box { background-color: #3a3a3a; padding: 20px; border-left: 4px solid #dc2626; border-radius: 4px; margin: 20px 0; }
          .timestamp { color: #9ca3af; font-size: 14px; }
          .status-active { color: #10b981; }
          .status-inactive { color: #6b7280; }
          .status-critical { color: #dc2626; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ SPARTANS MESSAGE ALERT</h1>
          </div>
          
          <div class="soldier-info">
            <h2 style="margin-top: 0;">Soldier Information</h2>
            <p><strong>Name:</strong> ${soldier.name}</p>
            <p><strong>Rank:</strong> ${soldier.rank}</p>
            <p><strong>Unit:</strong> ${soldier.unit}</p>
            <p><strong>ID:</strong> ${soldier.id}</p>
            <p><strong>Status:</strong> <span class="status-${soldier.status}">${soldier.status.toUpperCase()}</span></p>
            <p><strong>Telegram:</strong> @${telegramUsername}</p>
          </div>

          <div class="message-box">
            <h3>Message from Soldier:</h3>
            <p style="font-size: 16px; line-height: 1.6;">${message}</p>
            <p class="timestamp">Received: ${new Date().toLocaleString()}</p>
          </div>

          <div class="soldier-info">
            <h3>Current Vitals</h3>
            <div class="vitals">
              <div class="vital-item">
                <div class="vital-label">Heart Rate</div>
                <div class="vital-value">${soldier.pulse || 'N/A'} ${soldier.pulse ? 'bpm' : ''}</div>
              </div>
              <div class="vital-item">
                <div class="vital-label">Temperature</div>
                <div class="vital-value">${soldier.tempC || 'N/A'}${soldier.tempC ? '°C' : ''}</div>
              </div>
              <div class="vital-item">
                <div class="vital-label">Blood Oxygen</div>
                <div class="vital-value">${soldier.bloodOxygen || 'N/A'}${soldier.bloodOxygen ? '%' : ''}</div>
              </div>
              <div class="vital-item">
                <div class="vital-label">Battery</div>
                <div class="vital-value">${soldier.battery || 'N/A'}${soldier.battery ? '%' : ''}</div>
              </div>
              <div class="vital-item">
                <div class="vital-label">GPS Location</div>
                <div class="vital-value">${soldier.latitude ? soldier.latitude.toFixed(4) : 'N/A'}, ${soldier.longitude ? soldier.longitude.toFixed(4) : 'N/A'}</div>
              </div>
              <div class="vital-item">
                <div class="vital-label">Humidity</div>
                <div class="vital-value">${soldier.humidity || 'N/A'}${soldier.humidity ? '%' : ''}</div>
              </div>
            </div>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #3a3a3a; border-radius: 4px; text-align: center;">
            <p style="margin: 0;">View full details and respond in the SPARTANS Dashboard</p>
            <a href="https://v0-soldier-monitoring-system.vercel.app" 
               style="display: inline-block; margin-top: 15px; padding: 12px 30px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Open Dashboard
            </a>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"SPARTANS System" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `🚨 New Message from ${soldier.name} - ${soldier.rank}`,
      html: htmlContent,
    }

    console.log("[v0] Sending email via Gmail SMTP...")
    const info = await transporter.sendMail(mailOptions)
    console.log("[v0] Email sent successfully:", info.messageId)

    return {
      success: true,
      messageId: info.messageId,
    }
  } catch (error: any) {
    console.error("[v0] Failed to send email:", error)
    throw error
  }
}
