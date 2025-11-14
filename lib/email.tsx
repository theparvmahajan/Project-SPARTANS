export interface EmailNotification {
  soldierName: string
  soldierRank: string
  soldierId: string
  message: string
  timestamp: Date
}

export async function sendEmailNotification(notification: EmailNotification) {
  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { background: white; padding: 30px; margin-top: 20px; border-radius: 5px; }
    .soldier-info { background: #fef2f2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0; }
    .message-box { background: #f9fafb; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
    .label { font-weight: bold; color: #dc2626; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 SPARTANS ALERT</h1>
      <p>New Message from Field Soldier</p>
    </div>
    <div class="content">
      <h2>Soldier Information</h2>
      <div class="soldier-info">
        <p><span class="label">Name:</span> ${notification.soldierName}</p>
        <p><span class="label">Rank:</span> ${notification.soldierRank}</p>
        <p><span class="label">ID:</span> ${notification.soldierId}</p>
        <p><span class="label">Time:</span> ${notification.timestamp.toLocaleString()}</p>
      </div>
      
      <h2>Message Content</h2>
      <div class="message-box">
        <p>${notification.message}</p>
      </div>
      
      <p style="margin-top: 30px;">
        <a href="https://v0-soldier-monitoring-system.vercel.app" 
           style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
          View in Dashboard
        </a>
      </p>
    </div>
    <div class="footer">
      <p>SPARTANS Soldier Monitoring System</p>
      <p>This is an automated notification. Do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `

    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: 'api-' + Buffer.from('spartans01project@gmail.com:ilxfrixklczoxego').toString('base64'),
        to: ['spartans01project@gmail.com'],
        sender: 'SPARTANS System <noreply@spartans-system.com>',
        subject: `New Message from ${notification.soldierName} - ${notification.soldierRank}`,
        html_body: emailHtml,
        text_body: `
SPARTANS ALERT - New Message from Field Soldier

Soldier Information:
Name: ${notification.soldierName}
Rank: ${notification.soldierRank}
ID: ${notification.soldierId}
Time: ${notification.timestamp.toLocaleString()}

Message:
${notification.message}

View in Dashboard: https://v0-soldier-monitoring-system.vercel.app
        `
      })
    })

    if (!response.ok) {
      console.error('[v0] Email send failed:', await response.text())
      return false
    }

    console.log('[v0] Email notification sent successfully')
    return true
  } catch (error) {
    console.error('[v0] Email notification error:', error)
    return false
  }
}
