import { generateText } from "ai"
import { logger } from "@/lib/logger"

/**
 * WARMUP REPLY AUTOMATION
 * Generates intelligent, contextual replies to warmup emails
 */
export class WarmupReplyAutomation {
  /**
   * Generate a natural reply to a warmup email
   */
  async generateReply(originalEmail: {
    subject: string
    body: string
    from: string
    warmupId: string
  }): Promise<string> {
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: `You are generating a natural, friendly reply to a warmup email. The goal is to create realistic email engagement that looks human.

Original Email:
From: ${originalEmail.from}
Subject: ${originalEmail.subject}
Body: ${originalEmail.body}

Generate a brief, natural reply (2-4 sentences) that:
- Sounds authentic and conversational
- Relates to the content of the original email
- Uses varied tone (80% positive/helpful, 15% questions, 5% polite declining)
- Avoids sounding robotic or templated
- Is appropriate length for a quick email response

Reply:`,
        temperature: 0.9,
      })

      return text.trim()
    } catch (error) {
      logger.error("Error generating AI reply:", error as Error)

      // Fallback to simple replies
      const fallbacks = [
        "Thanks for reaching out! This sounds interesting. I'd be happy to learn more.",
        "Appreciate you sharing this. Let me review and get back to you soon.",
        "Thanks for the email! I'll take a look at this when I get a chance.",
        "Got your message. This looks helpful - I'll check it out.",
        "Thanks! I'm interested in learning more about this.",
      ]

      return fallbacks[Math.floor(Math.random() * fallbacks.length)]
    }
  }

  /**
   * Determine if email should receive a reply based on natural engagement patterns
   */
  shouldReply(interaction: { replyRate: number; consecutiveReplies: number }): boolean {
    const { replyRate, consecutiveReplies } = interaction

    // Avoid replying to every email (unrealistic)
    if (Math.random() > replyRate / 100) return false

    // Avoid long reply chains (unrealistic)
    if (consecutiveReplies >= 3) return false

    return true
  }

  /**
   * Calculate reply delay to mimic human behavior
   */
  calculateReplyDelay(): number {
    // Weighted random delay:
    // 5% within 15 mins (very engaged)
    // 25% within 1-2 hours (engaged)
    // 50% within 2-6 hours (normal)
    // 20% within 6-24 hours (busy)

    const random = Math.random()

    if (random < 0.05) {
      // 15-30 minutes
      return 15 + Math.random() * 15
    } else if (random < 0.3) {
      // 1-2 hours
      return 60 + Math.random() * 60
    } else if (random < 0.8) {
      // 2-6 hours
      return 120 + Math.random() * 240
    } else {
      // 6-24 hours
      return 360 + Math.random() * 1080
    }
  }
}

export const warmupReplyAutomation = new WarmupReplyAutomation()
