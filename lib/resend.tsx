import { Resend as ResendClient } from "resend"
import { env } from "./env"
import { logger } from "./logger"
import { render } from "@react-email/render"
import WelcomeEmail from "./email-templates/welcome-email"
import * as React from "react"

class ResendService {
  private client: ResendClient
  public emails: ResendClient["emails"]

  constructor() {
    this.client = new ResendClient(env.RESEND_API_KEY)
    this.emails = this.client.emails
  }

  async send({
    from,
    to,
    subject,
    html,
  }: {
    from: string
    to: string
    subject: string
    html: string
  }) {
    try {
      const result = await this.client.emails.send({
        from,
        to,
        subject,
        html,
      })

      logger.info("Email sent successfully", {
        from,
        to,
        subject,
        messageId: result.data?.id,
      })

      return result
    } catch (error) {
      logger.error("Failed to send email", error as Error, { from, to, subject })
      throw error
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    try {
      const emailHtml = await render(
        <WelcomeEmail userName={name} userEmail={to} />
      )

      const subject = "Welcome to Mailfra! 🚀 Let's 10x Your Cold Email Results"

      return this.send({
        from: FROM_EMAIL,
        to,
        subject,
        html: emailHtml,
      })
    } catch (error) {
      // Fallback to simple welcome email if template fails
      logger.error("Failed to render welcome email template, using fallback", error as Error)

      const subject = "Welcome to Mailfra! 🚀"
      const html = `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
            <h1>Welcome to Mailfra, ${name}! 🚀</h1>
            <p>Thank you for joining. We're excited to help you transform your cold email outreach with AI-powered personalization.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Go to your Dashboard →</a></p>
            <p>Best regards,<br/>The Mailfra Team</p>
          </body>
        </html>
      `

      return this.send({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      })
    }
  }


  async sendCampaignCompletedEmail(to: string, campaignName: string, stats: any) {
    const subject = `Campaign "${campaignName}" Completed! 📊`
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Campaign Completed!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Great work! 🎉</h2>
            
            <p style="font-size: 16px; color: #4b5563;">
              Your campaign "<strong>${campaignName}</strong>" has completed. Here are your results:
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Campaign Stats</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong>Emails Sent:</strong> ${stats.emailsSent}
                </li>
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong>Open Rate:</strong> ${stats.openRate}%
                </li>
                <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                  <strong>Click Rate:</strong> ${stats.clickRate}%
                </li>
                <li style="padding: 10px 0;">
                  <strong>Reply Rate:</strong> ${stats.replyRate}%
                </li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Full Analytics
              </a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
  }

  async sendOnboardingReminder(
    to: string,
    name: string,
    progress: number,
    remainingSteps: number,
    isFirstEmail: boolean,
  ) {
    const subject = isFirstEmail
      ? "🚀 You're almost there! Complete your mailfra setup"
      : "⏰ Final reminder: Unlock the full power of mailfra"

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">mailfra</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 👋</h2>
            
            ${isFirstEmail
        ? `
              <p style="font-size: 16px; color: #4b5563;">
                We noticed you started setting up your mailfra account but haven't completed all the steps yet. 
                You're <strong>${progress}% of the way there</strong>!
              </p>
            `
        : `
              <p style="font-size: 16px; color: #4b5563;">
                This is your final reminder! You're so close to unlocking the full power of AI-powered cold email outreach.
                Just <strong>${remainingSteps} step${remainingSteps > 1 ? "s" : ""}</strong> remaining!
              </p>
            `
      }
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <h3 style="margin-top: 0; color: #1f2937;">Your Progress: ${progress}%</h3>
              <div style="background: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${progress}%;"></div>
              </div>
              <p style="margin-bottom: 0; margin-top: 15px; color: #6b7280; font-size: 14px;">
                ${remainingSteps} step${remainingSteps > 1 ? "s" : ""} remaining to complete your setup
              </p>
            </div>
            
            <h3 style="color: #1f2937;">Why complete your setup?</h3>
            <ul style="color: #4b5563; padding-left: 20px;">
              <li style="margin-bottom: 10px;">🎯 <strong>10x your response rates</strong> with AI-powered personalization</li>
              <li style="margin-bottom: 10px;">⚡ <strong>Save 20+ hours per week</strong> on prospect research</li>
              <li style="margin-bottom: 10px;">📈 <strong>Track every open, click, and reply</strong> in real-time</li>
              <li style="margin-bottom: 10px;">🚀 <strong>Scale your outreach</strong> without sacrificing quality</li>
            </ul>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Complete Your Setup Now
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #667eea;">documentation</a>.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>mailfra - AI-Powered Cold Email Personalization</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a> • 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #9ca3af; text-decoration: none;">Terms of Service</a>
            </p>
          </div>
        </body>
      </html>
    `

    return this.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    })
  }
  async sendCampaignLaunchedEmail(to: string, campaignName: string, totalProspects: number) {
    const subject = `Campaign "${campaignName}" is Live! 🚀`
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Campaign Launched! 🚀</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Your campaign is now sending!</h2>
            
            <p style="font-size: 16px; color: #4b5563;">
              Your campaign "<strong>${campaignName}</strong>" has been launched successfully and is now sending emails to <strong>${totalProspects} prospects</strong>.
            </p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; color: #065f46;">
                <strong>What's Next?</strong><br>
                Monitor your campaign performance in real-time. You'll receive notifications when prospects open, click, and reply to your emails.
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/campaigns" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Track Your Campaign
              </a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.send({ from: FROM_EMAIL, to, subject, html })
  }

  async sendLowCreditsWarning(to: string, name: string, emailCredits: number, researchCredits: number) {
    const subject = "⚠️ Low Credits Warning - Top Up Now"
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Low Credits Warning</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}!</h2>
            
            <p style="font-size: 16px; color: #4b5563;">
              Your credits are running low. Top up now to keep your campaigns running smoothly.
            </p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e;">
                <strong>Current Balance:</strong><br>
                Email Credits: ${emailCredits}<br>
                Research Credits: ${researchCredits}
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Buy More Credits
              </a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.send({ from: FROM_EMAIL, to, subject, html })
  }

  async sendPaymentSuccessEmail(to: string, amount: number, credits: number, type: string) {
    const subject = "✅ Payment Successful - Credits Added"
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Payment Successful! ✅</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Thank you for your purchase!</h2>
            
            <p style="font-size: 16px; color: #4b5563;">
              Your payment of <strong>$${(amount / 100).toFixed(2)}</strong> has been processed successfully.
            </p>
            
            <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 18px; color: #065f46;">
                <strong style="font-size: 32px; display: block; margin-bottom: 10px;">${credits} Credits</strong>
                have been added to your account
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Purchase Type:</strong> ${type}<br>
              <strong>Date:</strong> ${new Date().toLocaleDateString()}
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Start Using Your Credits
              </a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.send({ from: FROM_EMAIL, to, subject, html })
  }

  async sendPaymentFailedEmail(to: string, reason: string) {
    const subject = "❌ Payment Failed - Action Required"
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Payment Failed</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">We couldn't process your payment</h2>
            
            <p style="font-size: 16px; color: #4b5563;">
              Your recent payment attempt failed. Please update your payment method to continue using MailFra.
            </p>
            
            <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; color: #991b1b;">
                <strong>Reason:</strong> ${reason}
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Update Payment Method
              </a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.send({ from: FROM_EMAIL, to, subject, html })
  }

  async sendWarmupCompletedEmail(to: string, accountEmail: string, finalHealth: number) {
    const subject = "🎉 Email Warmup Completed - You're Ready to Send!"
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Warmup Complete! 🎉</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Your email is warmed up and ready!</h2>
            
            <p style="font-size: 16px; color: #4b5563;">
              Great news! Your email account <strong>${accountEmail}</strong> has completed the warmup process and is now ready for campaigns.
            </p>
            
            <div style="background: #f0fdf4; border: 2px solid #10b981; padding: 30px; margin: 30px 0; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 18px; color: #065f46;">
                <strong style="font-size: 48px; display: block; margin-bottom: 10px;">${finalHealth}%</strong>
                Final Health Score
              </p>
            </div>
            
            <h3 style="color: #1f2937;">What This Means:</h3>
            <ul style="color: #4b5563; padding-left: 20px;">
              <li style="margin-bottom: 10px;">✅ Your emails will land in the inbox, not spam</li>
              <li style="margin-bottom: 10px;">✅ You can start sending campaigns with confidence</li>
              <li style="margin-bottom: 10px;">✅ Your domain reputation is strong</li>
              <li style="margin-bottom: 10px;">✅ Expect high deliverability rates</li>
            </ul>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/campaigns/new" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Create Your First Campaign
              </a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.send({ from: FROM_EMAIL, to, subject, html })
  }

  async sendAccountHealthAlert(to: string, accountEmail: string, healthScore: number, issues: string[]) {
    const subject = `⚠️ Account Health Alert - ${accountEmail}`
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Account Health Alert ⚠️</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Action Required</h2>
            
            <p style="font-size: 16px; color: #4b5563;">
              Your email account <strong>${accountEmail}</strong> is experiencing deliverability issues.
            </p>
            
            <div style="background: #fee2e2; border: 2px solid #dc2626; padding: 30px; margin: 30px 0; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 18px; color: #991b1b;">
                <strong style="font-size: 48px; display: block; margin-bottom: 10px;">${healthScore}%</strong>
                Current Health Score
              </p>
            </div>
            
            <h3 style="color: #1f2937;">Issues Detected:</h3>
            <ul style="color: #4b5563; padding-left: 20px;">
              ${issues.map((issue) => `<li style="margin-bottom: 10px;">${issue}</li>`).join("")}
            </ul>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e;">
                <strong>Recommended Actions:</strong><br>
                • Pause campaigns temporarily<br>
                • Review your email content<br>
                • Check your sending volume<br>
                • Monitor bounce and spam rates
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/warmup" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Account Health
              </a>
            </div>
          </div>
        </body>
      </html>
    `

    return this.send({ from: FROM_EMAIL, to, subject, html })
  }
}

export const resend = new ResendService()

export const FROM_EMAIL = env.RESEND_FROM_EMAIL || "ReachAI <noreply@reachai.app>"

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  from = FROM_EMAIL,
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  return resend.send({ from, to, subject, html })
}
