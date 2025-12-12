import { z } from "zod"

// Schema for ICP input
export const ICPSchema = z.object({
  // Target Audience
  targetIndustry: z.string().min(1, "Industry is required"),
  companySize: z.enum(["startup", "smb", "mid_market", "enterprise", "any"]),
  targetRoles: z.array(z.string()).min(1, "At least one role is required"),

  // Pain Points & Value
  painPoints: z.array(z.string()).min(1, "At least one pain point is required"),
  valueProposition: z.string().min(10, "Value proposition is required"),
  productService: z.string().min(1, "Product/service name is required"),

  // Tone & Style
  tone: z.enum(["professional", "casual", "friendly", "authoritative", "consultative"]),

  // Sequence Configuration
  sequenceLength: z.number().min(3).max(10).default(5),
  includeLinkedIn: z.boolean().default(false),
  includeCalls: z.boolean().default(false),
  includeTasks: z.boolean().default(false),

  // Optional extras
  companyName: z.string().optional(),
  caseStudyIndustry: z.string().optional(),
  socialProofMetric: z.string().optional(),
  competitorDifferentiator: z.string().optional(),
})

export type ICPInput = z.infer<typeof ICPSchema>

// Generation progress tracking
export type GenerationProgress = {
  stage: "analyzing" | "generating" | "optimizing" | "creating" | "complete" | "error"
  message: string
  progress: number
  sequenceId?: string
  error?: string
}

// Schema for AI-generated sequence (internal use)
export const GeneratedSequenceSchema = z.object({
  name: z.string().describe("A compelling name for this sequence"),
  description: z.string().describe("Brief description of the sequence strategy"),
  steps: z
    .array(
      z.object({
        stepType: z.enum(["EMAIL", "DELAY", "LINKEDIN_CONNECT", "LINKEDIN_MESSAGE", "LINKEDIN_VIEW", "CALL", "TASK"]),
        order: z.number(),
        delayValue: z.number().describe("Delay before this step (use 0 for first step)"),
        delayUnit: z.enum(["MINUTES", "HOURS", "DAYS", "WEEKS"]),
        subject: z
          .string()
          .nullable()
          .describe("Email subject line with personalization tokens like {{firstName}}, {{company}}"),
        body: z
          .string()
          .nullable()
          .describe("Email body in plain text with personalization tokens. Use line breaks for paragraphs."),
        linkedInMessage: z.string().nullable().optional(),
        callScript: z.string().nullable().optional(),
        taskTitle: z.string().nullable().optional(),
        taskDescription: z.string().nullable().optional(),
        internalNotes: z.string().nullable().describe("Strategy notes for why this step exists"),
      }),
    )
    .min(3)
    .max(10),
  suggestedSubjectLineVariants: z
    .array(
      z.object({
        stepOrder: z.number(),
        variants: z.array(z.string()).describe("3 A/B test subject line variants"),
      }),
    )
    .optional(),
})

export type GeneratedSequence = z.infer<typeof GeneratedSequenceSchema>
