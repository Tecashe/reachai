// import { generateText } from "ai"

// interface EmailContext {
//   senderName: string
//   recipientName: string
//   industry?: string
//   warmupStage: string
// }

// interface GeneratedEmail {
//   subject: string
//   body: string
//   category: string
// }

// export class WarmupEmailGenerator {
//   /**
//    * Generate unique, contextual warmup email using AI
//    */
//   async generateWarmupEmail(context: EmailContext): Promise<GeneratedEmail> {
//     const { senderName, recipientName, industry, warmupStage } = context

//     // Use AI to generate truly unique content
//     const prompt = `Generate a professional, natural-sounding email for business networking. 

// Context:
// - Sender: ${senderName}
// - Recipient: ${recipientName}
// - Industry: ${industry || "business"}
// - Warmup Stage: ${warmupStage}

// Requirements:
// 1. Make it sound like a genuine human wrote it
// 2. Keep it brief (2-3 sentences)
// 3. Be friendly but professional
// 4. Include a natural reason for reaching out (e.g., saw their work, mutual interest, industry news)
// 5. NO sales pitch, NO product mentions
// 6. Vary the tone, length, and structure
// 7. Include natural conversation starters

// Return JSON with:
// {
//   "subject": "email subject (5-8 words)",
//   "body": "email body (2-3 sentences)",
//   "category": "category like networking, introduction, follow-up, etc."
// }`

//     try {
//       const { text } = await generateText({
//         model: "openai/gpt-4o-mini",
//         prompt,
//         temperature: 0.9, // High temperature for variety
//       })

//       // Parse AI response
//       const parsed = JSON.parse(text)

//       return {
//         subject: parsed.subject || `Quick question, ${recipientName}`,
//         body:
//           parsed.body ||
//           `Hi ${recipientName},\n\nHope you're doing well! Would love to connect.\n\nBest,\n${senderName}`,
//         category: parsed.category || "networking",
//       }
//     } catch (error) {
//       console.error("[WarmupEmailGenerator] AI generation failed:", error)

//       // Fallback to enhanced templates if AI fails
//       return this.generateFromTemplate(context)
//     }
//   }

//   /**
//    * Generate reply to warmup email
//    */
//   async generateReply(
//     originalSubject: string,
//     originalBody: string,
//     context: EmailContext,
//   ): Promise<{ subject: string; body: string }> {
//     const prompt = `Generate a natural, positive reply to this email:

// Subject: ${originalSubject}
// Body: ${originalBody}

// Reply as: ${context.recipientName}
// Responding to: ${context.senderName}

// Requirements:
// 1. Sound genuinely interested
// 2. Keep it brief (1-2 sentences)
// 3. Vary reply style (enthusiastic, thoughtful, brief acknowledgment)
// 4. Sometimes ask a follow-up question
// 5. Sometimes suggest connecting further

// Return JSON: { "subject": "Re: ...", "body": "reply text" }`

//     try {
//       const { text } = await generateText({
//         model: "openai/gpt-4o-mini",
//         prompt,
//         temperature: 0.9,
//       })

//       const parsed = JSON.parse(text)

//       return {
//         subject: parsed.subject || `Re: ${originalSubject}`,
//         body: parsed.body || `Thanks for reaching out!`,
//       }
//     } catch (error) {
//       console.error("[WarmupEmailGenerator] Reply generation failed:", error)

//       // Fallback reply
//       return {
//         subject: `Re: ${originalSubject}`,
//         body: `Hi ${context.senderName},\n\nThanks for reaching out! I appreciate you thinking of me.\n\nBest,\n${context.recipientName}`,
//       }
//     }
//   }

//   /**
//    * Fallback template-based generation with enhanced variety
//    */
//   private generateFromTemplate(context: EmailContext): GeneratedEmail {
//     const templates = [
//       {
//         subject: `Quick question about ${context.industry || "your work"}`,
//         body: `Hi ${context.recipientName},\n\nI came across your profile and was impressed by your background. Would love to connect and learn more about what you're working on.\n\nBest regards,\n${context.senderName}`,
//         category: "introduction",
//       },
//       {
//         subject: `Thought this might interest you`,
//         body: `Hey ${context.recipientName},\n\nSaw something recently that reminded me of our conversation. Hope all is well on your end!\n\nCheers,\n${context.senderName}`,
//         category: "follow-up",
//       },
//       {
//         subject: `Touching base`,
//         body: `Hi ${context.recipientName},\n\nJust wanted to reach out and say hello. How have things been?\n\nTalk soon,\n${context.senderName}`,
//         category: "networking",
//       },
//       {
//         subject: `Quick update from my side`,
//         body: `Hey ${context.recipientName},\n\nWanted to share a quick update. Things have been progressing nicely here. Hope you're doing great!\n\nBest,\n${context.senderName}`,
//         category: "update",
//       },
//     ]

//     return templates[Math.floor(Math.random() * templates.length)]
//   }

//   /**
//    * Add custom warmup identifier to email body (for filtering)
//    */
//   addWarmupIdentifier(body: string, identifier = "warmup-network"): string {
//     // Add hidden identifier in HTML comment or footer
//     return `${body}\n\n<!-- ${identifier} -->`
//   }
// }

// export const warmupEmailGenerator = new WarmupEmailGenerator()


// import { generateText } from "ai"

// interface EmailContext {
//   senderName: string
//   recipientName: string
//   industry?: string
//   warmupStage: string
// }

// interface GeneratedEmail {
//   subject: string
//   body: string
//   category: string
// }

// export class WarmupEmailGenerator {
//   /**
//    * Generate unique, contextual warmup email using AI
//    */
//   async generateWarmupEmail(
//     senderName: string,
//     recipientName: string,
//     industry?: string,
//     warmupStage?: string,
//   ): Promise<GeneratedEmail> {
//     // Reconstruct context object
//     const context = { senderName, recipientName, industry, warmupStage: warmupStage || "WARMING" }

//     const { senderName: sName, recipientName: rName, industry: ind, warmupStage: wStage } = context

//     // Use AI to generate truly unique content
//     const prompt = `Generate a professional, natural-sounding email for business networking. 

// Context:
// - Sender: ${sName}
// - Recipient: ${rName}
// - Industry: ${ind || "business"}
// - Warmup Stage: ${wStage}

// Requirements:
// 1. Make it sound like a genuine human wrote it
// 2. Keep it brief (2-3 sentences)
// 3. Be friendly but professional
// 4. Include a natural reason for reaching out (e.g., saw their work, mutual interest, industry news)
// 5. NO sales pitch, NO product mentions
// 6. Vary the tone, length, and structure
// 7. Include natural conversation starters

// Return JSON with:
// {
//   "subject": "email subject (5-8 words)",
//   "body": "email body (2-3 sentences)",
//   "category": "category like networking, introduction, follow-up, etc."
// }`

//     try {
//       const { text } = await generateText({
//         model: "openai/gpt-4o-mini",
//         prompt,
//         temperature: 0.9, // High temperature for variety
//       })

//       // Parse AI response
//       const parsed = JSON.parse(text)

//       return {
//         subject: parsed.subject || `Quick question, ${rName}`,
//         body: parsed.body || `Hi ${rName},\n\nHope you're doing well! Would love to connect.\n\nBest,\n${sName}`,
//         category: parsed.category || "networking",
//       }
//     } catch (error) {
//       console.error("[WarmupEmailGenerator] AI generation failed:", error)

//       // Fallback to enhanced templates if AI fails
//       return this.generateFromTemplate(context)
//     }
//   }

//   /**
//    * Generate reply to warmup email
//    */
//   async generateReply(
//     originalSubject: string,
//     originalBody: string,
//     context: EmailContext,
//   ): Promise<{ subject: string; body: string }> {
//     const prompt = `Generate a natural, positive reply to this email:

// Subject: ${originalSubject}
// Body: ${originalBody}

// Reply as: ${context.recipientName}
// Responding to: ${context.senderName}

// Requirements:
// 1. Sound genuinely interested
// 2. Keep it brief (1-2 sentences)
// 3. Vary reply style (enthusiastic, thoughtful, brief acknowledgment)
// 4. Sometimes ask a follow-up question
// 5. Sometimes suggest connecting further

// Return JSON: { "subject": "Re: ...", "body": "reply text" }`

//     try {
//       const { text } = await generateText({
//         model: "openai/gpt-4o-mini",
//         prompt,
//         temperature: 0.9,
//       })

//       const parsed = JSON.parse(text)

//       return {
//         subject: parsed.subject || `Re: ${originalSubject}`,
//         body: parsed.body || `Thanks for reaching out!`,
//       }
//     } catch (error) {
//       console.error("[WarmupEmailGenerator] Reply generation failed:", error)

//       // Fallback reply
//       return {
//         subject: `Re: ${originalSubject}`,
//         body: `Hi ${context.senderName},\n\nThanks for reaching out! I appreciate you thinking of me.\n\nBest,\n${context.recipientName}`,
//       }
//     }
//   }

//   /**
//    * Fallback template-based generation with enhanced variety
//    */
//   private generateFromTemplate(context: EmailContext): GeneratedEmail {
//     const templates = [
//       {
//         subject: `Quick question about ${context.industry || "your work"}`,
//         body: `Hi ${context.recipientName},\n\nI came across your profile and was impressed by your background. Would love to connect and learn more about what you're working on.\n\nBest regards,\n${context.senderName}`,
//         category: "introduction",
//       },
//       {
//         subject: `Thought this might interest you`,
//         body: `Hey ${context.recipientName},\n\nSaw something recently that reminded me of our conversation. Hope all is well on your end!\n\nCheers,\n${context.senderName}`,
//         category: "follow-up",
//       },
//       {
//         subject: `Touching base`,
//         body: `Hi ${context.recipientName},\n\nJust wanted to reach out and say hello. How have things been?\n\nTalk soon,\n${context.senderName}`,
//         category: "networking",
//       },
//       {
//         subject: `Quick update from my side`,
//         body: `Hey ${context.recipientName},\n\nWanted to share a quick update. Things have been progressing nicely here. Hope you're doing great!\n\nBest,\n${context.senderName}`,
//         category: "update",
//       },
//     ]

//     return templates[Math.floor(Math.random() * templates.length)]
//   }

//   /**
//    * Add custom warmup identifier to email body (for filtering)
//    */
//   addWarmupIdentifier(body: string, identifier = "warmup-network"): string {
//     // Add hidden identifier in HTML comment or footer
//     return `${body}\n\n<!-- ${identifier} -->`
//   }
// }

// export const warmupEmailGenerator = new WarmupEmailGenerator()

interface EmailContext {
  senderName: string
  recipientName: string
  industry?: string
  warmupStage: string
}

interface GeneratedEmail {
  subject: string
  body: string
  category: string
}

export class WarmupEmailGenerator {
  private templates = [
    {
      subject: "Quick question about {{industry}}",
      body: "Hi {{recipientName}},\n\nI came across your profile and was impressed by your work in {{industry}}. Would love to connect and exchange ideas sometime.\n\nBest regards,\n{{senderName}}",
      category: "introduction",
    },
    {
      subject: "Thought you might find this interesting",
      body: "Hey {{recipientName}},\n\nI recently came across something that reminded me of our last conversation. Hope you're doing well!\n\nCheers,\n{{senderName}}",
      category: "follow-up",
    },
    {
      subject: "Quick hello from {{senderName}}",
      body: "Hi {{recipientName}},\n\nJust wanted to reach out and say hello. How have things been on your end?\n\nTalk soon,\n{{senderName}}",
      category: "networking",
    },
    {
      subject: "Update from my side",
      body: "Hey {{recipientName}},\n\nWanted to share a quick update with you. Things have been progressing nicely here. Hope all is well with you!\n\nBest,\n{{senderName}}",
      category: "update",
    },
    {
      subject: "Coffee chat sometime?",
      body: "Hi {{recipientName}},\n\nI've been following your work and would love to grab a virtual coffee sometime if you're interested. Let me know what works for you!\n\nBest,\n{{senderName}}",
      category: "networking",
    },
    {
      subject: "Great seeing your recent work",
      body: "Hey {{recipientName}},\n\nI saw your recent post about {{industry}} and found it really insightful. Would love to hear more about your perspective on this.\n\nCheers,\n{{senderName}}",
      category: "engagement",
    },
    {
      subject: "Quick question for you",
      body: "Hi {{recipientName}},\n\nI have a quick question about something in {{industry}} and thought you'd be the perfect person to ask. Do you have a moment to chat?\n\nThanks,\n{{senderName}}",
      category: "inquiry",
    },
    {
      subject: "Following up on our discussion",
      body: "Hey {{recipientName}},\n\nJust wanted to follow up on what we discussed earlier. Let me know if you'd like to continue the conversation.\n\nBest regards,\n{{senderName}}",
      category: "follow-up",
    },
    {
      subject: "Checking in",
      body: "Hi {{recipientName}},\n\nHope this email finds you well! Just checking in to see how things are going.\n\nWarm regards,\n{{senderName}}",
      category: "check-in",
    },
    {
      subject: "Interesting article I thought of you",
      body: "Hey {{recipientName}},\n\nI came across an interesting article about {{industry}} and immediately thought of you. Would love to hear your thoughts on it!\n\nBest,\n{{senderName}}",
      category: "sharing",
    },
  ]

  private replyTemplates = [
    "Thanks for reaching out! I appreciate you thinking of me.",
    "Great to hear from you! I'd be happy to connect.",
    "Thanks for the message. This sounds interesting!",
    "Appreciate you getting in touch. Let's definitely stay connected.",
    "Thanks for sharing this with me. I'll take a look!",
    "Good to hear from you! Hope you're doing well too.",
    "Thanks for the update! Always good to stay in the loop.",
    "I'd love to chat more about this. When works for you?",
    "Thanks for reaching out. This is definitely something I'm interested in.",
    "Appreciate the email! Let's definitely catch up soon.",
  ]

  /**
   * Generate unique, contextual warmup email using templates
   */
  async generateWarmupEmail(
    senderName: string,
    recipientName: string,
    industry?: string,
    warmupStage?: string
  ): Promise<GeneratedEmail> {
    // Pick a random template
    const template = this.templates[Math.floor(Math.random() * this.templates.length)]

    // Fill in the template
    const subject = this.fillTemplate(template.subject, {
      senderName,
      recipientName,
      industry: industry || "your field",
    })

    const body = this.fillTemplate(template.body, {
      senderName,
      recipientName,
      industry: industry || "your field",
    })

    return {
      subject,
      body,
      category: template.category,
    }
  }

  /**
   * Generate reply to warmup email
   */
  async generateReply(
    originalSubject: string,
    originalBody: string,
    context: EmailContext
  ): Promise<{ subject: string; body: string }> {
    // Pick a random reply
    const replyBody =
      this.replyTemplates[Math.floor(Math.random() * this.replyTemplates.length)]

    return {
      subject: `Re: ${originalSubject}`,
      body: `Hi ${context.senderName},\n\n${replyBody}\n\nBest,\n${context.recipientName}`,
    }
  }

  /**
   * Fill template with context
   */
  private fillTemplate(
    template: string,
    context: Record<string, string>
  ): string {
    let result = template

    for (const [key, value] of Object.entries(context)) {
      const placeholder = `{{${key}}}`
      result = result.replace(new RegExp(placeholder, "g"), value)
    }

    return result
  }

  /**
   * Add custom warmup identifier to email body (for filtering)
   */
  addWarmupIdentifier(body: string, identifier = "warmup-network"): string {
    // Add hidden identifier in HTML comment or footer
    return `${body}\n\n<!-- ${identifier} -->`
  }
}

export const warmupEmailGenerator = new WarmupEmailGenerator()