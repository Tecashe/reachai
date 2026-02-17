"use server"

import { generateObject } from "ai"
import { z } from "zod"
import { fastModel } from "@/lib/ai-provider"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function generateSpintax(
    content: string,
    tone: string = "professional"
): Promise<{ success: boolean; content?: string; error?: string }> {
    const { userId } = await auth()
    if (!userId) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        const user = await db.user.findUnique({ where: { clerkId: userId } })
        if (!user) {
            return { success: false, error: "User not found" }
        }

        // Feature Gate: Spintax is a PRO feature
        if (user.subscriptionTier === "FREE") {
            return {
                success: false,
                error: "AI Spintax is a PRO feature. Please upgrade your plan."
            }
        }

        if (!content || content.trim().length < 10) {
            return { success: false, error: "Content too short to generate spintax" }
        }

        const prompt = `Rewrite the following text adding Spintax variations {option1|option2|option3} for greetings, openers, and common phrases to increase variability.
Keep the original meaning.

TEXT: "${content}"

OUTPUT: Just the rewriting text with Spintax.`

        const { object } = await generateObject({
            model: fastModel,
            prompt,
            schema: z.object({
                spintaxText: z.string(),
            }),
            system: `You are an expert cold email copywriter specializing in Spintax (Spin Syntax). 
      Your goal is to rewrite the provided email content by injecting Spintax variations to ensure high deliverability and avoid spam filters.
      
      Rules for Spintax:
      1. Use the format {variant1|variant2|variant3}
      2. Keep the original meaning and tone (${tone})
      3. Create variations for greetings, sign-offs, verbs, and adjectives
      4. Ensure all variations are grammatically correct when spun
      5. Do NOT change personalization variables like {{firstName}}
      6. IMPORTANT: The input may be HTML. PRESERVE ALL HTML TAGS exactly as they are. Do not strip <br>, <p>, <span>, etc. Only spin the text content inside tags.`,
            temperature: 0.7,
        })

        // Track usage (optional: increment usage stats)
        await db.user.update({
            where: { id: user.id },
            data: {
                aiCreditsUsed: { increment: 1 }
            }
        })

        return { success: true, content: object.spintaxText }

    } catch (error) {
        console.error("Spintax Generation Error:", error)
        return {
            success: false,
            error: "Failed to generate spintax. Please try again.",
        }
    }
}
