// import { Resend } from "resend"
// import { env } from "./env"

// export const resend = new Resend(env.RESEND_API_KEY)

// export async function sendTransactionalEmail({
//   to,
//   subject,
//   html,
//   from = env.RESEND_FROM_EMAIL,
// }: {
//   to: string
//   subject: string
//   html: string
//   from?: string
// }) {
//   try {
//     const { data, error } = await resend.emails.send({
//       from,
//       to,
//       subject,
//       html,
//     })

//     if (error) {
//       console.error("[Resend] Error sending email:", error)
//       throw new Error(`Failed to send email: ${error.message}`)
//     }

//     return { success: true, id: data?.id }
//   } catch (error) {
//     console.error("[Resend] Exception:", error)
//     throw error
//   }
// }

// export async function sendWelcomeEmail(to: string, name: string) {
//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
//           .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
//           .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
//           .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Welcome to ReachAI!</h1>
//           </div>
//           <div class="content">
//             <p>Hi ${name},</p>
//             <p>Welcome to ReachAI - the AI-powered cold email personalization platform that helps you connect with prospects at scale.</p>
//             <p>Here's what you can do next:</p>
//             <ul>
//               <li>Create your first campaign</li>
//               <li>Import prospects via CSV</li>
//               <li>Generate personalized emails with AI</li>
//               <li>Track opens, clicks, and replies</li>
//             </ul>
//             <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
//             <p>If you have any questions, just reply to this email. We're here to help!</p>
//             <p>Best regards,<br>The ReachAI Team</p>
//           </div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} ReachAI. All rights reserved.</p>
//           </div>
//         </div>
//       </body>
//     </html>
//   `

//   return sendTransactionalEmail({
//     to,
//     subject: "Welcome to ReachAI - Let's Get Started!",
//     html,
//   })
// }

// export async function sendCampaignCompletedEmail(to: string, campaignName: string, stats: any) {
//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//           .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//           .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
//           .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
//           .stats { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
//           .stat { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
//           .stat:last-child { border-bottom: none; }
//           .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Campaign Completed!</h1>
//           </div>
//           <div class="content">
//             <p>Your campaign "<strong>${campaignName}</strong>" has completed.</p>
//             <div class="stats">
//               <div class="stat"><span>Emails Sent:</span><strong>${stats.sent}</strong></div>
//               <div class="stat"><span>Opened:</span><strong>${stats.opened} (${stats.openRate}%)</strong></div>
//               <div class="stat"><span>Clicked:</span><strong>${stats.clicked} (${stats.clickRate}%)</strong></div>
//               <div class="stat"><span>Replied:</span><strong>${stats.replied} (${stats.replyRate}%)</strong></div>
//             </div>
//             <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard/campaigns" class="button">View Campaign Details</a>
//           </div>
//         </div>
//       </body>
//     </html>
//   `

//   return sendTransactionalEmail({
//     to,
//     subject: `Campaign "${campaignName}" Completed - Results Inside`,
//     html,
//   })
// }

// import { Resend as ResendClient } from "resend"
// import { env } from "@/lib/env"
// import { logger } from "@/lib/logger"

// class ResendService {
//   private client: ResendClient

//   constructor() {
//     this.client = new ResendClient(env.RESEND_API_KEY)
//   }

//   async send({ to, subject, html }: { to: string; subject: string; html: string }) {
//     try {
//       const result = await this.client.emails.send({
//         from: env.RESEND_FROM_EMAIL || "ReachAI <noreply@reachai.app>",
//         to,
//         subject,
//         html,
//       })

//       // logger.info("Email sent successfully", undefined, {
//       //   to,
//       //   subject,
//       //   messageId: result.data?.id,
//       // })

//       return result
//     } catch (error) {
//       logger.error("Failed to send email", error as Error, { to, subject })
//       throw error
//     }
//   }

//   async sendWelcomeEmail(to: string, name: string) {
//     const subject = "Welcome to ReachAI! 🚀"
//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>${subject}</title>
//         </head>
//         <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ReachAI!</h1>
//           </div>
          
//           <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
//             <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 👋</h2>
            
//             <p style="font-size: 16px; color: #4b5563;">
//               Welcome to ReachAI - the most powerful AI-powered cold email personalization platform.
//             </p>
            
//             <p style="font-size: 16px; color: #4b5563;">
//               We're excited to help you 10x your response rates and save hours on prospect research.
//             </p>
            
//             <h3 style="color: #1f2937;">Get Started in 3 Easy Steps:</h3>
//             <ol style="color: #4b5563; padding-left: 20px;">
//               <li style="margin-bottom: 15px;"><strong>Create a Campaign</strong> - Organize your outreach efforts</li>
//               <li style="margin-bottom: 15px;"><strong>Add Prospects</strong> - Upload a CSV or add manually</li>
//               <li style="margin-bottom: 15px;"><strong>Generate & Send</strong> - Let AI personalize and send emails</li>
//             </ol>
            
//             <div style="text-align: center; margin: 40px 0;">
//               <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
//                  style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
//                 Go to Dashboard
//               </a>
//             </div>
            
//             <p style="color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
//               Need help? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #667eea;">documentation</a> or reply to this email.
//             </p>
//           </div>
          
//           <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
//             <p>ReachAI - AI-Powered Cold Email Personalization</p>
//           </div>
//         </body>
//       </html>
//     `

//     return this.send({ to, subject, html })
//   }

//   async sendCampaignCompletedEmail(to: string, campaignName: string, stats: any) {
//     const subject = `Campaign "${campaignName}" Completed! 📊`
//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>${subject}</title>
//         </head>
//         <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">Campaign Completed!</h1>
//           </div>
          
//           <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
//             <h2 style="color: #1f2937; margin-top: 0;">Great work! 🎉</h2>
            
//             <p style="font-size: 16px; color: #4b5563;">
//               Your campaign "<strong>${campaignName}</strong>" has completed. Here are your results:
//             </p>
            
//             <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
//               <h3 style="margin-top: 0; color: #1f2937;">Campaign Stats</h3>
//               <ul style="list-style: none; padding: 0; margin: 0;">
//                 <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
//                   <strong>Emails Sent:</strong> ${stats.emailsSent}
//                 </li>
//                 <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
//                   <strong>Open Rate:</strong> ${stats.openRate}%
//                 </li>
//                 <li style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
//                   <strong>Click Rate:</strong> ${stats.clickRate}%
//                 </li>
//                 <li style="padding: 10px 0;">
//                   <strong>Reply Rate:</strong> ${stats.replyRate}%
//                 </li>
//               </ul>
//             </div>
            
//             <div style="text-align: center; margin: 40px 0;">
//               <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/analytics" 
//                  style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
//                 View Full Analytics
//               </a>
//             </div>
//           </div>
//         </body>
//       </html>
//     `

//     return this.send({ to, subject, html })
//   }

//   async sendOnboardingReminder(
//     to: string,
//     name: string,
//     progress: number,
//     remainingSteps: number,
//     isFirstEmail: boolean,
//   ) {
//     const subject = isFirstEmail
//       ? "🚀 You're almost there! Complete your ReachAI setup"
//       : "⏰ Final reminder: Unlock the full power of ReachAI"

//     const html = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>${subject}</title>
//         </head>
//         <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
//             <h1 style="color: white; margin: 0; font-size: 28px;">ReachAI</h1>
//           </div>
          
//           <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
//             <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 👋</h2>
            
//             ${
//               isFirstEmail
//                 ? `
//               <p style="font-size: 16px; color: #4b5563;">
//                 We noticed you started setting up your ReachAI account but haven't completed all the steps yet. 
//                 You're <strong>${progress}% of the way there</strong>!
//               </p>
//             `
//                 : `
//               <p style="font-size: 16px; color: #4b5563;">
//                 This is your final reminder! You're so close to unlocking the full power of AI-powered cold email outreach.
//                 Just <strong>${remainingSteps} step${remainingSteps > 1 ? "s" : ""}</strong> remaining!
//               </p>
//             `
//             }
            
//             <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
//               <h3 style="margin-top: 0; color: #1f2937;">Your Progress: ${progress}%</h3>
//               <div style="background: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden;">
//                 <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); height: 100%; width: ${progress}%;"></div>
//               </div>
//               <p style="margin-bottom: 0; margin-top: 15px; color: #6b7280; font-size: 14px;">
//                 ${remainingSteps} step${remainingSteps > 1 ? "s" : ""} remaining to complete your setup
//               </p>
//             </div>
            
//             <h3 style="color: #1f2937;">Why complete your setup?</h3>
//             <ul style="color: #4b5563; padding-left: 20px;">
//               <li style="margin-bottom: 10px;">🎯 <strong>10x your response rates</strong> with AI-powered personalization</li>
//               <li style="margin-bottom: 10px;">⚡ <strong>Save 20+ hours per week</strong> on prospect research</li>
//               <li style="margin-bottom: 10px;">📈 <strong>Track every open, click, and reply</strong> in real-time</li>
//               <li style="margin-bottom: 10px;">🚀 <strong>Scale your outreach</strong> without sacrificing quality</li>
//             </ul>
            
//             <div style="text-align: center; margin: 40px 0;">
//               <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
//                  style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
//                 Complete Your Setup Now
//               </a>
//             </div>
            
//             <p style="color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
//               Need help? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #667eea;">documentation</a>.
//             </p>
//           </div>
          
//           <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
//             <p>ReachAI - AI-Powered Cold Email Personalization</p>
//             <p>
//               <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a> • 
//               <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #9ca3af; text-decoration: none;">Terms of Service</a>
//             </p>
//           </div>
//         </body>
//       </html>
//     `

//     return this.send({
//       to,
//       subject,
//       html,
//     })
//   }
// }

// export const resend = new ResendService()

// export async function sendTransactionalEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
//   return resend.send({ to, subject, html })
// }

import { Resend as ResendClient } from "resend"
import { env } from "@/lib/env"
import { logger } from "@/lib/logger"

class ResendService {
  private client: ResendClient
  public emails: ResendClient["emails"]

  constructor() {
    this.client = new ResendClient(env.RESEND_API_KEY)
    this.emails = this.client.emails
  }

  async send({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
      const result = await this.client.emails.send({
        from: env.RESEND_FROM_EMAIL || "ReachAI <noreply@reachai.app>",
        to,
        subject,
        html,
      })

      // logger.info("Email sent successfully", undefined, {
      //   to,
      //   subject,
      //   messageId: result.data?.id,
      // })

      return result
    } catch (error) {
      logger.error("Failed to send email", error as Error, { to, subject })
      throw error
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const subject = "Welcome to ReachAI! 🚀"
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
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ReachAI!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p style="font-size: 16px; color: #4b5563;">
              Welcome to ReachAI - the most powerful AI-powered cold email personalization platform.
            </p>
            
            <p style="font-size: 16px; color: #4b5563;">
              We're excited to help you 10x your response rates and save hours on prospect research.
            </p>
            
            <h3 style="color: #1f2937;">Get Started in 3 Easy Steps:</h3>
            <ol style="color: #4b5563; padding-left: 20px;">
              <li style="margin-bottom: 15px;"><strong>Create a Campaign</strong> - Organize your outreach efforts</li>
              <li style="margin-bottom: 15px;"><strong>Add Prospects</strong> - Upload a CSV or add manually</li>
              <li style="margin-bottom: 15px;"><strong>Generate & Send</strong> - Let AI personalize and send emails</li>
            </ol>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Go to Dashboard
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Need help? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/docs" style="color: #667eea;">documentation</a> or reply to this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
            <p>ReachAI - AI-Powered Cold Email Personalization</p>
          </div>
        </body>
      </html>
    `

    return this.send({ to, subject, html })
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

    return this.send({ to, subject, html })
  }

  async sendOnboardingReminder(
    to: string,
    name: string,
    progress: number,
    remainingSteps: number,
    isFirstEmail: boolean,
  ) {
    const subject = isFirstEmail
      ? "🚀 You're almost there! Complete your ReachAI setup"
      : "⏰ Final reminder: Unlock the full power of ReachAI"

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
            <h1 style="color: white; margin: 0; font-size: 28px;">ReachAI</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 👋</h2>
            
            ${
              isFirstEmail
                ? `
              <p style="font-size: 16px; color: #4b5563;">
                We noticed you started setting up your ReachAI account but haven't completed all the steps yet. 
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
            <p>ReachAI - AI-Powered Cold Email Personalization</p>
            <p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #9ca3af; text-decoration: none;">Privacy Policy</a> • 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #9ca3af; text-decoration: none;">Terms of Service</a>
            </p>
          </div>
        </body>
      </html>
    `

    return this.send({
      to,
      subject,
      html,
    })
  }
}

export const resend = new ResendService()

export const FROM_EMAIL = env.RESEND_FROM_EMAIL || "ReachAI <noreply@reachai.app>"

export async function sendTransactionalEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  return resend.send({ to, subject, html })
}
