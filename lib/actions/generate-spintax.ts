"use server"

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

// Initialize OpenAI client
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSpintax(
    content: string,
    tone: string = "professional"
): Promise<{ success: boolean; content?: string; error?: string }> {
    try {
        if (!content || content.trim().length < 10) {
            return { success: false, error: "Content too short to generate spintax" }
        }

        const { text } = await generateText({
            model: openai("gpt-4o"),
            system: `You are an expert cold email copywriter specializing in Spintax (Spin Syntax). 
      Your goal is to rewrite the provided email content by injecting Spintax variations to ensure high deliverability and avoid spam filters.
      
      Rules for Spintax:
      1. Use the format {variant1|variant2|variant3}
      2. Keep the original meaning and tone (${tone})
      3. Create variations for greetings, sign-offs, verbs, and adjectives
      4. Ensure all variations are grammatically correct when spun
      5. Do NOT change personalization variables like {{firstName}}
      6. IMPORTANT: The input may be HTML. PRESERVE ALL HTML TAGS exactly as they are. Do not strip <br>, <p>, <span>, etc. Only spin the text content inside tags.
      7. Return ONLY the spintaxed content, no explanations`,
            prompt: `Rewrite this content with rich Spintax variations:\n\n${content}`,
            temperature: 0.7,
        })

        return { success: true, content: text }
    } catch (error) {
        console.error("Spintax Generation Error:", error)
        return {
            success: false,
            error: "Failed to generate spintax. Please try again.",
        }
    }
}
