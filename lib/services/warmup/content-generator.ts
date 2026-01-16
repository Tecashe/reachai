// import { prisma } from "@/lib/db"
// import { logger } from "@/lib/logger"

// /**
//  * CONTENT GENERATOR
//  * Generates realistic, varied email content for warmup
//  * Avoids spam triggers, creates business-appropriate messages
//  * Supports multiple industries and conversation types
//  */
// class ContentGenerator {
//   private spamTriggers: Set<string> = new Set()
//   private lastCacheUpdate = 0
//   private readonly CACHE_TTL = 3600000 // 1 hour

//   /**
//    * Generate email subject line
//    */
//   async generateSubject(topic: string, industry?: string): Promise<string> {
//     await this.loadSpamTriggers()

//     const templates = this.getSubjectTemplates(topic, industry)
//     let subject = templates[Math.floor(Math.random() * templates.length)]

//     // Replace variables
//     subject = this.replaceVariables(subject)

//     // Check for spam triggers
//     subject = await this.avoidSpamTriggers(subject)

//     return subject
//   }

//   /**
//    * Generate email body
//    */
//   async generateBody(params: {
//     topic: string
//     industry?: string
//     formalityLevel?: "casual" | "professional" | "formal"
//     includeLinks?: boolean
//     includeSignature?: boolean
//     wordCount?: number
//   }): Promise<string> {
//     await this.loadSpamTriggers()

//     const {
//       topic,
//       industry,
//       formalityLevel = "professional",
//       includeLinks = false,
//       includeSignature = true,
//       wordCount = 100,
//     } = params

//     // Get body template
//     const templates = this.getBodyTemplates(topic, industry, formalityLevel)
//     let body = templates[Math.floor(Math.random() * templates.length)]

//     // Replace variables
//     body = this.replaceVariables(body)

//     // Add links if requested
//     if (includeLinks) {
//       body = this.addRealisticLink(body, topic)
//     }

//     // Add signature if requested
//     if (includeSignature) {
//       body += "\n\n" + this.generateSignature(formalityLevel)
//     }

//     // Check for spam triggers
//     body = await this.avoidSpamTriggers(body)

//     return body
//   }

//   /**
//    * Generate thread message (reply in conversation)
//    */
//   async generateThreadMessage(params: {
//     topic: string
//     industry?: string
//     messageNumber: number
//     isReply: boolean
//     previousMessages: string[]
//     includeLinks?: boolean
//     includeAttachments?: boolean
//   }): Promise<{ subject: string; body: string }> {
//     const { topic, industry, messageNumber, isReply, previousMessages } = params

//     // Generate contextual reply
//     const replyTemplates = this.getReplyTemplates(topic, messageNumber)
//     let body = replyTemplates[Math.floor(Math.random() * replyTemplates.length)]

//     // Add context from previous messages
//     if (isReply && previousMessages.length > 0) {
//       const lastSubject = previousMessages[0]
//       body = `Re: ${lastSubject}\n\n` + body
//     }

//     body = this.replaceVariables(body)
//     body = await this.avoidSpamTriggers(body)

//     // Subject is always "Re: " for replies
//     const subject =
//       isReply && previousMessages[0] ? `Re: ${previousMessages[0]}` : await this.generateSubject(topic, industry)

//     return { subject, body }
//   }

//   /**
//    * Load spam triggers from database
//    */
//   private async loadSpamTriggers(): Promise<void> {
//     // Cache for 1 hour
//     if (Date.now() - this.lastCacheUpdate < this.CACHE_TTL && this.spamTriggers.size > 0) {
//       return
//     }

//     try {
//       const triggers = await prisma.spamTrigger.findMany({
//         where: { isActive: true },
//         select: { word: true },
//       })

//       this.spamTriggers = new Set(triggers.map((t) => t.word.toLowerCase()))
//       this.lastCacheUpdate = Date.now()

//       logger.info("[ContentGenerator] Spam triggers loaded", { count: this.spamTriggers.size })
//     } catch (error) {
//       logger.error("[ContentGenerator] Failed to load spam triggers", { error })
//     }
//   }

//   /**
//    * Avoid spam trigger words
//    */
//   private async avoidSpamTriggers(text: string): Promise<string> {
//     const words = text.split(/\s+/)
//     const replacements: Record<string, string> = {
//       free: "complimentary",
//       urgent: "important",
//       "act now": "please review",
//       "limited time": "time-sensitive",
//       "click here": "see details",
//       "buy now": "learn more",
//       guarantee: "assurance",
//       winner: "recipient",
//       congratulations: "hello",
//     }

//     let cleaned = text
//     for (const [trigger, replacement] of Object.entries(replacements)) {
//       const regex = new RegExp(`\\b${trigger}\\b`, "gi")
//       cleaned = cleaned.replace(regex, replacement)
//     }

//     return cleaned
//   }

//   /**
//    * Get subject templates by topic
//    */
//   private getSubjectTemplates(topic: string, industry?: string): string[] {
//     const base = {
//       project_update: [
//         "Quick update on {{project}}",
//         "{{project}} - Latest progress",
//         "Status update: {{project}}",
//         "Re: {{project}} timeline",
//       ],
//       meeting_request: [
//         "Meeting request - {{topic}}",
//         "Schedule time to discuss {{topic}}",
//         "Available to chat about {{topic}}?",
//         "Quick sync on {{topic}}",
//       ],
//       proposal_discussion: [
//         "Thoughts on the {{proposal}}",
//         "Following up on {{proposal}}",
//         "{{proposal}} - Next steps",
//         "Feedback on {{proposal}}",
//       ],
//       follow_up: ["Following up on our discussion", "Checking in", "Quick follow-up", "Touching base"],
//       introduction: [
//         "Introduction from {{name}}",
//         "Connecting via {{mutual}}",
//         "Nice to meet you",
//         "Quick introduction",
//       ],
//     }

//     return base[topic] || base.follow_up
//   }

//   /**
//    * Get body templates
//    */
//   private getBodyTemplates(topic: string, industry?: string, formality: string): string[] {
//     const professional = {
//       project_update: [
//         `Hi {{name}},\n\nI wanted to share a quick update on {{project}}. We've made significant progress this week and are on track for the {{deadline}}.\n\nKey accomplishments:\n- {{item1}}\n- {{item2}}\n\nLet me know if you have any questions.`,
//         `Hello {{name}},\n\nJust a brief update on {{project}}. Things are moving forward smoothly. We completed {{milestone}} and are now focusing on {{next_step}}.\n\nI'll keep you posted on further developments.`,
//       ],
//       meeting_request: [
//         `Hi {{name}},\n\nI'd like to schedule some time to discuss {{topic}}. Would you be available for a {{duration}} call this week?\n\nI'm flexible on timing - let me know what works best for you.`,
//         `Hello {{name}},\n\nCan we set up a brief meeting to go over {{topic}}? I have some updates to share and would value your input.\n\nPlease let me know your availability.`,
//       ],
//       follow_up: [
//         `Hi {{name}},\n\nI wanted to follow up on our conversation about {{topic}}. Have you had a chance to review the information I shared?\n\nLet me know if you need any clarification.`,
//         `Hello {{name}},\n\nJust checking in to see if you had any thoughts on {{topic}}. No rush - whenever you have a moment.`,
//       ],
//     }

//     return professional[topic] || professional.follow_up
//   }

//   /**
//    * Get reply templates
//    */
//   private getReplyTemplates(topic: string, messageNumber: number): string[] {
//     if (messageNumber === 2) {
//       return [
//         `Thanks for getting back to me. That makes sense.`,
//         `Appreciate the quick response. I'll {{action}}.`,
//         `Perfect, that works for me. I'll {{action}}.`,
//       ]
//     }

//     if (messageNumber === 3) {
//       return [
//         `Got it, thanks for clarifying.`,
//         `That's helpful, thank you.`,
//         `Sounds good, I'll proceed with {{action}}.`,
//       ]
//     }

//     return [
//       `Thanks again for your help with this.`,
//       `Appreciate your time on this.`,
//       `Great, I'll follow up if anything comes up.`,
//     ]
//   }

//   /**
//    * Replace template variables
//    */
//   private replaceVariables(text: string): string {
//     const variables: Record<string, string[]> = {
//       name: ["Sarah", "Mike", "David", "Jennifer", "Alex", "Chris"],
//       project: ["Q4 Initiative", "Client Onboarding", "Platform Update", "Research Study"],
//       topic: ["quarterly planning", "system updates", "project timeline", "team coordination"],
//       proposal: ["new framework", "updated approach", "revised plan", "implementation strategy"],
//       deadline: ["end of month", "next Friday", "end of quarter", "next week"],
//       item1: ["Completed user research", "Finalized specifications", "Reviewed proposals"],
//       item2: ["Updated documentation", "Coordinated with team", "Scheduled next phase"],
//       milestone: ["phase one", "initial testing", "preliminary review"],
//       next_step: ["implementation", "testing phase", "final review"],
//       duration: ["15-minute", "30-minute", "quick"],
//       action: ["follow up", "review the details", "proceed as discussed", "send over the information"],
//       mutual: ["LinkedIn", "a colleague", "our mutual connection"],
//     }

//     let replaced = text
//     for (const [key, values] of Object.entries(variables)) {
//       const regex = new RegExp(`{{${key}}}`, "g")
//       const value = values[Math.floor(Math.random() * values.length)]
//       replaced = replaced.replace(regex, value)
//     }

//     return replaced
//   }

//   /**
//    * Add realistic link
//    */
//   private addRealisticLink(body: string, topic: string): string {
//     const links = [
//       "https://docs.example.com/project-overview",
//       "https://drive.example.com/document/details",
//       "https://portal.example.com/dashboard",
//       "https://calendar.example.com/schedule",
//     ]

//     const link = links[Math.floor(Math.random() * links.length)]
//     return body + `\n\nRelevant details: ${link}`
//   }

//   /**
//    * Generate email signature
//    */
//   private generateSignature(formality: string): string {
//     const names = ["Sarah Johnson", "Michael Chen", "David Rodriguez", "Jennifer Park"]
//     const titles = ["Project Manager", "Senior Consultant", "Operations Lead", "Account Director"]

//     const name = names[Math.floor(Math.random() * names.length)]
//     const title = titles[Math.floor(Math.random() * titles.length)]

//     if (formality === "casual") {
//       return `Best,\n${name}`
//     }

//     return `Best regards,\n${name}\n${title}`
//   }

//   /**
//    * Calculate spam score for content
//    */
//   async calculateSpamScore(text: string): Promise<number> {
//     await this.loadSpamTriggers()

//     let score = 0
//     const words = text.toLowerCase().split(/\s+/)

//     // Check for spam triggers
//     for (const word of words) {
//       if (this.spamTriggers.has(word)) {
//         score += 10
//       }
//     }

//     // Check for excessive capitalization
//     const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
//     if (capsRatio > 0.3) score += 15

//     // Check for excessive punctuation
//     const punctRatio = (text.match(/[!?]/g) || []).length / words.length
//     if (punctRatio > 0.1) score += 10

//     // Check for excessive numbers
//     const numbersRatio = (text.match(/\d/g) || []).length / text.length
//     if (numbersRatio > 0.2) score += 10

//     return Math.min(100, score)
//   }
// }

// export const contentGenerator = new ContentGenerator()
import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"

/**
 * CONTENT GENERATOR
 * Generates realistic, varied email content for warmup
 * Avoids spam triggers, creates business-appropriate messages
 * Supports multiple industries and conversation types
 */
class ContentGenerator {
  private spamTriggers: Set<string> = new Set()
  private lastCacheUpdate = 0
  private readonly CACHE_TTL = 3600000 // 1 hour

  /**
   * Generate email subject line
   */
  async generateSubject(topic: string, industry?: string): Promise<string> {
    await this.loadSpamTriggers()

    const templates = this.getSubjectTemplates(topic, industry)
    let subject = templates[Math.floor(Math.random() * templates.length)]

    // Replace variables
    subject = this.replaceVariables(subject)

    // Check for spam triggers
    subject = await this.avoidSpamTriggers(subject)

    return subject
  }

  /**
   * Generate email body
   */
  async generateBody(params: {
    topic: string
    industry?: string
    formalityLevel?: "casual" | "professional" | "formal"
    includeLinks?: boolean
    includeSignature?: boolean
    wordCount?: number
  }): Promise<string> {
    await this.loadSpamTriggers()

    const {
      topic,
      industry,
      formalityLevel = "professional",
      includeLinks = false,
      includeSignature = true,
      wordCount = 100,
    } = params

    // Get body template
    const templates = this.getBodyTemplates(topic, industry, formalityLevel)
    let body = templates[Math.floor(Math.random() * templates.length)]

    // Replace variables
    body = this.replaceVariables(body)

    // Add links if requested
    if (includeLinks) {
      body = this.addRealisticLink(body, topic)
    }

    // Add signature if requested
    if (includeSignature) {
      body += "\n\n" + this.generateSignature(formalityLevel)
    }

    // Check for spam triggers
    body = await this.avoidSpamTriggers(body)

    return body
  }

  /**
   * Generate thread message (reply in conversation)
   */
  async generateThreadMessage(params: {
    topic: string
    industry?: string
    messageNumber: number
    isReply: boolean
    previousMessages: string[]
    includeLinks?: boolean
    includeAttachments?: boolean
  }): Promise<{ subject: string; body: string }> {
    const { topic, industry, messageNumber, isReply, previousMessages } = params

    // Generate contextual reply
    const replyTemplates = this.getReplyTemplates(topic, messageNumber)
    let body = replyTemplates[Math.floor(Math.random() * replyTemplates.length)]

    // Add context from previous messages
    if (isReply && previousMessages.length > 0) {
      const lastSubject = previousMessages[0]
      body = `Re: ${lastSubject}\n\n` + body
    }

    body = this.replaceVariables(body)
    body = await this.avoidSpamTriggers(body)

    // Subject is always "Re: " for replies
    const subject =
      isReply && previousMessages[0] ? `Re: ${previousMessages[0]}` : await this.generateSubject(topic, industry)

    return { subject, body }
  }

  /**
   * Load spam triggers from database
   */
  private async loadSpamTriggers(): Promise<void> {
    // Cache for 1 hour
    if (Date.now() - this.lastCacheUpdate < this.CACHE_TTL && this.spamTriggers.size > 0) {
      return
    }

    try {
      const triggers = await prisma.spamTrigger.findMany({
        where: { isActive: true },
        select: { word: true },
      })

      this.spamTriggers = new Set(triggers.map((t) => t.word.toLowerCase()))
      this.lastCacheUpdate = Date.now()

      logger.info("[ContentGenerator] Spam triggers loaded", { count: this.spamTriggers.size })
    } catch (error) {
      logger.error("[ContentGenerator] Failed to load spam triggers", { error })
    }
  }

  /**
   * Avoid spam trigger words
   */
  private async avoidSpamTriggers(text: string): Promise<string> {
    const words = text.split(/\s+/)
    const replacements: Record<string, string> = {
      free: "complimentary",
      urgent: "important",
      "act now": "please review",
      "limited time": "time-sensitive",
      "click here": "see details",
      "buy now": "learn more",
      guarantee: "assurance",
      winner: "recipient",
      congratulations: "hello",
    }

    let cleaned = text
    for (const [trigger, replacement] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${trigger}\\b`, "gi")
      cleaned = cleaned.replace(regex, replacement)
    }

    return cleaned
  }

  /**
   * Get subject templates by topic
   */
  private getSubjectTemplates(topic: string, industry?: string): string[] {
    const base: Record<string, string[]> = {
      project_update: ["Quick update on {{project}}", "{{project}} - Latest progress"],
      meeting_request: ["Meeting request - {{topic}}", "Schedule time to discuss {{topic}}"],
      follow_up: ["Following up on our discussion", "Checking in"],
    }

    return base[topic] ?? base.follow_up
  }

  /**
   * Get body templates
   */
  private getBodyTemplates(topic: string, industry?: string, formality?: string): string[] {
    const professional: Record<string, string[]> = {
      project_update: [`Hi {{name}},\n\nUpdate on {{project}}...`],
      meeting_request: [`Hi {{name}},\n\nLet's schedule time...`],
      follow_up: [`Hi {{name}},\n\nFollowing up...`],
    }

    return professional[topic] ?? professional.follow_up
  }

  /**
   * Get reply templates
   */
  private getReplyTemplates(topic: string, messageNumber: number): string[] {
    if (messageNumber === 2) {
      return [
        `Thanks for getting back to me. That makes sense.`,
        `Appreciate the quick response. I'll {{action}}.`,
        `Perfect, that works for me. I'll {{action}}.`,
      ]
    }

    if (messageNumber === 3) {
      return [
        `Got it, thanks for clarifying.`,
        `That's helpful, thank you.`,
        `Sounds good, I'll proceed with {{action}}.`,
      ]
    }

    return [
      `Thanks again for your help with this.`,
      `Appreciate your time on this.`,
      `Great, I'll follow up if anything comes up.`,
    ]
  }

  /**
   * Replace template variables
   */
  private replaceVariables(text: string): string {
    const variables: Record<string, string[]> = {
      name: ["Sarah", "Mike", "David", "Jennifer", "Alex", "Chris"],
      project: ["Q4 Initiative", "Client Onboarding", "Platform Update", "Research Study"],
      topic: ["quarterly planning", "system updates", "project timeline", "team coordination"],
      proposal: ["new framework", "updated approach", "revised plan", "implementation strategy"],
      deadline: ["end of month", "next Friday", "end of quarter", "next week"],
      item1: ["Completed user research", "Finalized specifications", "Reviewed proposals"],
      item2: ["Updated documentation", "Coordinated with team", "Scheduled next phase"],
      milestone: ["phase one", "initial testing", "preliminary review"],
      next_step: ["implementation", "testing phase", "final review"],
      duration: ["15-minute", "30-minute", "quick"],
      action: ["follow up", "review the details", "proceed as discussed", "send over the information"],
      mutual: ["LinkedIn", "a colleague", "our mutual connection"],
    }

    let replaced = text
    for (const [key, values] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, "g")
      const value = values[Math.floor(Math.random() * values.length)]
      replaced = replaced.replace(regex, value)
    }

    return replaced
  }

  /**
   * Add realistic link
   */
  private addRealisticLink(body: string, topic: string): string {
    const links = [
      "https://docs.example.com/project-overview",
      "https://drive.example.com/document/details",
      "https://portal.example.com/dashboard",
      "https://calendar.example.com/schedule",
    ]

    const link = links[Math.floor(Math.random() * links.length)]
    return body + `\n\nRelevant details: ${link}`
  }

  /**
   * Generate email signature
   */
  private generateSignature(formality: string): string {
    const names = ["Sarah Johnson", "Michael Chen", "David Rodriguez", "Jennifer Park"]
    const titles = ["Project Manager", "Senior Consultant", "Operations Lead", "Account Director"]

    const name = names[Math.floor(Math.random() * names.length)]
    const title = titles[Math.floor(Math.random() * titles.length)]

    if (formality === "casual") {
      return `Best,\n${name}`
    }

    return `Best regards,\n${name}\n${title}`
  }

  /**
   * Calculate spam score for content
   */
  async calculateSpamScore(text: string): Promise<number> {
    await this.loadSpamTriggers()

    let score = 0
    const words = text.toLowerCase().split(/\s+/)

    // Check for spam triggers
    for (const word of words) {
      if (this.spamTriggers.has(word)) {
        score += 10
      }
    }

    // Check for excessive capitalization
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length
    if (capsRatio > 0.3) score += 15

    // Check for excessive punctuation
    const punctRatio = (text.match(/[!?]/g) || []).length / words.length
    if (punctRatio > 0.1) score += 10

    // Check for excessive numbers
    const numbersRatio = (text.match(/\d/g) || []).length / text.length
    if (numbersRatio > 0.2) score += 10

    return Math.min(100, score)
  }
}

export const contentGenerator = new ContentGenerator()
