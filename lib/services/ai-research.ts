// import { generateObject } from "ai"

// interface ProspectData {
//   email: string
//   firstName?: string
//   lastName?: string
//   company?: string
//   jobTitle?: string
//   linkedinUrl?: string
//   websiteUrl?: string
// }

// interface ResearchResult {
//   companyInfo: string
//   recentNews: string[]
//   painPoints: string[]
//   competitorTools: string[]
//   talkingPoints: string[]
//   qualityScore: number
//   personalizationTokens: Record<string, string>
// }

// export async function researchProspect(
//   prospect: ProspectData,
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
// ): Promise<ResearchResult> {
//   console.log("[v0] Starting AI research for prospect:", prospect.email)

//   // Simulate web scraping data(in production, this would call actual scraping APIs)
//   const scrapedData = await simulateWebScraping(prospect)

//   // Use AI to analyze and extract insights
//   const prompt = `
// You are an expert sales researcher. Analyze the following prospect data and provide actionable insights for cold email outreach.

// Prospect Information:
// - Name: ${prospect.firstName} ${prospect.lastName}
// - Company: ${prospect.company}
// - Job Title: ${prospect.jobTitle}
// - LinkedIn: ${prospect.linkedinUrl || "Not provided"}
// - Website: ${prospect.websiteUrl || "Not provided"}

// Scraped Data:
// ${JSON.stringify(scrapedData, null, 2)}

// Research Depth: ${depth}

// Provide:
// 1. Company overview (2-3 sentences)
// 2. Recent news or developments (3-5 items)
// 3. Potential pain points this person might have (3-5 items)
// 4. Tools/competitors they likely use (3-5 items)
// 5. Specific talking points for personalized outreach (3-5 items)
// 6. Quality score (0-100) based on data completeness and relevance
// 7. Personalization tokens (key-value pairs for email templates)

// Format your response as JSON.
// `

//   try {
//     const { object } = await generateObject({
//       model: "openai/gpt-4o-mini",
//       prompt,
//       schema: {
//         type: "object",
//         properties: {
//           companyInfo: { type: "string" },
//           recentNews: { type: "array", items: { type: "string" } },
//           painPoints: { type: "array", items: { type: "string" } },
//           competitorTools: { type: "array", items: { type: "string" } },
//           talkingPoints: { type: "array", items: { type: "string" } },
//           qualityScore: { type: "number" },
//           personalizationTokens: { type: "object" },
//         },
//         required: [
//           "companyInfo",
//           "recentNews",
//           "painPoints",
//           "competitorTools",
//           "talkingPoints",
//           "qualityScore",
//           "personalizationTokens",
//         ],
//       },
//     })

//     return object as ResearchResult
//   } catch (error) {
//     console.error("[v0] AI research failed:", error)
//     // Return fallback data
//     return {
//       companyInfo: `${prospect.company} is a company in the ${prospect.jobTitle?.includes("Tech") ? "technology" : "business"} sector.`,
//       recentNews: ["Company information not available"],
//       painPoints: ["Scaling operations", "Improving efficiency", "Reducing costs"],
//       competitorTools: ["Industry standard tools"],
//       talkingPoints: [`Reach out regarding ${prospect.company}'s growth`],
//       qualityScore: 50,
//       personalizationTokens: {
//         firstName: prospect.firstName || "",
//         company: prospect.company || "",
//         jobTitle: prospect.jobTitle || "",
//       },
//     }
//   }
// }

// async function simulateWebScraping(prospect: ProspectData): Promise<any> {
//   // In production, this would call actual web scraping APIs
//   // For now, we'll simulate with mock data
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   return {
//     companyWebsite: {
//       description: `${prospect.company} provides innovative solutions for modern businesses.`,
//       products: ["Product A", "Product B", "Product C"],
//       recentBlogPosts: [
//         "How we scaled to 10,000 customers",
//         "Introducing our new AI features",
//         "Q4 2024 product updates",
//       ],
//     },
//     linkedinProfile: {
//       headline: prospect.jobTitle,
//       experience: [
//         { company: prospect.company, title: prospect.jobTitle, duration: "2 years" },
//         { company: "Previous Company", title: "Senior Role", duration: "3 years" },
//       ],
//       skills: ["Sales", "Leadership", "Strategy", "Business Development"],
//     },
//     newsArticles: [
//       {
//         title: `${prospect.company} raises funding`,
//         source: "TechCrunch",
//         date: "2024-12-15",
//       },
//       {
//         title: `${prospect.company} launches new product`,
//         source: "VentureBeat",
//         date: "2024-11-20",
//       },
//     ],
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
// ): Promise<Map<string, ResearchResult>> {
//   console.log("[v0] Starting batch research for", prospects.length, "prospects")

//   const results = new Map<string, ResearchResult>()

//   for (let i = 0; i < prospects.length; i++) {
//     const prospect = prospects[i]
//     try {
//       const result = await researchProspect(prospect, depth)
//       results.set(prospect.email, result)

//       if (onProgress) {
//         onProgress(i + 1, prospects.length)
//       }
//     } catch (error) {
//       console.error("[v0] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[v0] Batch research completed:", results.size, "successful")

//   return results
// }

// export function calculateQualityScore(prospect: ProspectData, researchData?: any): number {
//   let score = 0

//   // Base score for having email
//   score += 20

//   // Score for basic info
//   if (prospect.firstName && prospect.lastName) score += 10
//   if (prospect.company) score += 15
//   if (prospect.jobTitle) score += 15

//   // Score for URLs
//   if (prospect.linkedinUrl) score += 20
//   if (prospect.websiteUrl) score += 10

//   // Score for research data quality
//   if (researchData) {
//     if (researchData.recentNews?.length > 0) score += 5
//     if (researchData.painPoints?.length > 0) score += 5
//   }

//   return Math.min(score, 100)
// }

// import { generateObject } from "ai"
// import { z } from "zod"

// interface ProspectData {
//   email: string
//   firstName?: string
//   lastName?: string
//   company?: string
//   jobTitle?: string
//   linkedinUrl?: string
//   websiteUrl?: string
// }

// interface ResearchResult {
//   companyInfo: string
//   recentNews: string[]
//   painPoints: string[]
//   competitorTools: string[]
//   talkingPoints: string[]
//   qualityScore: number
//   personalizationTokens: Record<string, string>
// }

// export async function researchProspect(
//   prospect: ProspectData,
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
// ): Promise<ResearchResult> {
//   console.log("[v0] Starting AI research for prospect:", prospect.email)

//   // Simulate web scraping data (in production, this would call actual scraping APIs)
//   const scrapedData = await simulateWebScraping(prospect)

//   // Use AI to analyze and extract insights
//   const prompt = `
// You are an expert sales researcher. Analyze the following prospect data and provide actionable insights for cold email outreach.

// Prospect Information:
// - Name: ${prospect.firstName} ${prospect.lastName}
// - Company: ${prospect.company}
// - Job Title: ${prospect.jobTitle}
// - LinkedIn: ${prospect.linkedinUrl || "Not provided"}
// - Website: ${prospect.websiteUrl || "Not provided"}

// Scraped Data:
// ${JSON.stringify(scrapedData, null, 2)}

// Research Depth: ${depth}

// Provide:
// 1. Company overview (2-3 sentences)
// 2. Recent news or developments (3-5 items)
// 3. Potential pain points this person might have (3-5 items)
// 4. Tools/competitors they likely use (3-5 items)
// 5. Specific talking points for personalized outreach (3-5 items)
// 6. Quality score (0-100) based on data completeness and relevance
// 7. Personalization tokens (key-value pairs for email templates)

// Format your response as JSON.
// `

//   try {
//     const { object } = await generateObject({
//       model: "openai/gpt-4o-mini",
//       prompt,
//       schema: z.object({
//         companyInfo: z.string(),
//         recentNews: z.array(z.string()),
//         painPoints: z.array(z.string()),
//         competitorTools: z.array(z.string()),
//         talkingPoints: z.array(z.string()),
//         qualityScore: z.number(),
//         personalizationTokens: z.record(z.string()),
//       }),
//     })

//     console.log("[v0] AI research completed with quality score:", object.qualityScore)

//     return object as ResearchResult
//   } catch (error) {
//     console.error("[v0] AI research failed:", error)
//     // Return fallback data
//     return {
//       companyInfo: `${prospect.company} is a company in the ${prospect.jobTitle?.includes("Tech") ? "technology" : "business"} sector.`,
//       recentNews: ["Company information not available"],
//       painPoints: ["Scaling operations", "Improving efficiency", "Reducing costs"],
//       competitorTools: ["Industry standard tools"],
//       talkingPoints: [`Reach out regarding ${prospect.company}'s growth`],
//       qualityScore: 50,
//       personalizationTokens: {
//         firstName: prospect.firstName || "",
//         company: prospect.company || "",
//         jobTitle: prospect.jobTitle || "",
//       },
//     }
//   }
// }

// async function simulateWebScraping(prospect: ProspectData): Promise<any> {
//   // In production, this would call actual web scraping APIs
//   // For now, we'll simulate with mock data
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   return {
//     companyWebsite: {
//       description: `${prospect.company} provides innovative solutions for modern businesses.`,
//       products: ["Product A", "Product B", "Product C"],
//       recentBlogPosts: [
//         "How we scaled to 10,000 customers",
//         "Introducing our new AI features",
//         "Q4 2024 product updates",
//       ],
//     },
//     linkedinProfile: {
//       headline: prospect.jobTitle,
//       experience: [
//         { company: prospect.company, title: prospect.jobTitle, duration: "2 years" },
//         { company: "Previous Company", title: "Senior Role", duration: "3 years" },
//       ],
//       skills: ["Sales", "Leadership", "Strategy", "Business Development"],
//     },
//     newsArticles: [
//       {
//         title: `${prospect.company} raises funding`,
//         source: "TechCrunch",
//         date: "2024-12-15",
//       },
//       {
//         title: `${prospect.company} launches new product`,
//         source: "VentureBeat",
//         date: "2024-11-20",
//       },
//     ],
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
// ): Promise<Map<string, ResearchResult>> {
//   console.log("[v0] Starting batch research for", prospects.length, "prospects")

//   const results = new Map<string, ResearchResult>()

//   for (let i = 0; i < prospects.length; i++) {
//     const prospect = prospects[i]
//     try {
//       const result = await researchProspect(prospect, depth)
//       results.set(prospect.email, result)

//       if (onProgress) {
//         onProgress(i + 1, prospects.length)
//       }
//     } catch (error) {
//       console.error("[v0] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[v0] Batch research completed:", results.size, "successful")

//   return results
// }

// export function calculateQualityScore(prospect: ProspectData, researchData?: any): number {
//   let score = 0

//   // Base score for having email
//   score += 20

//   // Score for basic info
//   if (prospect.firstName && prospect.lastName) score += 10
//   if (prospect.company) score += 15
//   if (prospect.jobTitle) score += 15

//   // Score for URLs
//   if (prospect.linkedinUrl) score += 20
//   if (prospect.websiteUrl) score += 10

//   // Score for research data quality
//   if (researchData) {
//     if (researchData.recentNews?.length > 0) score += 5
//     if (researchData.painPoints?.length > 0) score += 5
//   }

//   return Math.min(score, 100)
// }




// import { generateObject } from "ai"
// import { z } from "zod"

// interface ProspectData {
//   email: string
//   firstName?: string
//   lastName?: string
//   company?: string
//   jobTitle?: string
//   linkedinUrl?: string
//   websiteUrl?: string
// }

// interface ResearchResult {
//   companyInfo: string
//   recentNews: string[]
//   painPoints: string[]
//   competitorTools: string[]
//   talkingPoints: string[]
//   qualityScore: number
//   personalizationTokens: Record<string, string>
// }

// export async function researchProspect(
//   prospect: ProspectData,
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
// ): Promise<ResearchResult> {
//   console.log("[v0] Starting AI research for prospect:", prospect.email)

//   // Simulate web scraping data (in production, this would call actual scraping APIs)
//   const scrapedData = await simulateWebScraping(prospect)

//   // Use AI to analyze and extract insights
//   const prompt = `
// You are an expert sales researcher. Analyze the following prospect data and provide actionable insights for cold email outreach.

// Prospect Information:
// - Name: ${prospect.firstName} ${prospect.lastName}
// - Company: ${prospect.company}
// - Job Title: ${prospect.jobTitle}
// - LinkedIn: ${prospect.linkedinUrl || "Not provided"}
// - Website: ${prospect.websiteUrl || "Not provided"}

// Scraped Data:
// ${JSON.stringify(scrapedData, null, 2)}

// Research Depth: ${depth}

// Provide:
// 1. Company overview (2-3 sentences)
// 2. Recent news or developments (3-5 items)
// 3. Potential pain points this person might have (3-5 items)
// 4. Tools/competitors they likely use (3-5 items)
// 5. Specific talking points for personalized outreach (3-5 items)
// 6. Quality score (0-100) based on data completeness and relevance
// 7. Personalization tokens (key-value pairs for email templates)

// Format your response as JSON.
// `

//   try {
//     const { object } = await generateObject({
//       model: "openai/gpt-4o-mini",
//       prompt,
//       schema: z.object({
//         companyInfo: z.string(),
//         recentNews: z.array(z.string()),
//         painPoints: z.array(z.string()),
//         competitorTools: z.array(z.string()),
//         talkingPoints: z.array(z.string()),
//         qualityScore: z.number(),
//         personalizationTokens: z.record(z.string()),
//       }),
//     })

//     console.log("[v0] AI research completed with quality score:", object.qualityScore)

//     return object as ResearchResult
//   } catch (error) {
//     console.error("[v0] AI research failed:", error)
//     // Return fallback data
//     return {
//       companyInfo: `${prospect.company} is a company in the ${prospect.jobTitle?.includes("Tech") ? "technology" : "business"} sector.`,
//       recentNews: ["Company information not available"],
//       painPoints: ["Scaling operations", "Improving efficiency", "Reducing costs"],
//       competitorTools: ["Industry standard tools"],
//       talkingPoints: [`Reach out regarding ${prospect.company}'s growth`],
//       qualityScore: 50,
//       personalizationTokens: {
//         firstName: prospect.firstName || "",
//         company: prospect.company || "",
//         jobTitle: prospect.jobTitle || "",
//       },
//     }
//   }
// }

// async function simulateWebScraping(prospect: ProspectData): Promise<any> {
//   // Use actual web scraping - in production, integrate with services like:
//   // - Apify for LinkedIn scraping
//   // - Clearbit/Hunter for company data
//   // - NewsAPI for recent news

//   const results: any = {
//     companyWebsite: null,
//     linkedinProfile: null,
//     newsArticles: [],
//   }

//   try {
//     // Scrape company website if available
//     if (prospect.websiteUrl) {
//       // In production: Use Apify, Puppeteer, or similar
//       // For now, we'll use basic fetch to get meta data
//       const response = await fetch(prospect.websiteUrl, {
//         headers: { "User-Agent": "Mozilla/5.0" },
//       }).catch(() => null)

//       if (response?.ok) {
//         const html = await response.text()
//         // Extract basic info from meta tags
//         const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
//         results.companyWebsite = {
//           description: descMatch?.[1] || `${prospect.company} website`,
//           products: [],
//           recentBlogPosts: [],
//         }
//       }
//     }

//     // LinkedIn profile data
//     if (prospect.linkedinUrl) {
//       results.linkedinProfile = {
//         headline: prospect.jobTitle || "Professional",
//         experience: [{ company: prospect.company, title: prospect.jobTitle, duration: "Current" }],
//         skills: [],
//       }
//     }

//     // Search for news articles about the company
//     if (prospect.company) {
//       // In production: Use NewsAPI, Google News API, or similar
//       results.newsArticles = []
//     }

//     return results
//   } catch (error) {
//     console.error("[v0] Web scraping error:", error)
//     return results
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
// ): Promise<Map<string, ResearchResult>> {
//   console.log("[v0] Starting batch research for", prospects.length, "prospects")

//   const results = new Map<string, ResearchResult>()

//   for (let i = 0; i < prospects.length; i++) {
//     const prospect = prospects[i]
//     try {
//       const result = await researchProspect(prospect, depth)
//       results.set(prospect.email, result)

//       if (onProgress) {
//         onProgress(i + 1, prospects.length)
//       }
//     } catch (error) {
//       console.error("[v0] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[v0] Batch research completed:", results.size, "successful")

//   return results
// }

// export function calculateQualityScore(prospect: ProspectData, researchData?: any): number {
//   let score = 0

//   // Base score for having email
//   score += 20

//   // Score for basic info
//   if (prospect.firstName && prospect.lastName) score += 10
//   if (prospect.company) score += 15
//   if (prospect.jobTitle) score += 15

//   // Score for URLs
//   if (prospect.linkedinUrl) score += 20
//   if (prospect.websiteUrl) score += 10

//   // Score for research data quality
//   if (researchData) {
//     if (researchData.recentNews?.length > 0) score += 5
//     if (researchData.painPoints?.length > 0) score += 5
//   }

//   return Math.min(score, 100)
// }

// import { generateObject } from "ai"
// import { z } from "zod"
// import { scrapeWebsiteEnhanced, scrapeLinkedInProfileEnhanced, searchCompanyNewsEnhanced } from "./web-scraper"
// import type { ScrapingMode } from "./web-scraper"

// interface ProspectData {
//   email: string
//   firstName?: string
//   lastName?: string
//   company?: string
//   jobTitle?: string
//   linkedinUrl?: string
//   websiteUrl?: string
// }

// interface ResearchResult {
//   companyInfo: string
//   recentNews: string[]
//   painPoints: string[]
//   competitorTools: string[]
//   talkingPoints: string[]
//   qualityScore: number
//   personalizationTokens: Record<string, string>
// }

// interface EnhancedResearchResult extends ResearchResult {
//   linkedInInsights?: {
//     certifications: string[]
//     recentActivity: string[]
//     connections: number
//   }
//   companyInsights?: {
//     products: string[]
//     pricing: string
//     teamSize: string
//     hiringSignals: string[]
//     techStack: string[]
//   }
//   newsInsights?: {
//     sentiment: string
//     personalizationHooks: string[]
//   }
// }

// export async function researchProspect(
//   prospect: ProspectData,
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
// ): Promise<ResearchResult | EnhancedResearchResult> {
//   console.log("[v0] Starting AI research for prospect:", prospect.email)

//   const scrapingMode: ScrapingMode = depth === "DEEP" ? "DEEP" : "FAST"

//   const scrapedData = await gatherEnhancedData(prospect, scrapingMode)

//   // Use AI to analyze and extract insights
//   const prompt = `
// You are an expert sales researcher. Analyze the following prospect data and provide actionable insights for cold email outreach.

// Prospect Information:
// - Name: ${prospect.firstName} ${prospect.lastName}
// - Company: ${prospect.company}
// - Job Title: ${prospect.jobTitle}
// - LinkedIn: ${prospect.linkedinUrl || "Not provided"}
// - Website: ${prospect.websiteUrl || "Not provided"}

// Scraped Data:
// ${JSON.stringify(scrapedData, null, 2)}

// Research Depth: ${depth}

// Provide:
// 1. Company overview (2-3 sentences)
// 2. Recent news or developments (3-5 items)
// 3. Potential pain points this person might have (3-5 items)
// 4. Tools/competitors they likely use (3-5 items)
// 5. Specific talking points for personalized outreach (3-5 items)
// 6. Quality score (0-100) based on data completeness and relevance
// 7. Personalization tokens (key-value pairs for email templates)

// Format your response as JSON.
// `

//   try {
//     const { object } = await generateObject({
//       model: "openai/gpt-4o-mini",
//       prompt,
//       schema: z.object({
//         companyInfo: z.string(),
//         recentNews: z.array(z.string()),
//         painPoints: z.array(z.string()),
//         competitorTools: z.array(z.string()),
//         talkingPoints: z.array(z.string()),
//         qualityScore: z.number(),
//         personalizationTokens: z.record(z.string()),
//       }),
//     })

//     console.log("[v0] AI research completed with quality score:", object.qualityScore)

//     if (depth === "DEEP" && scrapedData.enhanced) {
//       return {
//         ...object,
//         linkedInInsights: scrapedData.linkedInInsights,
//         companyInsights: scrapedData.companyInsights,
//         newsInsights: scrapedData.newsInsights,
//       } as EnhancedResearchResult
//     }

//     return object as ResearchResult
//   } catch (error) {
//     console.error("[v0] AI research failed:", error)
//     // Return fallback data
//     return {
//       companyInfo: `${prospect.company} is a company in the ${prospect.jobTitle?.includes("Tech") ? "technology" : "business"} sector.`,
//       recentNews: ["Company information not available"],
//       painPoints: ["Scaling operations", "Improving efficiency", "Reducing costs"],
//       competitorTools: ["Industry standard tools"],
//       talkingPoints: [`Reach out regarding ${prospect.company}'s growth`],
//       qualityScore: 50,
//       personalizationTokens: {
//         firstName: prospect.firstName || "",
//         company: prospect.company || "",
//         jobTitle: prospect.jobTitle || "",
//       },
//     }
//   }
// }

// async function gatherEnhancedData(prospect: ProspectData, mode: ScrapingMode): Promise<any> {
//   const results: any = {
//     enhanced: mode === "DEEP",
//     companyWebsite: null,
//     linkedinProfile: null,
//     newsArticles: [],
//   }

//   try {
//     // Scrape company website
//     if (prospect.websiteUrl) {
//       const companyData = await scrapeWebsiteEnhanced(prospect.websiteUrl, mode)
//       results.companyWebsite = companyData

//       if (mode === "DEEP" && "products" in companyData) {
//         results.companyInsights = {
//           products: companyData.products || [],
//           pricing: companyData.pricing || "",
//           teamSize: companyData.teamSize || "",
//           hiringSignals: companyData.hiringSignals || [],
//           techStack: companyData.techStack || [],
//         }
//       }
//     }

//     // Scrape LinkedIn profile
//     if (prospect.linkedinUrl) {
//       const linkedInData = await scrapeLinkedInProfileEnhanced(prospect.linkedinUrl, mode)
//       results.linkedinProfile = linkedInData

//       if (mode === "DEEP" && "certifications" in linkedInData) {
//         results.linkedInInsights = {
//           certifications: linkedInData.certifications || [],
//           recentActivity: linkedInData.recentActivity || [],
//           connections: linkedInData.connections || 0,
//         }
//       }
//     }

//     // Search news
//     if (prospect.company) {
//       const newsData = await searchCompanyNewsEnhanced(prospect.company, 5, mode)
//       results.newsArticles = newsData

//       if (mode === "DEEP" && newsData.length > 0 && "sentiment" in newsData[0]) {
//         const sentiments = newsData.map((n: any) => n.sentiment).filter(Boolean)
//         const hooks = newsData.flatMap((n: any) => n.personalizationHooks || [])
//         results.newsInsights = {
//           sentiment: sentiments[0] || "neutral",
//           personalizationHooks: hooks,
//         }
//       }
//     }

//     return results
//   } catch (error) {
//     console.error("[v0] Enhanced data gathering error:", error)
//     return results
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
// ): Promise<Map<string, ResearchResult | EnhancedResearchResult>> {
//   console.log("[v0] Starting batch research for", prospects.length, "prospects")

//   const results = new Map<string, ResearchResult | EnhancedResearchResult>()

//   for (let i = 0; i < prospects.length; i++) {
//     const prospect = prospects[i]
//     try {
//       const result = await researchProspect(prospect, depth)
//       results.set(prospect.email, result)

//       if (onProgress) {
//         onProgress(i + 1, prospects.length)
//       }
//     } catch (error) {
//       console.error("[v0] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[v0] Batch research completed:", results.size, "successful")

//   return results
// }

// export function calculateQualityScore(prospect: ProspectData, researchData?: any): number {
//   let score = 0

//   // Base score for having email
//   score += 20

//   // Score for basic info
//   if (prospect.firstName && prospect.lastName) score += 10
//   if (prospect.company) score += 15
//   if (prospect.jobTitle) score += 15

//   // Score for URLs
//   if (prospect.linkedinUrl) score += 20
//   if (prospect.websiteUrl) score += 10

//   // Score for research data quality
//   if (researchData) {
//     if (researchData.recentNews?.length > 0) score += 5
//     if (researchData.painPoints?.length > 0) score += 5
//   }

//   return Math.min(score, 100)
// }

// async function simulateWebScraping(prospect: ProspectData): Promise<any> {
//   // Use actual web scraping - in production, integrate with services like:
//   // - Apify for LinkedIn scraping
//   // - Clearbit/Hunter for company data
//   // - NewsAPI for recent news

//   const results: any = {
//     companyWebsite: null,
//     linkedinProfile: null,
//     newsArticles: [],
//   }

//   try {
//     // Scrape company website if available
//     if (prospect.websiteUrl) {
//       // In production: Use Apify, Puppeteer, or similar
//       // For now, we'll use basic fetch to get meta data
//       const response = await fetch(prospect.websiteUrl, {
//         headers: { "User-Agent": "Mozilla/5.0" },
//       }).catch(() => null)

//       if (response?.ok) {
//         const html = await response.text()
//         // Extract basic info from meta tags
//         const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
//         results.companyWebsite = {
//           description: descMatch?.[1] || `${prospect.company} website`,
//           products: [],
//           recentBlogPosts: [],
//         }
//       }
//     }

//     // LinkedIn profile data
//     if (prospect.linkedinUrl) {
//       results.linkedinProfile = {
//         headline: prospect.jobTitle || "Professional",
//         experience: [{ company: prospect.company, title: prospect.jobTitle, duration: "Current" }],
//         skills: [],
//       }
//     }

//     // Search for news articles about the company
//     if (prospect.company) {
//       // In production: Use NewsAPI, Google News API, or similar
//       results.newsArticles = []
//     }

//     return results
//   } catch (error) {
//     console.error("[v0] Web scraping error:", error)
//     return results
//   }
// }

// import { generateObject } from "ai"
// import { z } from "zod"
// import { scrapeWebsiteEnhanced, scrapeLinkedInProfileEnhanced, searchCompanyNewsEnhanced } from "./web-scraper"
// import type { ScrapingMode } from "./web-scraper"

// interface ProspectData {
//   email: string
//   firstName?: string
//   lastName?: string
//   company?: string
//   jobTitle?: string
//   linkedinUrl?: string
//   websiteUrl?: string
// }

// interface ResearchResult {
//   companyInfo: string
//   recentNews: string[]
//   painPoints: string[]
//   competitorTools: string[]
//   talkingPoints: string[]
//   qualityScore: number
//   personalizationTokens: Record<string, string>
// }

// interface EnhancedResearchResult extends ResearchResult {
//   linkedInInsights?: {
//     certifications: string[]
//     recentActivity: string[]
//     connections: number
//   }
//   companyInsights?: {
//     products: string[]
//     pricing: string
//     teamSize: string
//     hiringSignals: string[]
//     techStack: string[]
//   }
//   newsInsights?: {
//     sentiment: string
//     personalizationHooks: string[]
//   }
// }

// export async function researchProspect(
//   prospect: ProspectData,
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
// ): Promise<ResearchResult | EnhancedResearchResult> {
//   console.log("[v0] Starting AI research for prospect:", prospect.email)
//   console.log("[v0] Research depth:", depth)
//   console.log("[v0] Prospect data:", {
//     hasFirstName: !!prospect.firstName,
//     hasLastName: !!prospect.lastName,
//     hasCompany: !!prospect.company,
//     hasJobTitle: !!prospect.jobTitle,
//     hasLinkedIn: !!prospect.linkedinUrl,
//     hasWebsite: !!prospect.websiteUrl,
//   })

//   const scrapingMode: ScrapingMode = depth === "DEEP" ? "DEEP" : "FAST"

//   console.log("[v0] Gathering enhanced data...")
//   const scrapedData = await gatherEnhancedData(prospect, scrapingMode)
//   console.log("[v0] Enhanced data gathered:", {
//     hasCompanyWebsite: !!scrapedData.companyWebsite,
//     hasLinkedInProfile: !!scrapedData.linkedinProfile,
//     newsArticlesCount: scrapedData.newsArticles?.length || 0,
//   })

//   // Use AI to analyze and extract insights
//   const prompt = `
// You are an expert sales researcher. Analyze the following prospect data and provide actionable insights for cold email outreach.

// Prospect Information:
// - Name: ${prospect.firstName} ${prospect.lastName}
// - Company: ${prospect.company}
// - Job Title: ${prospect.jobTitle}
// - LinkedIn: ${prospect.linkedinUrl || "Not provided"}
// - Website: ${prospect.websiteUrl || "Not provided"}

// Scraped Data:
// ${JSON.stringify(scrapedData, null, 2)}

// Research Depth: ${depth}

// Provide:
// 1. Company overview (2-3 sentences)
// 2. Recent news or developments (3-5 items)
// 3. Potential pain points this person might have (3-5 items)
// 4. Tools/competitors they likely use (3-5 items)
// 5. Specific talking points for personalized outreach (3-5 items)
// 6. Quality score (0-100) based on data completeness and relevance
// 7. Personalization tokens (key-value pairs for email templates)

// Format your response as JSON.
// `

//   try {
//     console.log("[v0] Calling OpenAI API for analysis...")
//     console.log("[v0] Checking OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Present" : "MISSING")

//     const { object } = await generateObject({
//       model: "openai/gpt-4o-mini",
//       prompt,
//       schema: z.object({
//         companyInfo: z.string(),
//         recentNews: z.array(z.string()),
//         painPoints: z.array(z.string()),
//         competitorTools: z.array(z.string()),
//         talkingPoints: z.array(z.string()),
//         qualityScore: z.number(),
//         personalizationTokens: z.record(z.string()),
//       }),
//     })

//     console.log("[v0] AI research completed with quality score:", object.qualityScore)

//     if (depth === "DEEP" && scrapedData.enhanced) {
//       return {
//         ...object,
//         linkedInInsights: scrapedData.linkedInInsights,
//         companyInsights: scrapedData.companyInsights,
//         newsInsights: scrapedData.newsInsights,
//       } as EnhancedResearchResult
//     }

//     return object as ResearchResult
//   } catch (error) {
//     console.error("[v0] AI research failed:", error)
//     console.error("[v0] AI error details:", {
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//       name: error instanceof Error ? error.name : undefined,
//       cause: error instanceof Error ? (error as any).cause : undefined,
//     })

//     return {
//       companyInfo: `${prospect.company} is a company in the ${prospect.jobTitle?.includes("Tech") ? "technology" : "business"} sector.`,
//       recentNews: ["Company information not available - AI analysis failed"],
//       painPoints: ["Scaling operations", "Improving efficiency", "Reducing costs"],
//       competitorTools: ["Industry standard tools"],
//       talkingPoints: [`Reach out regarding ${prospect.company}'s growth`],
//       qualityScore: 50,
//       personalizationTokens: {
//         firstName: prospect.firstName || "",
//         company: prospect.company || "",
//         jobTitle: prospect.jobTitle || "",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//     }
//   }
// }

// async function gatherEnhancedData(prospect: ProspectData, mode: ScrapingMode): Promise<any> {
//   console.log("[v0] Gathering enhanced data with mode:", mode)

//   const results: any = {
//     enhanced: mode === "DEEP",
//     companyWebsite: null,
//     linkedinProfile: null,
//     newsArticles: [],
//   }

//   try {
//     // Scrape company website
//     if (prospect.websiteUrl) {
//       console.log("[v0] Scraping company website:", prospect.websiteUrl)
//       try {
//         const companyData = await scrapeWebsiteEnhanced(prospect.websiteUrl, mode)
//         results.companyWebsite = companyData
//         console.log("[v0] Company website scraped successfully")

//         if (mode === "DEEP" && "products" in companyData) {
//           results.companyInsights = {
//             products: companyData.products || [],
//             pricing: companyData.pricing || "",
//             teamSize: companyData.teamSize || "",
//             hiringSignals: companyData.hiringSignals || [],
//             techStack: companyData.techStack || [],
//           }
//         }
//       } catch (error) {
//         console.error("[v0] Company website scraping failed:", error)
//       }
//     }

//     // Scrape LinkedIn profile
//     if (prospect.linkedinUrl) {
//       console.log("[v0] Scraping LinkedIn profile:", prospect.linkedinUrl)
//       try {
//         const linkedInData = await scrapeLinkedInProfileEnhanced(prospect.linkedinUrl, mode)
//         results.linkedinProfile = linkedInData
//         console.log("[v0] LinkedIn profile scraped successfully")

//         if (mode === "DEEP" && "certifications" in linkedInData) {
//           results.linkedInInsights = {
//             certifications: linkedInData.certifications || [],
//             recentActivity: linkedInData.recentActivity || [],
//             connections: linkedInData.connections || 0,
//           }
//         }
//       } catch (error) {
//         console.error("[v0] LinkedIn scraping failed:", error)
//       }
//     }

//     // Search news
//     if (prospect.company) {
//       console.log("[v0] Searching news for company:", prospect.company)
//       try {
//         const newsData = await searchCompanyNewsEnhanced(prospect.company, 5, mode)
//         results.newsArticles = newsData
//         console.log("[v0] Found", newsData.length, "news articles")

//         if (mode === "DEEP" && newsData.length > 0 && "sentiment" in newsData[0]) {
//           const sentiments = newsData.map((n: any) => n.sentiment).filter(Boolean)
//           const hooks = newsData.flatMap((n: any) => n.personalizationHooks || [])
//           results.newsInsights = {
//             sentiment: sentiments[0] || "neutral",
//             personalizationHooks: hooks,
//           }
//         }
//       } catch (error) {
//         console.error("[v0] News search failed:", error)
//       }
//     }

//     console.log("[v0] Enhanced data gathering completed")
//     return results
//   } catch (error) {
//     console.error("[v0] Enhanced data gathering error:", error)
//     return results
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
// ): Promise<Map<string, ResearchResult | EnhancedResearchResult>> {
//   console.log("[v0] Starting batch research for", prospects.length, "prospects")

//   const results = new Map<string, ResearchResult | EnhancedResearchResult>()

//   for (let i = 0; i < prospects.length; i++) {
//     const prospect = prospects[i]
//     try {
//       const result = await researchProspect(prospect, depth)
//       results.set(prospect.email, result)

//       if (onProgress) {
//         onProgress(i + 1, prospects.length)
//       }
//     } catch (error) {
//       console.error("[v0] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[v0] Batch research completed:", results.size, "successful")

//   return results
// }

// export function calculateQualityScore(prospect: ProspectData, researchData?: any): number {
//   let score = 0

//   // Base score for having email
//   score += 20

//   // Score for basic info
//   if (prospect.firstName && prospect.lastName) score += 10
//   if (prospect.company) score += 15
//   if (prospect.jobTitle) score += 15

//   // Score for URLs
//   if (prospect.linkedinUrl) score += 20
//   if (prospect.websiteUrl) score += 10

//   // Score for research data quality
//   if (researchData) {
//     if (researchData.recentNews?.length > 0) score += 5
//     if (researchData.painPoints?.length > 0) score += 5
//   }

//   return Math.min(score, 100)
// }

// async function simulateWebScraping(prospect: ProspectData): Promise<any> {
//   // Use actual web scraping - in production, integrate with services like:
//   // - Apify for LinkedIn scraping
//   // - Clearbit/Hunter for company data
//   // - NewsAPI for recent news

//   const results: any = {
//     companyWebsite: null,
//     linkedinProfile: null,
//     newsArticles: [],
//   }

//   try {
//     // Scrape company website if available
//     if (prospect.websiteUrl) {
//       // In production: Use Apify, Puppeteer, or similar
//       // For now, we'll use basic fetch to get meta data
//       const response = await fetch(prospect.websiteUrl, {
//         headers: { "User-Agent": "Mozilla/5.0" },
//       }).catch(() => null)

//       if (response?.ok) {
//         const html = await response.text()
//         // Extract basic info from meta tags
//         const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
//         results.companyWebsite = {
//           description: descMatch?.[1] || `${prospect.company} website`,
//           products: [],
//           recentBlogPosts: [],
//         }
//       }
//     }

//     // LinkedIn profile data
//     if (prospect.linkedinUrl) {
//       results.linkedinProfile = {
//         headline: prospect.jobTitle || "Professional",
//         experience: [{ company: prospect.company, title: prospect.jobTitle, duration: "Current" }],
//         skills: [],
//       }
//     }

//     // Search for news articles about the company
//     if (prospect.company) {
//       // In production: Use NewsAPI, Google News API, or similar
//       results.newsArticles = []
//     }

//     return results
//   } catch (error) {
//     console.error("[v0] Web scraping error:", error)
//     return results
//   }
// }
import { generateObject } from "ai"
import { z } from "zod"
import { scrapeWebsiteEnhanced, scrapeLinkedInProfileEnhanced, searchCompanyNewsEnhanced } from "./web-scraper"
import type { ScrapingMode } from "./web-scraper"

interface ProspectData {
  email: string
  firstName?: string
  lastName?: string
  company?: string
  jobTitle?: string
  linkedinUrl?: string
  websiteUrl?: string
}

interface ResearchResult {
  companyInfo: string
  recentNews: string[]
  painPoints: string[]
  competitorTools: string[]
  talkingPoints: string[]
  qualityScore: number
  personalizationTokens: Record<string, string>
}

interface EnhancedResearchResult extends ResearchResult {
  linkedInInsights?: {
    certifications: string[]
    recentActivity: string[]
    connections: number
  }
  companyInsights?: {
    products: string[]
    pricing: string
    teamSize: string
    hiringSignals: string[]
    techStack: string[]
  }
  newsInsights?: {
    sentiment: string
    personalizationHooks: string[]
  }
}

export async function researchProspect(
  prospect: ProspectData,
  depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
): Promise<ResearchResult | EnhancedResearchResult> {
  console.log("[v0] Starting AI research for prospect:", prospect.email)
  console.log("[v0] Research depth:", depth)
  console.log("[v0] Prospect data:", {
    hasFirstName: !!prospect.firstName,
    hasLastName: !!prospect.lastName,
    hasCompany: !!prospect.company,
    hasJobTitle: !!prospect.jobTitle,
    hasLinkedIn: !!prospect.linkedinUrl,
    hasWebsite: !!prospect.websiteUrl,
  })

  const scrapingMode: ScrapingMode = depth === "DEEP" ? "DEEP" : "FAST"

  console.log("[v0] Gathering enhanced data...")
  const scrapedData = await gatherEnhancedData(prospect, scrapingMode)
  console.log("[v0] Enhanced data gathered:", {
    hasCompanyWebsite: !!scrapedData.companyWebsite,
    hasLinkedInProfile: !!scrapedData.linkedinProfile,
    newsArticlesCount: scrapedData.newsArticles?.length || 0,
  })

  // Use AI to analyze and extract insights
  const prompt = `
You are an expert sales researcher. Analyze the following prospect data and provide actionable insights for cold email outreach.

Prospect Information:
- Name: ${prospect.firstName} ${prospect.lastName}
- Company: ${prospect.company}
- Job Title: ${prospect.jobTitle}
- LinkedIn: ${prospect.linkedinUrl || "Not provided"}
- Website: ${prospect.websiteUrl || "Not provided"}

Scraped Data:
${JSON.stringify(scrapedData, null, 2)}

Research Depth: ${depth}

Provide:
1. Company overview (2-3 sentences)
2. Recent news or developments (3-5 items)
3. Potential pain points this person might have (3-5 items)
4. Tools/competitors they likely use (3-5 items)
5. Specific talking points for personalized outreach (3-5 items)
6. Quality score (0-100) based on data completeness and relevance
7. Personalization tokens (key-value pairs for email templates)

Format your response as JSON.
`

  try {
    console.log("[v0] Calling OpenAI API for analysis...")
    console.log("[v0] Checking OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Present" : "MISSING")

    const { object } = await generateObject({
      model: "openai/gpt-4o-mini",
      prompt,
      schema: z.object({
        companyInfo: z.string(),
        recentNews: z.array(z.string()),
        painPoints: z.array(z.string()),
        competitorTools: z.array(z.string()),
        talkingPoints: z.array(z.string()),
        qualityScore: z.number(),
        personalizationTokens: z.record(z.string()),
      }),
    })

    console.log("[v0] AI research completed with quality score:", object.qualityScore)

    if (depth === "DEEP" && scrapedData.enhanced) {
      return {
        ...object,
        linkedInInsights: scrapedData.linkedInInsights,
        companyInsights: scrapedData.companyInsights,
        newsInsights: scrapedData.newsInsights,
      } as EnhancedResearchResult
    }

    return object as ResearchResult
  } catch (error) {
    console.error("[v0] AI research failed:", error)
    console.error("[v0] AI error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      cause: error instanceof Error ? (error as any).cause : undefined,
    })

    return {
      companyInfo: `${prospect.company} is a company in the ${prospect.jobTitle?.includes("Tech") ? "technology" : "business"} sector.`,
      recentNews: ["Company information not available - AI analysis failed"],
      painPoints: ["Scaling operations", "Improving efficiency", "Reducing costs"],
      competitorTools: ["Industry standard tools"],
      talkingPoints: [`Reach out regarding ${prospect.company}'s growth`],
      qualityScore: 50,
      personalizationTokens: {
        firstName: prospect.firstName || "",
        company: prospect.company || "",
        jobTitle: prospect.jobTitle || "",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    }
  }
}

async function gatherEnhancedData(prospect: ProspectData, mode: ScrapingMode): Promise<any> {
  console.log("[v0] Gathering enhanced data with mode:", mode)

  const results: any = {
    enhanced: mode === "DEEP",
    companyWebsite: null,
    linkedinProfile: null,
    newsArticles: [],
  }

  try {
    // Scrape company website
    if (prospect.websiteUrl) {
      console.log("[v0] Scraping company website:", prospect.websiteUrl)
      try {
        const companyData = await scrapeWebsiteEnhanced(prospect.websiteUrl, mode)
        results.companyWebsite = companyData
        console.log("[v0] Company website scraped successfully")

        if (mode === "DEEP" && "products" in companyData) {
          results.companyInsights = {
            products: companyData.products || [],
            pricing: companyData.pricing || "",
            teamSize: companyData.teamSize || "",
            hiringSignals: companyData.hiringSignals || [],
            techStack: companyData.techStack || [],
          }
        }
      } catch (error) {
        console.error("[v0] Company website scraping failed:", error)
      }
    }

    // Scrape LinkedIn profile
    if (prospect.linkedinUrl) {
      console.log("[v0] Scraping LinkedIn profile:", prospect.linkedinUrl)
      try {
        const linkedInData = await scrapeLinkedInProfileEnhanced(prospect.linkedinUrl, mode)
        results.linkedinProfile = linkedInData
        console.log("[v0] LinkedIn profile scraped successfully")

        if (mode === "DEEP" && "certifications" in linkedInData) {
          results.linkedInInsights = {
            certifications: linkedInData.certifications || [],
            recentActivity: linkedInData.recentActivity || [],
            connections: linkedInData.connections || 0,
          }
        }
      } catch (error) {
        console.error("[v0] LinkedIn scraping failed:", error)
      }
    }

    // Search news
    if (prospect.company) {
      console.log("[v0] Searching news for company:", prospect.company)
      try {
        const newsData = await searchCompanyNewsEnhanced(prospect.company, 5, mode)
        results.newsArticles = newsData
        console.log("[v0] Found", newsData.length, "news articles")

        if (mode === "DEEP" && newsData.length > 0 && "sentiment" in newsData[0]) {
          const sentiments = newsData.map((n: any) => n.sentiment).filter(Boolean)
          const hooks = newsData.flatMap((n: any) => n.personalizationHooks || [])
          results.newsInsights = {
            sentiment: sentiments[0] || "neutral",
            personalizationHooks: hooks,
          }
        }
      } catch (error) {
        console.error("[v0] News search failed:", error)
      }
    }

    console.log("[v0] Enhanced data gathering completed")
    return results
  } catch (error) {
    console.error("[v0] Enhanced data gathering error:", error)
    return results
  }
}

export async function batchResearchProspects(
  prospects: ProspectData[],
  depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
  onProgress?: (completed: number, total: number) => void,
  concurrency = 5, // Add concurrency parameter
): Promise<Map<string, ResearchResult | EnhancedResearchResult>> {
  console.log("[v0] Starting batch research for", prospects.length, "prospects")
  console.log("[v0] Using concurrency:", concurrency)

  const results = new Map<string, ResearchResult | EnhancedResearchResult>()
  let completed = 0

  for (let i = 0; i < prospects.length; i += concurrency) {
    const batch = prospects.slice(i, i + concurrency)
    console.log(`[v0] Processing batch ${Math.floor(i / concurrency) + 1}: ${batch.length} prospects`)

    const batchPromises = batch.map(async (prospect) => {
      try {
        const result = await researchProspect(prospect, depth)
        results.set(prospect.email, result)
        completed++

        if (onProgress) {
          onProgress(completed, prospects.length)
        }

        return { email: prospect.email, success: true }
      } catch (error) {
        console.error("[v0] Failed to research prospect:", prospect.email, error)
        completed++

        if (onProgress) {
          onProgress(completed, prospects.length)
        }

        return { email: prospect.email, success: false, error }
      }
    })

    await Promise.all(batchPromises)
    console.log(`[v0] Batch completed. Total progress: ${completed}/${prospects.length}`)
  }

  console.log("[v0] Batch research completed:", results.size, "successful out of", prospects.length)

  return results
}

export function calculateQualityScore(prospect: ProspectData, researchData?: any): number {
  let score = 0

  // Base score for having email
  score += 20

  // Score for basic info
  if (prospect.firstName && prospect.lastName) score += 10
  if (prospect.company) score += 15
  if (prospect.jobTitle) score += 15

  // Score for URLs
  if (prospect.linkedinUrl) score += 20
  if (prospect.websiteUrl) score += 10

  // Score for research data quality
  if (researchData) {
    if (researchData.recentNews?.length > 0) score += 5
    if (researchData.painPoints?.length > 0) score += 5
  }

  return Math.min(score, 100)
}

async function simulateWebScraping(prospect: ProspectData): Promise<any> {
  // Use actual web scraping - in production, integrate with services like:
  // - Apify for LinkedIn scraping
  // - Clearbit/Hunter for company data
  // - NewsAPI for recent news

  const results: any = {
    companyWebsite: null,
    linkedinProfile: null,
    newsArticles: [],
  }

  try {
    // Scrape company website if available
    if (prospect.websiteUrl) {
      // In production: Use Apify, Puppeteer, or similar
      // For now, we'll use basic fetch to get meta data
      const response = await fetch(prospect.websiteUrl, {
        headers: { "User-Agent": "Mozilla/5.0" },
      }).catch(() => null)

      if (response?.ok) {
        const html = await response.text()
        // Extract basic info from meta tags
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
        results.companyWebsite = {
          description: descMatch?.[1] || `${prospect.company} website`,
          products: [],
          recentBlogPosts: [],
        }
      }
    }

    // LinkedIn profile data
    if (prospect.linkedinUrl) {
      results.linkedinProfile = {
        headline: prospect.jobTitle || "Professional",
        experience: [{ company: prospect.company, title: prospect.jobTitle, duration: "Current" }],
        skills: [],
      }
    }

    // Search for news articles about the company
    if (prospect.company) {
      // In production: Use NewsAPI, Google News API, or similar
      results.newsArticles = []
    }

    return results
  } catch (error) {
    console.error("[v0] Web scraping error:", error)
    return results
  }
}
