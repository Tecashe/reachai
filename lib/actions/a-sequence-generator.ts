"use server"

import { generateObject } from "ai"
import { z } from "zod"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { type StepType, type DelayUnit, SequenceStatus } from "@prisma/client"

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

// Schema for AI-generated sequence
const GeneratedSequenceSchema = z.object({
  name: z.string().describe("A compelling name for this sequence"),
  description: z.string().describe("Brief description of the sequence strategy"),
  steps: z
    .array(
      z.object({
        stepType: z.enum(["EMAIL", "DELAY", "LINKEDIN_CONNECT", "LINKEDIN_MESSAGE", "LINKEDIN_VIEW", "CALL", "TASK"]),
        order: z.number(),
        // Timing
        delayValue: z.number().describe("Delay before this step (use 0 for first step)"),
        delayUnit: z.enum(["MINUTES", "HOURS", "DAYS", "WEEKS"]),
        // Email content
        subject: z
          .string()
          .nullable()
          .describe("Email subject line with personalization tokens like {{firstName}}, {{company}}"),
        body: z
          .string()
          .nullable()
          .describe("Email body in plain text with personalization tokens. Use line breaks for paragraphs."),
        // LinkedIn content
        linkedInMessage: z.string().nullable().optional(),
        // Call content
        callScript: z.string().nullable().optional(),
        // Task content
        taskTitle: z.string().nullable().optional(),
        taskDescription: z.string().nullable().optional(),
        // Internal notes
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

type GeneratedSequence = z.infer<typeof GeneratedSequenceSchema>

// Generation progress tracking
export type GenerationProgress = {
  stage: "analyzing" | "generating" | "optimizing" | "creating" | "complete" | "error"
  message: string
  progress: number
  sequenceId?: string
  error?: string
}

export async function generateAISequence(
  userId: string,
  icp: ICPInput,
): Promise<{ success: boolean; sequenceId?: string; error?: string }> {
  try {
    // Build comprehensive prompt
    const prompt = buildSequencePrompt(icp)

    // Generate sequence using AI
    const { object: generatedSequence } = await generateObject({
      model: "anthropic/claude-sonnet-4-20250514",
      schema: GeneratedSequenceSchema,
      prompt,
      maxOutputTokens: 8000,
      temperature: 0.7,
    })

    const icpSummary = `Target: ${icp.targetRoles.join(", ")} in ${icp.targetIndustry} | Product: ${icp.productService}`
    const fullDescription = generatedSequence.description + `\n\n[AI Generated] ${icpSummary}`

    // Create sequence in database
    const sequence = await db.sequence.create({
      data: {
        userId,
        name: generatedSequence.name,
        description: fullDescription,
        status: SequenceStatus.DRAFT,
        enableLinkedIn: icp.includeLinkedIn,
        enableCalls: icp.includeCalls,
        enableTasks: icp.includeTasks,
        aiPersonalization: true,
        toneOfVoice: icp.tone.toUpperCase(),
      },
    })

    // Create all steps
    for (const step of generatedSequence.steps) {
      await db.sequenceStep.create({
        data: {
          sequenceId: sequence.id,
          order: step.order,
          stepType: step.stepType as StepType,
          delayValue: step.delayValue,
          delayUnit: step.delayUnit as DelayUnit,
          subject: step.subject,
          body: step.body,
          linkedInMessage: step.linkedInMessage,
          callScript: step.callScript,
          taskTitle: step.taskTitle,
          taskDescription: step.taskDescription,
          internalNotes: step.internalNotes,
          skipIfReplied: true,
          skipIfBounced: true,
        },
      })
    }

    // Update sequence step count
    await db.sequence.update({
      where: { id: sequence.id },
      data: { totalSteps: generatedSequence.steps.length },
    })

    revalidatePath("/dashboard/sequences")

    return { success: true, sequenceId: sequence.id }
  } catch (error) {
    console.error("AI Sequence Generation Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate sequence",
    }
  }
}

function buildSequencePrompt(icp: ICPInput): string {
  const rolesList = icp.targetRoles.join(", ")
  const painPointsList = icp.painPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")

  const companySizeMap = {
    startup: "early-stage startups (1-50 employees)",
    smb: "small businesses (50-200 employees)",
    mid_market: "mid-market companies (200-1000 employees)",
    enterprise: "enterprise organizations (1000+ employees)",
    any: "companies of all sizes",
  }

  const toneDescriptions = {
    professional: "formal and business-focused, using industry terminology",
    casual: "relaxed and conversational, like talking to a colleague",
    friendly: "warm and approachable, building rapport first",
    authoritative: "confident and expert-driven, establishing thought leadership",
    consultative: "helpful and advisory, focusing on solving problems",
  }

  let channelInstructions = ""
  if (icp.includeLinkedIn) {
    channelInstructions += `
- Include LinkedIn steps strategically:
  - LINKEDIN_VIEW: Use early to warm up the prospect (shows you looked at their profile)
  - LINKEDIN_CONNECT: Send after initial email to create multi-channel touchpoint
  - LINKEDIN_MESSAGE: Use for follow-up after connection accepted`
  }
  if (icp.includeCalls) {
    channelInstructions += `
- Include CALL steps with detailed scripts for phone outreach
  - Best placed mid-sequence after email engagement
  - Include talking points and objection handling`
  }
  if (icp.includeTasks) {
    channelInstructions += `
- Include TASK steps for manual actions like:
  - Researching recent company news
  - Finding mutual connections
  - Preparing personalized demos`
  }

  return `You are an expert B2B sales copywriter and sequence strategist. Generate a complete ${icp.sequenceLength}-step email sequence for cold outreach.

## TARGET AUDIENCE (ICP)
- **Industry**: ${icp.targetIndustry}
- **Company Size**: ${companySizeMap[icp.companySize]}
- **Target Roles**: ${rolesList}
- **Product/Service**: ${icp.productService}
${icp.companyName ? `- **Your Company**: ${icp.companyName}` : ""}

## PAIN POINTS TO ADDRESS
${painPointsList}

## VALUE PROPOSITION
${icp.valueProposition}

${icp.socialProofMetric ? `## SOCIAL PROOF\n${icp.socialProofMetric}` : ""}
${icp.caseStudyIndustry ? `## CASE STUDY INDUSTRY\n${icp.caseStudyIndustry}` : ""}
${icp.competitorDifferentiator ? `## COMPETITIVE ADVANTAGE\n${icp.competitorDifferentiator}` : ""}

## TONE & STYLE
Write in a ${toneDescriptions[icp.tone]} tone.

## SEQUENCE STRUCTURE REQUIREMENTS
1. **Step 1 (Email)**: Opening email - Hook with a pain point, introduce value, soft CTA
   - Delay: 0 days (immediate)
   - Subject: Curiosity-driven, personalized
   - Keep under 100 words

2. **Step 2 (Email or LinkedIn)**: Value-add follow-up
   - Delay: 2-3 days
   - Reference first email briefly
   - Share insight, stat, or mini case study
   
3. **Middle Steps**: Vary approaches:
   - Social proof email (case study, testimonial)
   - Problem-agitation email (dig deeper into pain)
   - Resource/value email (share helpful content)
   - Quick bump email (short, casual check-in)
   
4. **Final Step (Email)**: Breakup email
   - Delay: 5-7 days from previous
   - Create urgency through scarcity
   - Leave door open
   - Clear final CTA

${channelInstructions}

## EMAIL COPY GUIDELINES
- Use these personalization tokens: {{firstName}}, {{company}}, {{jobTitle}}
- First line should NEVER be about you - focus on them
- Each email should have ONE clear call-to-action
- Vary email lengths: short (50 words), medium (100 words), long (150 words)
- Use line breaks between paragraphs for readability
- Subject lines: 4-7 words, no spam words, create curiosity
- Never use "I hope this email finds you well" or similar clichés
- Don't start with "I" - start with "You", a question, or an observation
- Include specific numbers/stats when possible
- End with a question or clear next step

## DELAY TIMING BEST PRACTICES
- First follow-up: 2-3 days
- Subsequent emails: 3-4 days apart
- Before breakup: 5-7 days gap
- Use HOURS only for same-day LinkedIn activities

## OUTPUT REQUIREMENTS
Generate a complete sequence with:
1. A compelling sequence name
2. A brief strategy description
3. ${icp.sequenceLength} steps with proper delays, content, and internal strategy notes
4. Subject line A/B variants for email steps

Make each email distinct - don't repeat the same approach. Each step should provide new value or angle.`
}

// Streaming version for real-time progress (optional enhancement)
export async function* generateAISequenceStream(userId: string, icp: ICPInput): AsyncGenerator<GenerationProgress> {
  yield {
    stage: "analyzing",
    message: "Analyzing your ICP and target audience...",
    progress: 10,
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  yield {
    stage: "generating",
    message: "Crafting personalized email copy...",
    progress: 30,
  }

  try {
    const prompt = buildSequencePrompt(icp)

    yield {
      stage: "generating",
      message: "AI is writing your sequence...",
      progress: 50,
    }

    const { object: generatedSequence } = await generateObject({
      model: "anthropic/claude-sonnet-4-20250514",
      schema: GeneratedSequenceSchema,
      prompt,
      maxOutputTokens: 8000,
      temperature: 0.7,
    })

    yield {
      stage: "optimizing",
      message: "Optimizing timing and flow...",
      progress: 70,
    }

    await new Promise((resolve) => setTimeout(resolve, 300))

    yield {
      stage: "creating",
      message: "Saving sequence to database...",
      progress: 85,
    }

    const icpSummary = `Target: ${icp.targetRoles.join(", ")} in ${icp.targetIndustry} | Product: ${icp.productService}`
    const fullDescription = generatedSequence.description + `\n\n[AI Generated] ${icpSummary}`

    // Create sequence
    const sequence = await db.sequence.create({
      data: {
        userId,
        name: generatedSequence.name,
        description: fullDescription,
        status: SequenceStatus.DRAFT,
        enableLinkedIn: icp.includeLinkedIn,
        enableCalls: icp.includeCalls,
        enableTasks: icp.includeTasks,
        aiPersonalization: true,
        toneOfVoice: icp.tone,
      },
    })

    // Create steps
    for (const step of generatedSequence.steps) {
      await db.sequenceStep.create({
        data: {
          sequenceId: sequence.id,
          order: step.order,
          stepType: step.stepType as StepType,
          delayValue: step.delayValue,
          delayUnit: step.delayUnit as DelayUnit,
          subject: step.subject,
          body: step.body,
          linkedInMessage: step.linkedInMessage,
          callScript: step.callScript,
          taskTitle: step.taskTitle,
          taskDescription: step.taskDescription,
          internalNotes: step.internalNotes,
          skipIfReplied: true,
          skipIfBounced: true,
        },
      })
    }

    await db.sequence.update({
      where: { id: sequence.id },
      data: { totalSteps: generatedSequence.steps.length },
    })

    revalidatePath("/dashboard/sequences")

    yield {
      stage: "complete",
      message: "Sequence created successfully!",
      progress: 100,
      sequenceId: sequence.id,
    }
  } catch (error) {
    yield {
      stage: "error",
      message: "Failed to generate sequence",
      progress: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
