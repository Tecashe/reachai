import { google } from "@ai-sdk/google"

// Centralized AI Provider Config
// Switch here to change providers (e.g. back to OpenAI)

// FAST MODEL (for simple tasks, classification, summaries)
// Previously: openai("gpt-4o-mini")
export const fastModel = google("gemini-2.0-flash")

// QUALITY MODEL (for complex writing, reasoning, agents)
// Previously: openai("gpt-4o")
export const qualityModel = google("gemini-2.0-flash")
// Note: We use flash for quality too in the free tier as it's very capable
// Once paid, we could switch 'qualityModel' to google("gemini-1.5-pro")

export const models = {
    fast: "gemini-2.0-flash", // Used for string-based APIs if needed
    quality: "gemini-2.0-flash"
}
