import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { emailSender } from "@/lib/services/email-sender"

export const dynamic = "force-dynamic"
export const maxDuration = 300

/**
 * MAIN SEQUENCE EMAIL SENDER CRON
 * This sends the primary email sequence steps (step 1, 2, 3, etc.)
 * Runs every 5-15 minutes to process active campaigns
 */
export async function GET(req: Request) {
  try {
    // Auth check
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[SEQUENCE CRON] Starting main sequence processing...")

    // Get all ACTIVE campaigns with email sequences
    const campaigns = await db.campaign.findMany({
      where: {
        status: "ACTIVE",
        emailSequences: {
          some: {}, // Has at least one sequence
        },
      },
      include: {
        emailSequences: {
          include: { template: true },
          orderBy: { stepNumber: "asc" },
        },
      },
    })

    let emailsSent = 0
    let prospectsProcessed = 0
    let errors = 0

    for (const campaign of campaigns) {
      console.log(`[SEQUENCE CRON] Processing campaign: ${campaign.name} (${campaign.id})`)

      // Process each sequence step
      for (const sequence of campaign.emailSequences) {
        console.log(`[SEQUENCE CRON] Processing step ${sequence.stepNumber} for campaign ${campaign.name}`)

        // Find prospects ready for this step
        const eligibleProspects = await db.prospect.findMany({
          where: {
            campaignId: campaign.id,
            currentStep: sequence.stepNumber,
            status: "ACTIVE",
            replied: false, // Don't send to prospects who replied
            bounced: false, // Don't send to bounced emails
            unsubscribed: false, // Don't send to unsubscribed
            OR: [
              { lastContactedAt: null }, // Never contacted (step 1)
              {
                // Enough time has passed since last email
                lastContactedAt: {
                  lte: new Date(Date.now() - sequence.delayDays * 24 * 60 * 60 * 1000),
                },
              },
            ],
          },
        })

        console.log(
          `[SEQUENCE CRON] Found ${eligibleProspects.length} eligible prospects for step ${sequence.stepNumber}`
        )

        // Send email to each eligible prospect
        for (const prospect of eligibleProspects) {
          prospectsProcessed++

          try {
            // Apply sequence conditions
            if (sequence.sendOnlyIfNotReplied && prospect.replied) {
              console.log(`[SEQUENCE CRON] Skipping ${prospect.email} - already replied`)
              continue
            }

            if (sequence.sendOnlyIfNotOpened && prospect.emailsOpened === 0 && prospect.currentStep > 1) {
              console.log(`[SEQUENCE CRON] Skipping ${prospect.email} - hasn't opened previous emails`)
              continue
            }

            // Personalize template
            const personalizedSubject = personalizeTemplate(sequence.template.subject, prospect)
            const personalizedBody = personalizeTemplate(sequence.template.body, prospect)

            console.log(`[SEQUENCE CRON] Sending email to ${prospect.email} (step ${sequence.stepNumber})`)

            // Send email using your email sender service
            const result = await emailSender.sendCampaignEmail({
              to: prospect.email,
              subject: personalizedSubject,
              html: personalizedBody,
              userId: campaign.userId,
              campaignId: campaign.id,
              prospectId: prospect.id,
            })

            if (result.success) {
              // ✅ SUCCESS: Advance prospect to next step
              const nextStepNumber = sequence.stepNumber + 1
              const hasNextStep = campaign.emailSequences.some((s) => s.stepNumber === nextStepNumber)

              await db.prospect.update({
                where: { id: prospect.id },
                data: {
                  currentStep: hasNextStep ? nextStepNumber : sequence.stepNumber,
                  lastContactedAt: new Date(),
                  status: hasNextStep ? "ACTIVE" : "COMPLETED", // Mark as completed if no more steps
                },
              })

              // Update campaign stats
              await db.campaign.update({
                where: { id: campaign.id },
                data: {
                  emailsSent: { increment: 1 },
                },
              })

              emailsSent++
              console.log(`[SEQUENCE CRON] ✅ Email sent successfully to ${prospect.email}`)
            } else {
              // ❌ FAILED: Log error but don't advance step
              console.error(`[SEQUENCE CRON] Failed to send to ${prospect.email}: ${result.error}`)
              errors++
            }
          } catch (error) {
            console.error(`[SEQUENCE CRON] Error processing prospect ${prospect.email}:`, error)
            errors++
          }

          // Rate limiting: small delay between emails
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }
    }

    console.log("[SEQUENCE CRON] ✅ Sequence processing completed", {
      campaignsProcessed: campaigns.length,
      prospectsProcessed,
      emailsSent,
      errors,
    })

    return NextResponse.json({
      success: true,
      campaignsProcessed: campaigns.length,
      prospectsProcessed,
      emailsSent,
      errors,
    })
  } catch (error) {
    console.error("[SEQUENCE CRON] Fatal error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    )
  }
}

/**
 * Personalize email template with prospect data
 */
function personalizeTemplate(text: string, prospect: any): string {
  let personalized = text

  // Replace all common variables
  personalized = personalized.replace(/\{\{firstName\}\}/g, prospect.firstName || "")
  personalized = personalized.replace(/\{\{lastName\}\}/g, prospect.lastName || "")
  personalized = personalized.replace(/\{\{company\}\}/g, prospect.company || "")
  personalized = personalized.replace(/\{\{jobTitle\}\}/g, prospect.jobTitle || "")
  personalized = personalized.replace(/\{\{email\}\}/g, prospect.email || "")
  personalized = personalized.replace(/\{\{phone\}\}/g, prospect.phoneNumber || "")
  personalized = personalized.replace(/\{\{location\}\}/g, prospect.location || "")
  personalized = personalized.replace(/\{\{industry\}\}/g, prospect.industry || "")
  personalized = personalized.replace(/\{\{companySize\}\}/g, prospect.companySize || "")

  // Handle personalizationTokens from research data (if it's JSON)
  if (prospect.personalizationTokens && typeof prospect.personalizationTokens === "object") {
    Object.entries(prospect.personalizationTokens).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
      personalized = personalized.replace(regex, String(value || ""))
    })
  }

  return personalized
}