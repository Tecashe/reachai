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
//   console.log("[builtbycashe] Starting AI research for prospect:", prospect.email)

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
//     console.error("[builtbycashe] AI research failed:", error)
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
//   console.log("[builtbycashe] Starting batch research for", prospects.length, "prospects")

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
//       console.error("[builtbycashe] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[builtbycashe] Batch research completed:", results.size, "successful")

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
//   console.log("[builtbycashe] Starting AI research for prospect:", prospect.email)

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

//     console.log("[builtbycashe] AI research completed with quality score:", object.qualityScore)

//     return object as ResearchResult
//   } catch (error) {
//     console.error("[builtbycashe] AI research failed:", error)
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
//   console.log("[builtbycashe] Starting batch research for", prospects.length, "prospects")

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
//       console.error("[builtbycashe] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[builtbycashe] Batch research completed:", results.size, "successful")

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
//   console.log("[builtbycashe] Starting AI research for prospect:", prospect.email)

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

//     console.log("[builtbycashe] AI research completed with quality score:", object.qualityScore)

//     return object as ResearchResult
//   } catch (error) {
//     console.error("[builtbycashe] AI research failed:", error)
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
//     console.error("[builtbycashe] Web scraping error:", error)
//     return results
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
// ): Promise<Map<string, ResearchResult>> {
//   console.log("[builtbycashe] Starting batch research for", prospects.length, "prospects")

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
//       console.error("[builtbycashe] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[builtbycashe] Batch research completed:", results.size, "successful")

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
//   console.log("[builtbycashe] Starting AI research for prospect:", prospect.email)

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

//     console.log("[builtbycashe] AI research completed with quality score:", object.qualityScore)

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
//     console.error("[builtbycashe] AI research failed:", error)
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
//     console.error("[builtbycashe] Enhanced data gathering error:", error)
//     return results
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
// ): Promise<Map<string, ResearchResult | EnhancedResearchResult>> {
//   console.log("[builtbycashe] Starting batch research for", prospects.length, "prospects")

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
//       console.error("[builtbycashe] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[builtbycashe] Batch research completed:", results.size, "successful")

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
//     console.error("[builtbycashe] Web scraping error:", error)
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
//   console.log("[builtbycashe] Starting AI research for prospect:", prospect.email)
//   console.log("[builtbycashe] Research depth:", depth)
//   console.log("[builtbycashe] Prospect data:", {
//     hasFirstName: !!prospect.firstName,
//     hasLastName: !!prospect.lastName,
//     hasCompany: !!prospect.company,
//     hasJobTitle: !!prospect.jobTitle,
//     hasLinkedIn: !!prospect.linkedinUrl,
//     hasWebsite: !!prospect.websiteUrl,
//   })

//   const scrapingMode: ScrapingMode = depth === "DEEP" ? "DEEP" : "FAST"

//   console.log("[builtbycashe] Gathering enhanced data...")
//   const scrapedData = await gatherEnhancedData(prospect, scrapingMode)
//   console.log("[builtbycashe] Enhanced data gathered:", {
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
//     console.log("[builtbycashe] Calling OpenAI API for analysis...")
//     console.log("[builtbycashe] Checking OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Present" : "MISSING")

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

//     console.log("[builtbycashe] AI research completed with quality score:", object.qualityScore)

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
//     console.error("[builtbycashe] AI research failed:", error)
//     console.error("[builtbycashe] AI error details:", {
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
//   console.log("[builtbycashe] Gathering enhanced data with mode:", mode)

//   const results: any = {
//     enhanced: mode === "DEEP",
//     companyWebsite: null,
//     linkedinProfile: null,
//     newsArticles: [],
//   }

//   try {
//     // Scrape company website
//     if (prospect.websiteUrl) {
//       console.log("[builtbycashe] Scraping company website:", prospect.websiteUrl)
//       try {
//         const companyData = await scrapeWebsiteEnhanced(prospect.websiteUrl, mode)
//         results.companyWebsite = companyData
//         console.log("[builtbycashe] Company website scraped successfully")

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
//         console.error("[builtbycashe] Company website scraping failed:", error)
//       }
//     }

//     // Scrape LinkedIn profile
//     if (prospect.linkedinUrl) {
//       console.log("[builtbycashe] Scraping LinkedIn profile:", prospect.linkedinUrl)
//       try {
//         const linkedInData = await scrapeLinkedInProfileEnhanced(prospect.linkedinUrl, mode)
//         results.linkedinProfile = linkedInData
//         console.log("[builtbycashe] LinkedIn profile scraped successfully")

//         if (mode === "DEEP" && "certifications" in linkedInData) {
//           results.linkedInInsights = {
//             certifications: linkedInData.certifications || [],
//             recentActivity: linkedInData.recentActivity || [],
//             connections: linkedInData.connections || 0,
//           }
//         }
//       } catch (error) {
//         console.error("[builtbycashe] LinkedIn scraping failed:", error)
//       }
//     }

//     // Search news
//     if (prospect.company) {
//       console.log("[builtbycashe] Searching news for company:", prospect.company)
//       try {
//         const newsData = await searchCompanyNewsEnhanced(prospect.company, 5, mode)
//         results.newsArticles = newsData
//         console.log("[builtbycashe] Found", newsData.length, "news articles")

//         if (mode === "DEEP" && newsData.length > 0 && "sentiment" in newsData[0]) {
//           const sentiments = newsData.map((n: any) => n.sentiment).filter(Boolean)
//           const hooks = newsData.flatMap((n: any) => n.personalizationHooks || [])
//           results.newsInsights = {
//             sentiment: sentiments[0] || "neutral",
//             personalizationHooks: hooks,
//           }
//         }
//       } catch (error) {
//         console.error("[builtbycashe] News search failed:", error)
//       }
//     }

//     console.log("[builtbycashe] Enhanced data gathering completed")
//     return results
//   } catch (error) {
//     console.error("[builtbycashe] Enhanced data gathering error:", error)
//     return results
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
// ): Promise<Map<string, ResearchResult | EnhancedResearchResult>> {
//   console.log("[builtbycashe] Starting batch research for", prospects.length, "prospects")

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
//       console.error("[builtbycashe] Failed to research prospect:", prospect.email, error)
//     }
//   }

//   console.log("[builtbycashe] Batch research completed:", results.size, "successful")

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
//     console.error("[builtbycashe] Web scraping error:", error)
//     return results
//   }
// }



    
  


// import { createOpenAI } from '@ai-sdk/openai'
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
//   console.log("[builtbycashe] Starting AI research for prospect:", prospect.email)
//   console.log("[builtbycashe] Research depth:", depth)
//   console.log("[builtbycashe] Prospect data:", {
//     hasFirstName: !!prospect.firstName,
//     hasLastName: !!prospect.lastName,
//     hasCompany: !!prospect.company,
//     hasJobTitle: !!prospect.jobTitle,
//     hasLinkedIn: !!prospect.linkedinUrl,
//     hasWebsite: !!prospect.websiteUrl,
//   })

//   const scrapingMode: ScrapingMode = depth === "DEEP" ? "DEEP" : "FAST"

//   console.log("[builtbycashe] Gathering enhanced data...")
//   const scrapedData = await gatherEnhancedData(prospect, scrapingMode)
//   console.log("[builtbycashe] Enhanced data gathered:", {
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
//     console.log("[builtbycashe] Calling OpenAI API for analysis...")
//     console.log("[builtbycashe] Checking OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Present" : "MISSING")

//     // const { object } = await generateObject({
//     //   model: "openai/gpt-4o-mini",
//     //   prompt,
//     //   schema: z.object({
//     //     companyInfo: z.string(),
//     //     recentNews: z.array(z.string()),
//     //     painPoints: z.array(z.string()),
//     //     competitorTools: z.array(z.string()),
//     //     talkingPoints: z.array(z.string()),
//     //     qualityScore: z.number(),
//     //     personalizationTokens: z.record(z.string()),
//     //   }),
//     // })
   




//     // Creatinng a custom DeepSeek provider
//     const deepseek = createOpenAI({
//       baseURL: 'https://api.deepseek.com/v1',
//       apiKey: process.env.DEEPSEEK_API_KEY,
//     })

    
//     const { object } = await generateObject({
//       model: deepseek('deepseek-chat'),  // Use the custom provider
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
//     console.log("[builtbycashe] AI research completed with quality score:", object.qualityScore)

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
//     console.error("[builtbycashe] AI research failed:", error)
//     console.error("[builtbycashe] AI error details:", {
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
//   console.log("[builtbycashe] Gathering enhanced data with mode:", mode)

//   const results: any = {
//     enhanced: mode === "DEEP",
//     companyWebsite: null,
//     linkedinProfile: null,
//     newsArticles: [],
//   }

//   try {
//     // Scrape company website
//     if (prospect.websiteUrl) {
//       console.log("[builtbycashe] Scraping company website:", prospect.websiteUrl)
//       try {
//         const companyData = await scrapeWebsiteEnhanced(prospect.websiteUrl, mode)
//         results.companyWebsite = companyData
//         console.log("[builtbycashe] Company website scraped successfully")

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
//         console.error("[builtbycashe] Company website scraping failed:", error)
//       }
//     }

//     // Scrape LinkedIn profile
//     if (prospect.linkedinUrl) {
//       console.log("[builtbycashe] Scraping LinkedIn profile:", prospect.linkedinUrl)
//       try {
//         const linkedInData = await scrapeLinkedInProfileEnhanced(prospect.linkedinUrl, mode)
//         results.linkedinProfile = linkedInData
//         console.log("[builtbycashe] LinkedIn profile scraped successfully")

//         if (mode === "DEEP" && "certifications" in linkedInData) {
//           results.linkedInInsights = {
//             certifications: linkedInData.certifications || [],
//             recentActivity: linkedInData.recentActivity || [],
//             connections: linkedInData.connections || 0,
//           }
//         }
//       } catch (error) {
//         console.error("[builtbycashe] LinkedIn scraping failed:", error)
//       }
//     }

//     // Search news
//     if (prospect.company) {
//       console.log("[builtbycashe] Searching news for company:", prospect.company)
//       try {
//         const newsData = await searchCompanyNewsEnhanced(prospect.company, 5, mode)
//         results.newsArticles = newsData
//         console.log("[builtbycashe] Found", newsData.length, "news articles")

//         if (mode === "DEEP" && newsData.length > 0 && "sentiment" in newsData[0]) {
//           const sentiments = newsData.map((n: any) => n.sentiment).filter(Boolean)
//           const hooks = newsData.flatMap((n: any) => n.personalizationHooks || [])
//           results.newsInsights = {
//             sentiment: sentiments[0] || "neutral",
//             personalizationHooks: hooks,
//           }
//         }
//       } catch (error) {
//         console.error("[builtbycashe] News search failed:", error)
//       }
//     }

//     console.log("[builtbycashe] Enhanced data gathering completed")
//     return results
//   } catch (error) {
//     console.error("[builtbycashe] Enhanced data gathering error:", error)
//     return results
//   }
// }

// export async function batchResearchProspects(
//   prospects: ProspectData[],
//   depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
//   onProgress?: (completed: number, total: number) => void,
//   concurrency = 5, // Add concurrency parameter
// ): Promise<Map<string, ResearchResult | EnhancedResearchResult>> {
//   console.log("[builtbycashe] Starting batch research for", prospects.length, "prospects")
//   console.log("[builtbycashe] Using concurrency:", concurrency)

//   const results = new Map<string, ResearchResult | EnhancedResearchResult>()
//   let completed = 0

//   for (let i = 0; i < prospects.length; i += concurrency) {
//     const batch = prospects.slice(i, i + concurrency)
//     console.log(`[builtbycashe] Processing batch ${Math.floor(i / concurrency) + 1}: ${batch.length} prospects`)

//     const batchPromises = batch.map(async (prospect) => {
//       try {
//         const result = await researchProspect(prospect, depth)
//         results.set(prospect.email, result)
//         completed++

//         if (onProgress) {
//           onProgress(completed, prospects.length)
//         }

//         return { email: prospect.email, success: true }
//       } catch (error) {
//         console.error("[builtbycashe] Failed to research prospect:", prospect.email, error)
//         completed++

//         if (onProgress) {
//           onProgress(completed, prospects.length)
//         }

//         return { email: prospect.email, success: false, error }
//       }
//     })

//     await Promise.all(batchPromises)
//     console.log(`[builtbycashe] Batch completed. Total progress: ${completed}/${prospects.length}`)
//   }

//   console.log("[builtbycashe] Batch research completed:", results.size, "successful out of", prospects.length)

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
//     console.error("[builtbycashe] Web scraping error:", error)
//     return results
//   }
// }


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

// Add type guards for better type safety
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return isObject(obj) && key in obj
}

// Cache for scraped data to avoid re-scraping
const scrapeCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

function getCachedData(key: string): any | null {
  const cached = scrapeCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("[builtbycashe] Using cached data for:", key)
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any): void {
  scrapeCache.set(key, { data, timestamp: Date.now() })
}

export async function researchProspect(
  prospect: ProspectData,
  depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
): Promise<ResearchResult | EnhancedResearchResult> {
  console.log("[builtbycashe] Starting AI research for prospect:", prospect.email)
  console.log("[builtbycashe] Research depth:", depth)

  const scrapingMode: ScrapingMode = depth === "DEEP" ? "DEEP" : "FAST"

  console.log("[builtbycashe] Gathering enhanced data...")
  const scrapedData = await gatherEnhancedData(prospect, scrapingMode)
  console.log("[builtbycashe] Enhanced data gathered successfully")

  // Build a concise, efficient prompt
  const prompt = buildEfficientPrompt(prospect, scrapedData, depth)

  try {
    console.log("[builtbycashe] Calling DeepSeek API for analysis...")

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a sales research AI. Respond with valid JSON only. Be concise and actionable.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1200,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    const object = JSON.parse(content)

    // Validate the response structure
    if (!object.companyInfo || typeof object.qualityScore !== "number") {
      throw new Error("Invalid response structure from DeepSeek")
    }

    console.log("[builtbycashe] AI research completed with quality score:", object.qualityScore)
    console.log("[builtbycashe] DeepSeek tokens used:", data.usage?.total_tokens || "unknown")

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
    console.error("[builtbycashe] AI research failed:", error)

    // Return graceful fallback with available data
    return createFallbackResult(prospect, scrapedData, error)
  }
}

function buildEfficientPrompt(prospect: ProspectData, scrapedData: any, depth: string): string {
  // Build a much more concise prompt to reduce tokens and processing time
  const companyData = scrapedData.companyWebsite
    ? `Company: ${JSON.stringify(scrapedData.companyWebsite).slice(0, 500)}`
    : "No company data"

  const linkedInData = scrapedData.linkedinProfile
    ? `LinkedIn: ${JSON.stringify(scrapedData.linkedinProfile).slice(0, 300)}`
    : "No LinkedIn data"

  const newsData =
    scrapedData.newsArticles?.length > 0
      ? `News: ${scrapedData.newsArticles
          .slice(0, 3)
          .map((n: any) => n.title || n.headline)
          .join("; ")}`
      : "No recent news"

  return `Analyze this prospect for cold email outreach:

Name: ${prospect.firstName} ${prospect.lastName}
Company: ${prospect.company}
Title: ${prospect.jobTitle}

${companyData}
${linkedInData}
${newsData}

Return JSON with:
- companyInfo (2 sentences max)
- recentNews (array of 3 strings)
- painPoints (array of 3 strings)
- competitorTools (array of 3 strings)
- talkingPoints (array of 3 strings)
- qualityScore (0-100 number)
- personalizationTokens (object with firstName, company, jobTitle, and 2-3 custom fields)

Be concise and specific.`
}

function createFallbackResult(
  prospect: ProspectData,
  scrapedData: any,
  error: unknown,
): ResearchResult {
  console.log("[builtbycashe] Creating fallback result with available data")
  
  // Log error message safely
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.log("[builtbycashe] Fallback reason:", errorMessage)

  // Use whatever data we have to create a basic result
  const hasCompanyData = !!scrapedData.companyWebsite
  const hasLinkedInData = !!scrapedData.linkedinProfile
  const hasNewsData = scrapedData.newsArticles?.length > 0

  let qualityScore = 30
  if (hasCompanyData) qualityScore += 20
  if (hasLinkedInData) qualityScore += 20
  if (hasNewsData) qualityScore += 15

  return {
    companyInfo: `${prospect.company} is a ${prospect.jobTitle?.includes("Tech") ? "technology" : "business"} company. ${hasCompanyData ? "Company website available for review." : "Limited public information available."}`,
    recentNews: hasNewsData
      ? scrapedData.newsArticles.slice(0, 3).map((n: any) => n.title || n.headline || "Industry news")
      : ["Limited recent news available"],
    painPoints: [
      "Scaling operations efficiently",
      "Improving team productivity",
      "Staying competitive in the market",
    ],
    competitorTools: ["Industry standard solutions", "Enterprise software platforms"],
    talkingPoints: [
      `Connect with ${prospect.firstName} about ${prospect.company}'s growth`,
      `Discuss solutions for ${prospect.jobTitle} challenges`,
      `Explore opportunities for collaboration`,
    ],
    qualityScore,
    personalizationTokens: {
      firstName: prospect.firstName || "",
      lastName: prospect.lastName || "",
      company: prospect.company || "",
      jobTitle: prospect.jobTitle || "",
      hasData: hasCompanyData || hasLinkedInData ? "yes" : "limited",
    },
  }
}

async function gatherEnhancedData(prospect: ProspectData, mode: ScrapingMode): Promise<any> {
  console.log("[builtbycashe] Gathering enhanced data with mode:", mode)

  const results: any = {
    enhanced: mode === "DEEP",
    companyWebsite: null,
    linkedinProfile: null,
    newsArticles: [],
  }

  // Reduced timeouts for faster failure
  const SCRAPE_TIMEOUT = 15000 // 15 seconds
  const promises: Promise<void>[] = []

  // Scrape company website with timeout and caching
  if (prospect.websiteUrl) {
    const cacheKey = `website:${prospect.websiteUrl}`
    const cached = getCachedData(cacheKey)

    if (cached) {
      results.companyWebsite = cached
      console.log("[builtbycashe] Using cached company website data")
    } else {
      promises.push(
        (async () => {
          try {
            console.log("[builtbycashe] Scraping company website:", prospect.websiteUrl)
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Website scrape timeout")), SCRAPE_TIMEOUT),
            )

            const scrapePromise = scrapeWebsiteEnhanced(prospect.websiteUrl!, mode)
            const companyData = await Promise.race([scrapePromise, timeoutPromise])

            results.companyWebsite = companyData
            setCachedData(cacheKey, companyData)
            console.log("[builtbycashe] Company website scraped successfully")

            // Use type guard instead of 'in' operator
            if (mode === "DEEP" && isObject(companyData) && hasProperty(companyData, "products")) {
              results.companyInsights = {
                products: Array.isArray(companyData.products) ? companyData.products : [],
                pricing: hasProperty(companyData, "pricing") && typeof companyData.pricing === "string" ? companyData.pricing : "",
                teamSize: hasProperty(companyData, "teamSize") && typeof companyData.teamSize === "string" ? companyData.teamSize : "",
                hiringSignals: hasProperty(companyData, "hiringSignals") && Array.isArray(companyData.hiringSignals) ? companyData.hiringSignals : [],
                techStack: hasProperty(companyData, "techStack") && Array.isArray(companyData.techStack) ? companyData.techStack : [],
              }
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.warn("[builtbycashe] Company website scraping failed (continuing anyway):", errorMessage)
            results.companyWebsite = null
          }
        })(),
      )
    }
  }

  // Scrape LinkedIn profile with timeout and caching
  if (prospect.linkedinUrl) {
    const cacheKey = `linkedin:${prospect.linkedinUrl}`
    const cached = getCachedData(cacheKey)

    if (cached) {
      results.linkedinProfile = cached
      console.log("[builtbycashe] Using cached LinkedIn data")
    } else {
      promises.push(
        (async () => {
          try {
            console.log("[builtbycashe] Scraping LinkedIn profile:", prospect.linkedinUrl)
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("LinkedIn scrape timeout")), SCRAPE_TIMEOUT),
            )

            const scrapePromise = scrapeLinkedInProfileEnhanced(prospect.linkedinUrl!, mode)
            const linkedInData = await Promise.race([scrapePromise, timeoutPromise])

            results.linkedinProfile = linkedInData
            setCachedData(cacheKey, linkedInData)
            console.log("[builtbycashe] LinkedIn profile scraped successfully")

            // Use type guard instead of 'in' operator
            if (mode === "DEEP" && isObject(linkedInData) && hasProperty(linkedInData, "certifications")) {
              results.linkedInInsights = {
                certifications: Array.isArray(linkedInData.certifications) ? linkedInData.certifications : [],
                recentActivity: hasProperty(linkedInData, "recentActivity") && Array.isArray(linkedInData.recentActivity) ? linkedInData.recentActivity : [],
                connections: hasProperty(linkedInData, "connections") && typeof linkedInData.connections === "number" ? linkedInData.connections : 0,
              }
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.warn("[builtbycashe] LinkedIn scraping failed (continuing anyway):", errorMessage)
            results.linkedinProfile = null
          }
        })(),
      )
    }
  }

  // Search news with timeout and caching
  if (prospect.company) {
    const cacheKey = `news:${prospect.company}`
    const cached = getCachedData(cacheKey)

    if (cached) {
      results.newsArticles = cached
      console.log("[builtbycashe] Using cached news data")
    } else {
      promises.push(
        (async () => {
          try {
            console.log("[builtbycashe] Searching news for company:", prospect.company)
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("News search timeout")), 10000),
            )

            const newsPromise = searchCompanyNewsEnhanced(prospect.company!, 3, mode)
            const newsData = await Promise.race([newsPromise, timeoutPromise])

            results.newsArticles = newsData
            setCachedData(cacheKey, newsData)
            // console.log("[builtbycashe] Found", newsData.length, "news articles")

            // Use type guard and check if array has items
            if (mode === "DEEP" && Array.isArray(newsData) && newsData.length > 0) {
              const firstItem = newsData[0]
              if (isObject(firstItem) && hasProperty(firstItem, "sentiment")) {
                const sentiments = newsData
                  .map((n: any) => isObject(n) && hasProperty(n, "sentiment") ? n.sentiment : null)
                  .filter((s): s is string => typeof s === "string")
                
                const hooks = newsData.flatMap((n: any) => 
                  isObject(n) && hasProperty(n, "personalizationHooks") && Array.isArray(n.personalizationHooks) 
                    ? n.personalizationHooks 
                    : []
                )
                
                results.newsInsights = {
                  sentiment: sentiments[0] || "neutral",
                  personalizationHooks: hooks,
                }
              }
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            console.warn("[builtbycashe] News search failed (continuing anyway):", errorMessage)
            results.newsArticles = []
          }
        })(),
      )
    }
  }

  // Wait for all scraping operations to complete (or timeout)
  await Promise.allSettled(promises)

  console.log("[builtbycashe] Enhanced data gathering completed:", {
    hasCompanyData: !!results.companyWebsite,
    hasLinkedInData: !!results.linkedinProfile,
    newsCount: results.newsArticles?.length || 0,
  })

  return results
}

export async function batchResearchProspects(
  prospects: ProspectData[],
  depth: "BASIC" | "STANDARD" | "DEEP" = "STANDARD",
  onProgress?: (completed: number, total: number, successful: number, failed: number) => void,
  concurrency = 3,
): Promise<Map<string, ResearchResult | EnhancedResearchResult>> {
  console.log("[builtbycashe] Starting batch research for", prospects.length, "prospects")
  console.log("[builtbycashe] Using concurrency:", concurrency)

  const results = new Map<string, ResearchResult | EnhancedResearchResult>()
  let completed = 0
  let successful = 0
  let failed = 0

  for (let i = 0; i < prospects.length; i += concurrency) {
    const batch = prospects.slice(i, i + concurrency)
    console.log(
      `[builtbycashe] Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(prospects.length / concurrency)}: ${batch.length} prospects`,
    )

    const batchPromises = batch.map(async (prospect) => {
      const startTime = Date.now()
      try {
        const result = await researchProspect(prospect, depth)
        results.set(prospect.email, result)
        completed++
        successful++

        const duration = ((Date.now() - startTime) / 1000).toFixed(1)
        console.log(
          `[builtbycashe] ✓ Researched ${prospect.email} in ${duration}s (score: ${result.qualityScore})`,
        )

        if (onProgress) {
          onProgress(completed, prospects.length, successful, failed)
        }

        return { email: prospect.email, success: true, result }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`[builtbycashe] ✗ Failed to research ${prospect.email}:`, errorMessage)
        completed++
        failed++

        // Still create a basic fallback result so we don't lose the prospect
        const fallbackResult = createFallbackResult(prospect, {}, error)
        results.set(prospect.email, fallbackResult)

        if (onProgress) {
          onProgress(completed, prospects.length, successful, failed)
        }

        return { email: prospect.email, success: false, error, result: fallbackResult }
      }
    })

    await Promise.allSettled(batchPromises)

    // Add a small delay between batches to avoid overwhelming the API
    if (i + concurrency < prospects.length) {
      console.log("[builtbycashe] Waiting 1s before next batch...")
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log(
      `[builtbycashe] Batch completed. Progress: ${completed}/${prospects.length} (${successful} successful, ${failed} failed)`,
    )
  }

  console.log("[builtbycashe] ✓ Batch research completed:", {
    total: prospects.length,
    successful,
    failed,
    successRate: `${((successful / prospects.length) * 100).toFixed(1)}%`,
  })

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