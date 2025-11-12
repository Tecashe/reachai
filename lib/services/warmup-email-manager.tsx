import { db as prisma } from "@/lib/db"
import nodemailer from "nodemailer"
import { ImapFlow } from "imapflow"
import crypto from "crypto"

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex")
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || crypto.randomBytes(16).toString("hex")

// Encrypt sensitive data
function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
    Buffer.from(ENCRYPTION_IV.slice(0, 16)),
  )
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

// Decrypt sensitive data
function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY.slice(0, 32)),
    Buffer.from(ENCRYPTION_IV.slice(0, 16)),
  )
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

// Human-like email subjects and bodies
const WARMUP_TEMPLATES = [
  {
    subject: "Quick question about your work",
    body: "Hi {name},\n\nI came across your profile and was impressed by your background. I'd love to connect and learn more about what you're working on.\n\nBest regards,\n{sender}",
  },
  {
    subject: "Following up on our previous conversation",
    body: "Hi {name},\n\nHope you've been doing well! I wanted to check in and see if you had any thoughts on what we discussed.\n\nLooking forward to hearing from you.\n\n{sender}",
  },
  {
    subject: "Thought you might find this interesting",
    body: "Hey {name},\n\nI came across something that reminded me of our conversation and thought you might appreciate it.\n\nLet me know what you think!\n\n{sender}",
  },
  {
    subject: "Touching base",
    body: "Hi {name},\n\nJust wanted to reach out and say hello. How have things been on your end?\n\nTalk soon,\n{sender}",
  },
  {
    subject: "Quick update from my side",
    body: "Hey {name},\n\nWanted to share a quick update with you. Things have been progressing nicely here.\n\nHope all is well with you!\n\n{sender}",
  },
]

// Generate human-like reply
function generateReply(originalSubject: string, senderName: string): { subject: string; body: string } {
  const replies = [
    {
      subject: `Re: ${originalSubject}`,
      body: `Thanks for reaching out, ${senderName}! I appreciate you thinking of me. Things have been busy but going well. Let's definitely catch up soon.\n\nBest,`,
    },
    {
      subject: `Re: ${originalSubject}`,
      body: `Hey ${senderName}!\n\nGreat to hear from you. I've been meaning to reconnect. Would love to chat more about this.\n\nCheers,`,
    },
    {
      subject: `Re: ${originalSubject}`,
      body: `Hi ${senderName},\n\nThanks for the message! I'm definitely interested. When would be a good time to discuss further?\n\nLooking forward to it,`,
    },
  ]

  return replies[Math.floor(Math.random() * replies.length)]
}

// Determine warmup type based on stage
function getWarmupType(stage: string): "POOL" | "PEER" {
  return ["NEW", "WARMING"].includes(stage) ? "POOL" : "PEER"
}

// Send warmup email
export async function sendWarmupEmail(
  sessionId: string,
  sendingAccount: any,
  warmupEmail?: any,
  peerAccountEmail?: string,
): Promise<boolean> {
  try {
    const credentials = sendingAccount.credentials as any
    const template = WARMUP_TEMPLATES[Math.floor(Math.random() * WARMUP_TEMPLATES.length)]

    const recipientName = warmupEmail?.name || peerAccountEmail?.split("@")[0] || "there"
    const senderName = sendingAccount.name || sendingAccount.email.split("@")[0]

    const subject = template.subject
    const body = template.body.replace("{name}", recipientName).replace("{sender}", senderName)

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: credentials.smtpHost || credentials.host || "smtp.gmail.com",
      port: credentials.smtpPort || credentials.port || 587,
      secure: (credentials.smtpPort || credentials.port) === 465,
      auth: {
        user: credentials.smtpUsername || credentials.username || sendingAccount.email,
        pass: credentials.smtpPassword || credentials.password || credentials.apiKey,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: `${senderName} <${sendingAccount.email}>`,
      to: warmupEmail?.email || peerAccountEmail,
      subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
    })

    console.log("[v0] Warmup email sent:", info.messageId)

    // Record interaction
    await prisma.warmupInteraction.create({
      data: {
        sessionId,
        sendingAccountId: sendingAccount.id,
        warmupEmailId: warmupEmail?.id || null,
        direction: "OUTBOUND",
        subject,
        snippet: body.slice(0, 100),
        sentAt: new Date(),
        deliveredAt: new Date(),
        messageId: info.messageId,
        landedInInbox: true,
        landedInSpam: false,
      },
    })

    // Update session stats
    await prisma.warmupSession.update({
      where: { id: sessionId },
      data: {
        emailsSent: { increment: 1 },
        lastSentAt: new Date(),
      },
    })

    if (warmupEmail && Math.random() > 0.5) {
      await prisma.warmupInteraction.create({
        data: {
          sessionId,
          sendingAccountId: sendingAccount.id,
          warmupEmailId: warmupEmail.id,
          direction: "INBOUND",
          subject: `Re: ${subject}`,
          snippet: "Scheduled reply",
          sentAt: new Date(Date.now() + Math.random() * 3600000 + 1800000), // 30-90 mins
          landedInInbox: true,
          landedInSpam: false,
          isPending: true,
        },
      })
    }

    return true
  } catch (error) {
    console.error("[v0] Error sending warmup email:", error)
    return false
  }
}

export async function processScheduledReplies(): Promise<void> {
  const pendingReplies = await prisma.warmupInteraction.findMany({
    where: {
      direction: "INBOUND",
      isPending: true,
      sentAt: { lte: new Date() },
    },
    include: {
      session: {
        include: {
          sendingAccount: true,
          warmupEmail: true,
        },
      },
    },
  })

  for (const reply of pendingReplies) {
    if (!reply.session.warmupEmail) continue

    try {
      const warmupEmail = reply.session.warmupEmail
      const sendingAccount = reply.session.sendingAccount
      const senderName = sendingAccount.name || sendingAccount.email.split("@")[0]
      const replyContent = generateReply(reply.subject.replace("Re: ", ""), senderName)

      const warmupEmailPassword = decrypt(warmupEmail.imapPassword)

      const transporter = nodemailer.createTransport({
        host: warmupEmail.smtpHost || "smtp.gmail.com",
        port: warmupEmail.smtpPort || 587,
        secure: warmupEmail.smtpPort === 465,
        auth: {
          user: warmupEmail.smtpUsername || warmupEmail.email,
          pass: warmupEmail.smtpPassword ? decrypt(warmupEmail.smtpPassword) : warmupEmailPassword,
        },
      })

      await transporter.sendMail({
        from: `${warmupEmail.name} <${warmupEmail.email}>`,
        to: sendingAccount.email,
        subject: replyContent.subject,
        text: replyContent.body + "\n" + warmupEmail.name,
        html: (replyContent.body + "<br>" + warmupEmail.name).replace(/\n/g, "<br>"),
      })

      // Mark as processed
      await prisma.warmupInteraction.update({
        where: { id: reply.id },
        data: {
          isPending: false,
          deliveredAt: new Date(),
        },
      })

      // Update session stats
      await prisma.warmupSession.update({
        where: { id: reply.sessionId },
        data: {
          emailsReplied: { increment: 1 },
        },
      })
    } catch (error) {
      console.error("[v0] Error processing scheduled reply:", error)
    }
  }
}

// Check inbox placement for a warmup email
export async function checkInboxPlacement(warmupEmail: any): Promise<{ inbox: number; spam: number }> {
  try {
    const client = new ImapFlow({
      host: warmupEmail.imapHost,
      port: warmupEmail.imapPort,
      secure: warmupEmail.imapPort === 993,
      auth: {
        user: warmupEmail.imapUsername || warmupEmail.email,
        pass: decrypt(warmupEmail.imapPassword),
      },
    })

    await client.connect()

    // Check Inbox
    let lock = await client.getMailboxLock("INBOX")
    const inboxStatus = await client.status("INBOX", { messages: true })
    const inboxCount = inboxStatus.messages || 0
    lock.release()

    // Check Spam/Junk
    let spamCount = 0
    try {
      lock = await client.getMailboxLock("[Gmail]/Spam")
      const spamStatus = await client.status("[Gmail]/Spam", { messages: true })
      spamCount = spamStatus.messages || 0
      lock.release()
    } catch {
      // Spam folder might not exist or have different name
    }

    await client.logout()

    return { inbox: inboxCount, spam: spamCount }
  } catch (error) {
    console.error("[v0] Error checking inbox placement:", error)
    return { inbox: 0, spam: 0 }
  }
}

// Get active peer accounts for warmup
export async function getActivePeerAccounts(userId: string, limit = 10): Promise<string[]> {
  const peerAccounts = await prisma.sendingAccount.findMany({
    where: {
      userId: { not: userId },
      peerWarmupOptIn: true,
      peerWarmupEnabled: true,
      isActive: true,
      healthScore: { gte: 80 },
    },
    select: { email: true },
    take: limit,
  })

  return peerAccounts.map((acc) => acc.email)
}

// Process warmup for a sending account
export async function processAccountWarmup(sendingAccountId: string): Promise<void> {
  const sendingAccount = await prisma.sendingAccount.findUnique({
    where: { id: sendingAccountId },
    include: { user: true },
  })

  if (!sendingAccount || !sendingAccount.warmupEnabled) return

  const warmupType = getWarmupType(sendingAccount.warmupStage)
  const dailyLimit = sendingAccount.warmupDailyLimit

  console.log(`[v0] Processing ${warmupType} warmup for ${sendingAccount.email}`)

  if (warmupType === "POOL") {
    // Use 30-email pool for early stages
    const warmupEmails = await prisma.warmupEmail.findMany({
      where: { isActive: true },
      orderBy: { lastUsedFor: "asc" }, // Rotate through pool
      take: Math.min(dailyLimit, 5), // Send to 5 different emails per day
    })

    for (const warmupEmail of warmupEmails) {
      // Create or get session
      let session = await prisma.warmupSession.findFirst({
        where: {
          sendingAccountId,
          warmupEmailId: warmupEmail.id,
          status: "ACTIVE",
          warmupType: "POOL",
        },
        include: {
          warmupEmail: true,
        },
      })

      if (!session) {
        session = await prisma.warmupSession.create({
          data: {
            sendingAccountId,
            warmupEmailId: warmupEmail.id,
            warmupType: "POOL",
            dailyLimit,
          },
          include: {
            warmupEmail: true,
          },
        })
      }

      if (session.warmupEmail) {
        // Send warmup email
        await sendWarmupEmail(session.id, sendingAccount, session.warmupEmail)

        // Update last used
        await prisma.warmupEmail.update({
          where: { id: warmupEmail.id },
          data: { lastUsedFor: sendingAccount.email, lastEmailSentAt: new Date() },
        })
      }

      // Random delay between emails (5-15 minutes)
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 600000 + 300000))
    }
  } else {
    // Use peer network for later stages
    const peerEmails = await getActivePeerAccounts(sendingAccount.userId, Math.min(dailyLimit, 10))

    for (const peerEmail of peerEmails) {
      // Create or get session
      let session = await prisma.warmupSession.findFirst({
        where: {
          sendingAccountId,
          peerAccountEmail: peerEmail,
          status: "ACTIVE",
          warmupType: "PEER",
        },
        include: {
          warmupEmail: true,
        },
      })

      if (!session) {
        session = await prisma.warmupSession.create({
          data: {
            sendingAccountId,
            peerAccountEmail: peerEmail,
            warmupType: "PEER",
            dailyLimit,
          },
          include: {
            warmupEmail: true,
          },
        })
      }

      // Send warmup email to peer
      await sendWarmupEmail(session.id, sendingAccount, undefined, peerEmail)

      // Random delay between emails
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 600000 + 300000))
    }
  }
}

// Warmup email manager export object
export const warmupEmailManager = {
  sendWarmupEmail,
  checkInboxPlacement,
  getActivePeerAccounts,
  processAccountWarmup,
  processScheduledReplies,

  async getWarmupPoolStats() {
    const totalEmails = await prisma.warmupEmail.count()
    const activeEmails = await prisma.warmupEmail.count({ where: { isActive: true } })

    const totalInteractions = await prisma.warmupInteraction.count()
    const inboxInteractions = await prisma.warmupInteraction.count({
      where: { landedInInbox: true },
    })

    const emails = await prisma.warmupEmail.findMany({
      select: { inboxPlacement: true },
    })

    const avgInboxPlacement =
      emails.length > 0 ? emails.reduce((sum, e) => sum + e.inboxPlacement, 0) / emails.length : 0

    const peerNetworkSize = await prisma.sendingAccount.count({
      where: {
        peerWarmupOptIn: true,
        peerWarmupEnabled: true,
        isActive: true,
        healthScore: { gte: 80 },
      },
    })

    const accountsInPoolStage = await prisma.sendingAccount.count({
      where: {
        warmupEnabled: true,
        warmupStage: { in: ["NEW", "WARMING"] },
      },
    })

    const accountsInPeerStage = await prisma.sendingAccount.count({
      where: {
        warmupEnabled: true,
        warmupStage: { in: ["WARM", "ACTIVE", "ESTABLISHED"] },
      },
    })

    return {
      poolSize: totalEmails,
      poolActive: activeEmails,
      peerNetworkSize,
      activeAccounts: accountsInPoolStage + accountsInPeerStage,
      accountsInPoolStage,
      accountsInPeerStage,
      totalEmailsSent: totalInteractions,
      totalRepliesReceived: await prisma.warmupInteraction.count({
        where: { direction: "INBOUND" },
      }),
      avgInboxPlacement,
      inboxRate: totalInteractions > 0 ? (inboxInteractions / totalInteractions) * 100 : 100,
      replyRate: 0,
      totalInteractions,
    }
  },

  async addWarmupEmail(data: any) {
    try {
      const warmupEmail = await prisma.warmupEmail.create({
        data: {
          email: data.email,
          name: data.name,
          provider: data.provider,
          imapHost: data.imapHost,
          imapPort: data.imapPort,
          imapUsername: data.imapUsername || data.email,
          imapPassword: encrypt(data.imapPassword),
          smtpHost: data.smtpHost,
          smtpPort: data.smtpPort,
          smtpUsername: data.smtpUsername || data.email,
          smtpPassword: data.smtpPassword ? encrypt(data.smtpPassword) : null,
        },
      })

      return { success: true, warmupEmailId: warmupEmail.id }
    } catch (error) {
      console.error("[v0] Error adding warmup email:", error)
      return { success: false, error: "Failed to add warmup email" }
    }
  },
}
