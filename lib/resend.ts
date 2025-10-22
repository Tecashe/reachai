import { Resend } from "resend"
import { env } from "./env"

export const resend = new Resend(env.RESEND_API_KEY)

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  from = env.RESEND_FROM_EMAIL,
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      console.error("[Resend] Error sending email:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, id: data?.id }
  } catch (error) {
    console.error("[Resend] Exception:", error)
    throw error
  }
}

export async function sendWelcomeEmail(to: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ReachAI!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Welcome to ReachAI - the AI-powered cold email personalization platform that helps you connect with prospects at scale.</p>
            <p>Here's what you can do next:</p>
            <ul>
              <li>Create your first campaign</li>
              <li>Import prospects via CSV</li>
              <li>Generate personalized emails with AI</li>
              <li>Track opens, clicks, and replies</li>
            </ul>
            <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
            <p>If you have any questions, just reply to this email. We're here to help!</p>
            <p>Best regards,<br>The ReachAI Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ReachAI. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `

  return sendTransactionalEmail({
    to,
    subject: "Welcome to ReachAI - Let's Get Started!",
    html,
  })
}

export async function sendCampaignCompletedEmail(to: string, campaignName: string, stats: any) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .stats { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .stat { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .stat:last-child { border-bottom: none; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Campaign Completed!</h1>
          </div>
          <div class="content">
            <p>Your campaign "<strong>${campaignName}</strong>" has completed.</p>
            <div class="stats">
              <div class="stat"><span>Emails Sent:</span><strong>${stats.sent}</strong></div>
              <div class="stat"><span>Opened:</span><strong>${stats.opened} (${stats.openRate}%)</strong></div>
              <div class="stat"><span>Clicked:</span><strong>${stats.clicked} (${stats.clickRate}%)</strong></div>
              <div class="stat"><span>Replied:</span><strong>${stats.replied} (${stats.replyRate}%)</strong></div>
            </div>
            <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard/campaigns" class="button">View Campaign Details</a>
          </div>
        </div>
      </body>
    </html>
  `

  return sendTransactionalEmail({
    to,
    subject: `Campaign "${campaignName}" Completed - Results Inside`,
    html,
  })
}
