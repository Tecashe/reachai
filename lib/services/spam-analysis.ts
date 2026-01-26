/**
 * Spam Analysis Service
 * detailed analysis of email content for spam triggers and deliverability issues
 */

export interface SpamAnalysisResult {
    score: number // 0-100 (High is potentially spammy)
    riskLevel: "LOW" | "MEDIUM" | "HIGH"
    triggers: Array<{
        word: string
        category: string
        severity: number // 1-10
        index: number
    }>
    formattingIssues: Array<{
        issue: string
        description: string
        severity: number // 1-10
    }>
    suggestions: string[]
}

// Common spam trigger words with severity
const SPAM_TRIGGERS: Record<string, { category: string; severity: number }> = {
    // Urgency
    "act now": { category: "Urgency", severity: 7 },
    "urgent": { category: "Urgency", severity: 6 },
    "limited time": { category: "Urgency", severity: 5 },
    "immediate": { category: "Urgency", severity: 5 },

    // Money / Financial
    "free": { category: "Financial", severity: 4 },
    "cash": { category: "Financial", severity: 6 },
    "credit": { category: "Financial", severity: 5 },
    "lowest price": { category: "Financial", severity: 6 },
    "save big": { category: "Financial", severity: 7 },
    "earn extra cash": { category: "Financial", severity: 9 },
    "double your income": { category: "Financial", severity: 9 },
    "risk-free": { category: "Financial", severity: 8 },

    // Promotion
    "guarantee": { category: "Promotion", severity: 5 },
    "winner": { category: "Promotion", severity: 7 },
    "won": { category: "Promotion", severity: 7 },
    "prize": { category: "Promotion", severity: 6 },
    "exclusive deal": { category: "Promotion", severity: 6 },
    "click here": { category: "Promotion", severity: 7 },

    // Suspicious
    "no catch": { category: "Suspicious", severity: 8 },
    "this is not spam": { category: "Suspicious", severity: 10 },
    "cancel at any time": { category: "Suspicious", severity: 5 },
}

export function analyzeSpamScore(subject: string, body: string): SpamAnalysisResult {
    const text = `${subject} ${body}`.toLowerCase()
    const result: SpamAnalysisResult = {
        score: 0,
        riskLevel: "LOW",
        triggers: [],
        formattingIssues: [],
        suggestions: [],
    }

    // 1. Check for spam trigger words
    for (const [trigger, info] of Object.entries(SPAM_TRIGGERS)) {
        const index = text.indexOf(trigger)
        if (index !== -1) {
            result.triggers.push({
                word: trigger,
                category: info.category,
                severity: info.severity,
                index,
            })
            result.score += info.severity * 2
        }
    }

    // 2. Formatting Checks

    // ALL CAPS Check subject
    if (subject.length > 10 && subject === subject.toUpperCase()) {
        result.formattingIssues.push({
            issue: "ALL CAPS Subject",
            description: "Avoid using all capital letters in subject lines",
            severity: 8,
        })
        result.score += 15
    }

    // Excessive punctuation
    const exclamationCount = (text.match(/!/g) || []).length
    if (exclamationCount > 3) {
        result.formattingIssues.push({
            issue: "Excessive Exclamations",
            description: "Too many exclamation marks detected",
            severity: 5,
        })
        result.score += (exclamationCount - 3) * 2
    }

    // 3. Normalize Score
    result.score = Math.min(100, Math.max(0, result.score))

    // 4. Determine Risk Level
    if (result.score >= 70) result.riskLevel = "HIGH"
    else if (result.score >= 40) result.riskLevel = "MEDIUM"
    else result.riskLevel = "LOW"

    // 5. Generate Suggestions
    if (result.riskLevel === "HIGH") {
        result.suggestions.push("Rewrite content to sound more conversational and less promotional.")
    }
    if (result.formattingIssues.length > 0) {
        result.suggestions.push("Fix formatting issues to improve deliverability.")
    }
    if (result.triggers.length > 0) {
        result.suggestions.push(`Remove the ${result.triggers.length} detected spam trigger words.`)
    }

    return result
}
