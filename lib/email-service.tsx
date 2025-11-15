import nodemailer from 'nodemailer'

const GMAIL_USER = 'spartans01project@gmail.com'
const GMAIL_APP_PASSWORD = 'zubh ffok ptam yzal'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
})

interface Soldier {
  id: string
  name: string
  rank: string
  unit: string
  status: string
  vitals: {
    pulse: number
    temperature: number
    bloodOxygen: number
    battery: number
  }
  location: {
    latitude: number
    longitude: number
  }
  lastUpdate: string
}

export async function sendMessageNotificationEmail(
  message: string,
  soldier: Soldier,
  telegramUsername: string
): Promise<void> {
  try {
    console.log('[v0] Attempting to send email for message from', soldier.name)

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .soldier-info { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #dc2626; }
            .vitals { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
            .vital-card { background: white; padding: 12px; border-radius: 6px; }
            .vital-label { font-size: 12px; color: #6b7280; font-weight: 600; }
            .vital-value { font-size: 18px; font-weight: bold; color: #111827; }
            .message-box { background: #1f2937; color: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .status-active { background: #10b981; color: white; }
            .status-critical { background: #dc2626; color: white; }
            .status-inactive { background: #6b7280; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🎖️ SPARTANS Alert</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">New message from soldier</p>
            </div>
            <div class="content">
              <div class="soldier-info">
                <h2 style="margin: 0 0 10px 0; color: #dc2626;">${soldier.name}</h2>
                <p style="margin: 5px 0;"><strong>Rank:</strong> ${soldier.rank}</p>
                <p style="margin: 5px 0;"><strong>Unit:</strong> ${soldier.unit}</p>
                <p style="margin: 5px 0;"><strong>Soldier ID:</strong> ${soldier.id}</p>
                <p style="margin: 5px 0;"><strong>Telegram:</strong> @${telegramUsername}</p>
                <p style="margin: 5px 0;">
                  <strong>Status:</strong>
                  <span class="status-badge status-${soldier.status}">${soldier.status.toUpperCase()}</span>
                </p>
              </div>

              <h3 style="margin: 20px 0 10px 0;">Message Received:</h3>
              <div class="message-box">
                "${message}"
              </div>

              <h3 style="margin: 20px 0 10px 0;">Current Vitals:</h3>
              <div class="vitals">
                <div class="vital-card">
                  <div class="vital-label">HEART RATE</div>
                  <div class="vital-value">❤️ ${soldier.vitals.pulse} bpm</div>
                </div>
                <div class="vital-card">
                  <div class="vital-label">TEMPERATURE</div>
                  <div class="vital-value">🌡️ ${soldier.vitals.temperature}°C</div>
                </div>
                <div class="vital-card">
                  <div class="vital-label">BLOOD OXYGEN</div>
                  <div class="vital-value">💉 ${soldier.vitals.bloodOxygen}%</div>
                </div>
                <div class="vital-card">
                  <div class="vital-label">BATTERY</div>
                  <div class="vital-value">🔋 ${soldier.vitals.battery}%</div>
                </div>
              </div>

              <h3 style="margin: 20px 0 10px 0;">Location:</h3>
              <div class="vital-card">
                <p style="margin: 5px 0;">📍 <strong>Latitude:</strong> ${soldier.location.latitude}</p>
                <p style="margin: 5px 0;">📍 <strong>Longitude:</strong> ${soldier.location.longitude}</p>
              </div>

              <p style="margin: 20px 0 10px 0; font-size: 12px; color: #6b7280;">
                <strong>Last Update:</strong> ${new Date(soldier.lastUpdate).toLocaleString()}
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              
              <p style="text-align: center; color: #6b7280; font-size: 14px;">
                <strong>SPARTANS Soldier Monitoring System</strong><br>
                <a href="https://v0-soldier-monitoring-system.vercel.app" style="color: #dc2626;">View in Dashboard</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const mailOptions = {
      from: `SPARTANS System <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `New Message from ${soldier.name} - ${soldier.rank}`,
      html: htmlContent,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('[v0] Email sent successfully:', info.messageId)
  } catch (error) {
    console.error('[v0] Error sending email:', error)
    throw error
  }
}
