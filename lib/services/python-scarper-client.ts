/**
 * Python Scraper Service Client
 * Communicates with the Python scraper service from Next.js
 */

import { logger } from "@/lib/logger"

const SCRAPER_SERVICE_URL = process.env.SCRAPER_SERVICE_URL || "http://localhost:8000"
const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY || "your-secret-api-key-change-in-production"

export interface LinkedInProfile {
  name: string
  headline: string
  location: string | null
  current_company: string | null
  current_role: string | null
  experience: Array<{
    company: string
    title: string
    duration: string
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    year: string
  }>
  skills: string[]
  about: string | null
  recent_posts: Array<{
    text: string
    date: string
    engagement: string
  }>
  recommendations: number
  connections: string | null
  profile_strength: string
  screenshot_path: string | null
}

export interface CompanyIntelligence {
  company_name: string
  tagline: string
  industry: string
  products: string[]
  target_customers: string[]
  pain_points_solved: string[]
  pricing_model: string
  tech_stack: string[]
  team_size: string
  funding_stage: string
  recent_launches: string[]
  hiring_for: string[]
  competitors: string[]
  key_executives: string[]
  company_culture: string
  social_proof: string[]
  personalization_hooks: string[]
}

export interface NewsIntelligence {
  raw_intelligence: {
    recent_news: Array<{
      title: string
      link: string
      published: string
      source: string
    }>
    company_name: string
  }
  personalization_hooks: Array<{
    hook: string
    relevance: string
    example_line: string
  }>
}

export class PythonScraperClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = SCRAPER_SERVICE_URL
    this.apiKey = SCRAPER_API_KEY
  }

  /**
   * Check if the Python scraper service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        logger.warn("Python scraper service health check failed", {
          status: response.status,
        })
        return false
      }

      const data = await response.json()
      logger.info("Python scraper service is healthy", { version: data.version })
      return true
    } catch (error) {
      logger.error("Python scraper service health check error", error as Error, {
        baseUrl: this.baseUrl,
      })
      return false
    }
  }

  /**
   * Scrape LinkedIn profile with AI extraction
   */
  async scrapeLinkedInProfile(url: string, useAiExtraction = true, takeScreenshot = false): Promise<LinkedInProfile> {
    try {
      logger.info("Scraping LinkedIn profile via Python service", { url })

      const response = await fetch(`${this.baseUrl}/api/scrape/linkedin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({
          url,
          use_ai_extraction: useAiExtraction,
          take_screenshot: takeScreenshot,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "LinkedIn scraping failed")
      }

      const result = await response.json()
      logger.info("LinkedIn profile scraped successfully", {
        name: result.data.name,
      })

      return result.data
    } catch (error) {
      logger.error("LinkedIn scraping failed", error as Error, { url })
      throw error
    }
  }

  /**
   * Scrape company website with AI analysis
   */
  async scrapeCompanyWebsite(url: string): Promise<CompanyIntelligence> {
    try {
      logger.info("Scraping company website via Python service", { url })

      const response = await fetch(`${this.baseUrl}/api/scrape/company`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Company scraping failed")
      }

      const result = await response.json()
      logger.info("Company website scraped successfully", {
        company: result.data.company_name,
      })

      return result.data
    } catch (error) {
      logger.error("Company scraping failed", error as Error, { url })
      throw error
    }
  }

  /**
   * Get news intelligence for a company
   */
  async getNewsIntelligence(companyName: string): Promise<NewsIntelligence> {
    try {
      logger.info("Gathering news intelligence via Python service", {
        companyName,
      })

      const response = await fetch(`${this.baseUrl}/api/intelligence/news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({ company_name: companyName }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "News intelligence gathering failed")
      }

      const result = await response.json()
      logger.info("News intelligence gathered successfully", {
        hooksCount: result.data.personalization_hooks.length,
      })

      return result.data
    } catch (error) {
      logger.error("News intelligence gathering failed", error as Error, {
        companyName,
      })
      throw error
    }
  }
}

// Export singleton instance
export const pythonScraperClient = new PythonScraperClient()
