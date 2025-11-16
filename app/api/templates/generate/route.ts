// import { NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { generateText } from "ai"
// import { db } from "@/lib/db"

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const body = await req.json()
//     const { 
//       prompt, 
//       industry, 
//       purpose, 
//       tone = "professional",
//       targetLength = "medium",
//       includePersonalization = true 
//     } = body

//     if (!prompt) {
//       return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
//     }

//     // Build AI prompt with context
//     const systemPrompt = `You are an expert email copywriter specializing in ${industry || 'business'} communication.
// Your task is to generate high-converting email templates that are:
// - ${tone} in tone
// - ${targetLength === 'short' ? 'Concise (under 150 words)' : targetLength === 'long' ? 'Detailed (250+ words)' : 'Balanced (150-250 words)'}
// - Purpose: ${purpose || 'general outreach'}
// - Include personalization variables in {{variableName}} format ${includePersonalization ? '(use at least 3-5 variables like firstName, companyName, etc.)' : ''}

// Generate a complete email template with:
// 1. A compelling subject line
// 2. Email body with clear structure
// 3. Call-to-action
// 4. Professional sign-off

// Respond ONLY with valid JSON in this exact format:
// {
//   "name": "Template Name",
//   "subject": "Subject line with {{variables}}",
//   "body": "Email body with {{variables}}",
//   "variables": ["firstName", "companyName"],
//   "suggestions": ["tip1", "tip2", "tip3"]
// }`

//     const userPrompt = `Create an email template: ${prompt}

// Additional context:
// - Industry: ${industry || 'general'}
// - Purpose: ${purpose || 'general outreach'}
// - Tone: ${tone}
// - Target length: ${targetLength}

// Remember to:
// 1. Use {{variableName}} format for personalization
// 2. Keep it natural and conversational
// 3. Include a clear call-to-action
// 4. Make the subject line attention-grabbing`

//     // Generate template using AI
//     const { text } = await generateText({
//       model: "openai/gpt-4.1",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt }
//       ],
//       temperature: 0.8,
//       maxTokens: 1000,
//     })

//     // Parse AI response
//     let generatedData
//     try {
//       // Try to extract JSON from response
//       const jsonMatch = text.match(/\{[\s\S]*\}/)
//       if (jsonMatch) {
//         generatedData = JSON.parse(jsonMatch[0])
//       } else {
//         throw new Error("No JSON found in response")
//       }
//     } catch (parseError) {
//       console.error("Failed to parse AI response:", text)
//       return NextResponse.json({ 
//         error: "Failed to generate template. Please try again." 
//       }, { status: 500 })
//     }

//     // Extract variables from subject and body
//     const variableRegex = /\{\{(\w+)\}\}/g
//     const extractedVars = new Set<string>()

//     const subjectMatches = generatedData.subject.matchAll(variableRegex)
//     for (const match of subjectMatches) {
//       extractedVars.add(match[1])
//     }

//     const bodyMatches = generatedData.body.matchAll(variableRegex)
//     for (const match of bodyMatches) {
//       extractedVars.add(match[1])
//     }

//     // Save to generation history
//     await db.templateGenerationHistory.create({
//       data: {
//         userId: user.id,
//         prompt,
//         industry,
//         purpose,
//         tone,
//         aiModel: "gpt-4",
//         generatedName: generatedData.name,
//         generatedSubject: generatedData.subject,
//         generatedBody: generatedData.body,
//         context: {
//           targetLength,
//           includePersonalization
//         }
//       }
//     })

//     return NextResponse.json({
//       success: true,
//       template: {
//         name: generatedData.name,
//         subject: generatedData.subject,
//         body: generatedData.body,
//         variables: Array.from(extractedVars),
//         suggestions: generatedData.suggestions || []
//       }
//     })

//   } catch (error) {
//     console.error("[v0] Template generation error:", error)
//     return NextResponse.json({ 
//       error: "Failed to generate template" 
//     }, { status: 500 })
//   }
// }



// import { NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { generateText } from "ai"
// import { db } from "@/lib/db"

// export async function POST(req: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     const body = await req.json()
//     const { 
//       prompt, 
//       industry, 
//       purpose, 
//       tone = "professional",
//       targetLength = "medium",
//       includePersonalization = true 
//     } = body

//     if (!prompt) {
//       return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
//     }

//     // Build AI prompt with context
//     const systemPrompt = `You are an expert email copywriter specializing in ${industry || 'business'} communication.
// Your task is to generate high-converting email templates that are:
// - ${tone} in tone
// - ${targetLength === 'short' ? 'Concise (under 150 words)' : targetLength === 'long' ? 'Detailed (250+ words)' : 'Balanced (150-250 words)'}
// - Purpose: ${purpose || 'general outreach'}
// - Include personalization variables in {{variableName}} format ${includePersonalization ? '(use at least 3-5 variables like firstName, companyName, etc.)' : ''}

// Generate a complete email template with:
// 1. A compelling subject line
// 2. Email body with clear structure
// 3. Call-to-action
// 4. Professional sign-off

// Respond ONLY with valid JSON in this exact format:
// {
//   "name": "Template Name",
//   "subject": "Subject line with {{variables}}",
//   "body": "Email body with {{variables}}",
//   "variables": ["firstName", "companyName"],
//   "suggestions": ["tip1", "tip2", "tip3"]
// }`

//     const userPrompt = `Create an email template: ${prompt}

// Additional context:
// - Industry: ${industry || 'general'}
// - Purpose: ${purpose || 'general outreach'}
// - Tone: ${tone}
// - Target length: ${targetLength}

// Remember to:
// 1. Use {{variableName}} format for personalization
// 2. Keep it natural and conversational
// 3. Include a clear call-to-action
// 4. Make the subject line attention-grabbing`

//     // Generate template using AI
//     const { text } = await generateText({
//       model: "openai/gpt-4.1",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt }
//       ],
//       temperature: 0.8,
//       maxSteps: 5,
//     })

//     // Parse AI response
//     let generatedData
//     try {
//       // Try to extract JSON from response
//       const jsonMatch = text.match(/\{[\s\S]*\}/)
//       if (jsonMatch) {
//         generatedData = JSON.parse(jsonMatch[0])
//       } else {
//         throw new Error("No JSON found in response")
//       }
//     } catch (parseError) {
//       console.error("Failed to parse AI response:", text)
//       return NextResponse.json({ 
//         error: "Failed to generate template. Please try again." 
//       }, { status: 500 })
//     }

//     // Extract variables from subject and body
//     const variableRegex = /\{\{(\w+)\}\}/g
//     const extractedVars = new Set<string>()

//     const subjectMatches = generatedData.subject.matchAll(variableRegex)
//     for (const match of subjectMatches) {
//       extractedVars.add(match[1])
//     }

//     const bodyMatches = generatedData.body.matchAll(variableRegex)
//     for (const match of bodyMatches) {
//       extractedVars.add(match[1])
//     }

//     // Save to generation history
//     await db.templateGenerationHistory.create({
//       data: {
//         userId: user.id,
//         prompt,
//         industry,
//         purpose,
//         tone,
//         aiModel: "gpt-4",
//         generatedName: generatedData.name,
//         generatedSubject: generatedData.subject,
//         generatedBody: generatedData.body,
//         context: {
//           targetLength,
//           includePersonalization
//         }
//       }
//     })

//     return NextResponse.json({
//       success: true,
//       template: {
//         name: generatedData.name,
//         subject: generatedData.subject,
//         body: generatedData.body,
//         variables: Array.from(extractedVars),
//         suggestions: generatedData.suggestions || []
//       }
//     })

//   } catch (error) {
//     console.error("[v0] Template generation error:", error)
//     return NextResponse.json({ 
//       error: "Failed to generate template" 
//     }, { status: 500 })
//   }
// }

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { generateText } from "ai"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const { 
      prompt, 
      industry, 
      purpose, 
      tone = "professional",
      targetLength = "medium",
      includePersonalization = true 
    } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Build AI prompt with context
    const systemPrompt = `You are an expert email copywriter specializing in ${industry || 'business'} communication.
Your task is to generate high-converting email templates that are:
- ${tone} in tone
- ${targetLength === 'short' ? 'Concise (under 150 words)' : targetLength === 'long' ? 'Detailed (250+ words)' : 'Balanced (150-250 words)'}
- Purpose: ${purpose || 'general outreach'}
- Include personalization variables in {{variableName}} format ${includePersonalization ? '(use at least 3-5 variables like firstName, companyName, etc.)' : ''}

Generate a complete email template with:
1. A compelling subject line
2. Email body with clear structure
3. Call-to-action
4. Professional sign-off

Respond ONLY with valid JSON in this exact format:
{
  "name": "Template Name",
  "subject": "Subject line with {{variables}}",
  "body": "Email body with {{variables}}",
  "variables": ["firstName", "companyName"],
  "suggestions": ["tip1", "tip2", "tip3"]
}`

    const userPrompt = `Create an email template: ${prompt}

Additional context:
- Industry: ${industry || 'general'}
- Purpose: ${purpose || 'general outreach'}
- Tone: ${tone}
- Target length: ${targetLength}

Remember to:
1. Use {{variableName}} format for personalization
2. Keep it natural and conversational
3. Include a clear call-to-action
4. Make the subject line attention-grabbing`

    // Generate template using AI
    const { text } = await generateText({
      model: "openai/gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
    })

    // Parse AI response
    let generatedData
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        generatedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error("No JSON found in response")
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", text)
      return NextResponse.json({ 
        error: "Failed to generate template. Please try again." 
      }, { status: 500 })
    }

    // Extract variables from subject and body
    const variableRegex = /\{\{(\w+)\}\}/g
    const extractedVars = new Set<string>()

    const subjectMatches = generatedData.subject.matchAll(variableRegex)
    for (const match of subjectMatches) {
      extractedVars.add(match[1])
    }

    const bodyMatches = generatedData.body.matchAll(variableRegex)
    for (const match of bodyMatches) {
      extractedVars.add(match[1])
    }

    // Save to generation history
    await db.templateGenerationHistory.create({
      data: {
        userId: user.id,
        prompt,
        industry,
        purpose,
        tone,
        aiModel: "gpt-4",
        generatedName: generatedData.name,
        generatedSubject: generatedData.subject,
        generatedBody: generatedData.body,
        context: {
          targetLength,
          includePersonalization
        }
      }
    })

    return NextResponse.json({
      success: true,
      template: {
        name: generatedData.name,
        subject: generatedData.subject,
        body: generatedData.body,
        variables: Array.from(extractedVars),
        suggestions: generatedData.suggestions || []
      }
    })

  } catch (error) {
    console.error("[v0] Template generation error:", error)
    return NextResponse.json({ 
      error: "Failed to generate template" 
    }, { status: 500 })
  }
}
