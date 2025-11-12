import { db } from "@/lib/db"

interface AttachmentData {
  filename: string
  contentType: string
  size: number
  storageUrl?: string
  content?: Buffer
}

class AttachmentManager {
  /**
   * Extract and store attachments from an email reply
   */
  async processEmailAttachments(emailReplyId: string, attachments: AttachmentData[]): Promise<void> {
    if (!attachments || attachments.length === 0) return

    for (const attachment of attachments) {
      // Store attachment using EmailAttachment model
      await db.emailAttachment.create({
        data: {
          emailReplyId,
          filename: attachment.filename,
          contentType: attachment.contentType,
          size: attachment.size,
          storageUrl: attachment.storageUrl || null,
          isContract: this.isContractFile(attachment.filename),
          isProposal: this.isProposalFile(attachment.filename),
          analyzed: true,
          analyzedAt: new Date(),
        },
      })
    }
  }

  /**
   * Get attachments for an email reply
   */
  async getReplyAttachments(emailReplyId: string) {
    return db.emailAttachment.findMany({
      where: { emailReplyId },
      orderBy: { createdAt: "asc" },
    })
  }

  /**
   * Analyze attachment content (detect contracts, proposals, etc.)
   */
  async analyzeAttachment(attachmentId: string): Promise<{
    isContract: boolean
    isProposal: boolean
    requiresReview: boolean
  }> {
    const attachment = await db.emailAttachment.findUnique({
      where: { id: attachmentId },
    })

    if (!attachment) {
      return { isContract: false, isProposal: false, requiresReview: false }
    }

    const isContract = this.isContractFile(attachment.filename)
    const isProposal = this.isProposalFile(attachment.filename)
    const requiresReview = isContract || isProposal

    // Update attachment with analysis results
    await db.emailAttachment.update({
      where: { id: attachmentId },
      data: {
        isContract,
        isProposal,
        analyzed: true,
        analyzedAt: new Date(),
      },
    })

    return { isContract, isProposal, requiresReview }
  }

  private isContractFile(filename: string): boolean {
    const contractKeywords = ["contract", "agreement", "terms", "nda"]
    return contractKeywords.some((kw) => filename.toLowerCase().includes(kw))
  }

  private isProposalFile(filename: string): boolean {
    const proposalKeywords = ["proposal", "quote", "rfp", "bid"]
    return proposalKeywords.some((kw) => filename.toLowerCase().includes(kw))
  }

  /**
   * Delete old attachments to save storage
   */
  async cleanupOldAttachments(daysOld = 90): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await db.emailAttachment.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    })

    return result.count
  }

  /**
   * Get file icon based on content type
   */
  getFileIcon(contentType: string): string {
    if (contentType.startsWith("image/")) return "📷"
    if (contentType.startsWith("video/")) return "🎬"
    if (contentType.includes("pdf")) return "📄"
    if (contentType.includes("word") || contentType.includes("document")) return "📝"
    if (contentType.includes("excel") || contentType.includes("spreadsheet")) return "📊"
    if (contentType.includes("powerpoint") || contentType.includes("presentation")) return "📊"
    if (contentType.includes("zip") || contentType.includes("archive")) return "🗜️"
    return "📎"
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }
}

export const attachmentManager = new AttachmentManager()
