// interface ScrapedData {
//   title?: string
//   description?: string
//   content?: string
//   metadata?: Record<string, any>
// }

// export async function scrapeWebsite(url: string): Promise<ScrapedData> {
//   console.log("[v0] Scraping website:", url)

//   try {
//     // In production, this would use a web scraping service like:
//     // - Firecrawl API
//     // - ScrapingBee
//     // - Bright Data
//     // - Custom Puppeteer/Playwright setup

//     // For now, simulate scraping
//     await new Promise((resolve) => setTimeout(resolve, 500))

//     return {
//       title: "Company Website",
//       description: "Leading provider of innovative solutions",
//       content: "Sample content from the website...",
//       metadata: {
//         scrapedAt: new Date().toISOString(),
//         url,
//       },
//     }
//   } catch (error) {
//     console.error("[v0] Web scraping failed:", error)
//     throw new Error("Failed to scrape website")
//   }
// }

// export async function scrapeLinkedInProfile(url: string): Promise<any> {
//   console.log("[v0] Scraping LinkedIn profile:", url)

//   try {
//     // In production, use LinkedIn scraping API or service
//     await new Promise((resolve) => setTimeout(resolve, 500))

//     return {
//       name: "John Doe",
//       headline: "Head of Sales at TechCorp",
//       location: "San Francisco, CA",
//       experience: [
//         {
//           company: "TechCorp",
//           title: "Head of Sales",
//           duration: "2 years",
//         },
//       ],
//       skills: ["Sales", "Leadership", "Strategy"],
//     }
//   } catch (error) {
//     console.error("[v0] LinkedIn scraping failed:", error)
//     throw new Error("Failed to scrape LinkedIn profile")
//   }
// }

// export async function searchCompanyNews(companyName: string): Promise<any[]> {
//   console.log("[v0] Searching news for company:", companyName)

//   try {
//     // In production, use news API like:
//     // - NewsAPI
//     // - Google News API
//     // - Bing News API

//     await new Promise((resolve) => setTimeout(resolve, 500))

//     return [
//       {
//         title: `${companyName} announces new product launch`,
//         source: "TechCrunch",
//         date: "2024-12-15",
//         url: "https://example.com/news/1",
//       },
//       {
//         title: `${companyName} raises Series B funding`,
//         source: "VentureBeat",
//         date: "2024-11-20",
//         url: "https://example.com/news/2",
//       },
//     ]
//   } catch (error) {
//     console.error("[v0] News search failed:", error)
//     return []
//   }
// }

// export async function findCompetitorTools(companyWebsite: string): Promise<string[]> {
//   console.log("[v0] Finding competitor tools for:", companyWebsite)

//   try {
//     // In production, use tools like:
//     // - BuiltWith API
//     // - Wappalyzer API
//     // - SimilarTech API

//     await new Promise((resolve) => setTimeout(resolve, 500))

//     return ["Salesforce", "HubSpot", "Outreach", "LinkedIn Sales Navigator"]
//   } catch (error) {
//     console.error("[v0] Competitor tool detection failed:", error)
//     return []
//   }
// }



import { env } from "@/lib/env"

interface ScrapedData {
  title?: string
  description?: string
  content?: string
  metadata?: Record<string, any>
}

interface LinkedInProfile {
  name: string
  headline: string
  location?: string
  experience: Array<{
    company: string
    title: string
    duration: string
  }>
  skills: string[]
  about?: string
}

interface CompanyNews {
  title: string
  source: string
  date: string
  url: string
  snippet?: string
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  console.log("[v0] Scraping website:", url)

  try {
    // Use Firecrawl API for production web scrapin
    if (env.FIRECRAWL_API_KEY) {
      const response = await fetch("https://api.firecrawl.dev/v0/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
        },
        body: JSON.stringify({
          url,
          pageOptions: {
            onlyMainContent: true,
            includeHtml: false,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Firecrawl API error: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        title: data.data?.metadata?.title || "Company Website",
        description: data.data?.metadata?.description || "",
        content: data.data?.markdown || data.data?.content || "",
        metadata: {
          scrapedAt: new Date().toISOString(),
          url,
          ...data.data?.metadata,
        },
      }
    }

    // Fallback: Basic fetch for meta tags
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ReachAI/1.0; +https://reachai.com)",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const html = await response.text()

    // Extract meta tags
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)

    return {
      title: titleMatch?.[1] || "Company Website",
      description: descMatch?.[1] || ogDescMatch?.[1] || "",
      content: html.substring(0, 5000), // First 5000 chars
      metadata: {
        scrapedAt: new Date().toISOString(),
        url,
      },
    }
  } catch (error) {
    console.error("[v0] Web scraping failed:", error)
    throw new Error(`Failed to scrape website: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function scrapeLinkedInProfile(url: string): Promise<LinkedInProfile> {
  console.log("[v0] Scraping LinkedIn profile:", url)

  try {
    if (env.APIFY_API_KEY) {
      // Use Apify's LinkedIn Profile Scraper
      const response = await fetch(
        `https://api.apify.com/v2/acts/apify~linkedin-profile-scraper/run-sync-get-dataset-items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.APIFY_API_KEY}`,
          },
          body: JSON.stringify({
            startUrls: [{ url }],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Apify API error: ${response.statusText}`)
      }

      const data = await response.json()
      const profile = data[0]

      if (!profile) {
        throw new Error("No profile data returned")
      }

      return {
        name: profile.fullName || "Unknown",
        headline: profile.headline || "",
        location: profile.location || "",
        experience: (profile.positions || []).map((pos: any) => ({
          company: pos.companyName || "",
          title: pos.title || "",
          duration: pos.dateRange || "",
        })),
        skills: profile.skills || [],
        about: profile.summary || "",
      }
    }

    // Fallback: Return basic structure
    throw new Error("LinkedIn scraping requires Apify API key")
  } catch (error) {
    console.error("[v0] LinkedIn scraping failed:", error)
    throw new Error(`Failed to scrape LinkedIn profile: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function searchCompanyNews(companyName: string, limit = 5): Promise<CompanyNews[]> {
  console.log("[v0] Searching news for company:", companyName)

  try {
    if (env.NEWS_API_KEY) {
      const query = encodeURIComponent(companyName)
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=${limit}&language=en`,
        {
          headers: {
            "X-Api-Key": env.NEWS_API_KEY,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.statusText}`)
      }

      const data = await response.json()

      return (data.articles || []).map((article: any) => ({
        title: article.title,
        source: article.source?.name || "Unknown",
        date: article.publishedAt?.split("T")[0] || new Date().toISOString().split("T")[0],
        url: article.url,
        snippet: article.description || "",
      }))
    }

    // Fallback: Use Google News RSS (free but limited)
    const query = encodeURIComponent(companyName)
    const response = await fetch(`https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`)

    if (!response.ok) {
      throw new Error(`Google News RSS error: ${response.status}`)
    }

    const xml = await response.text()

    // Parse RSS XML (basic parsing)
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []

    return items.slice(0, limit).map((item) => {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
      const linkMatch = item.match(/<link>(.*?)<\/link>/)
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/)
      const sourceMatch = item.match(/<source[^>]*>(.*?)<\/source>/)

      return {
        title: titleMatch?.[1] || "News Article",
        source: sourceMatch?.[1] || "Google News",
        date: pubDateMatch?.[1]
          ? new Date(pubDateMatch[1]).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        url: linkMatch?.[1] || "",
        snippet: "",
      }
    })
  } catch (error) {
    console.error("[v0] News search failed:", error)
    return []
  }
}

export async function findCompetitorTools(companyWebsite: string): Promise<string[]> {
  console.log("[v0] Finding competitor tools for:", companyWebsite)

  try {
    if (env.BUILTWITH_API_KEY) {
      const domain = new URL(companyWebsite).hostname
      const response = await fetch(
        `https://api.builtwith.com/v20/api.json?KEY=${env.BUILTWITH_API_KEY}&LOOKUP=${domain}`,
      )

      if (!response.ok) {
        throw new Error(`BuiltWith API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Extract technology names
      const technologies: string[] = []
      if (data.Results?.[0]?.Result?.Paths?.[0]?.Technologies) {
        for (const tech of data.Results[0].Result.Paths[0].Technologies) {
          if (tech.Name) {
            technologies.push(tech.Name)
          }
        }
      }

      return technologies.slice(0, 10) // Return top 10
    }

    // Fallback: Basic detection from HTML
    const response = await fetch(companyWebsite, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ReachAI/1.0)",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const html = await response.text()
    const tools: string[] = []

    // Detect common tools from HTML
    const detectionPatterns = [
      { pattern: /salesforce/i, name: "Salesforce" },
      { pattern: /hubspot/i, name: "HubSpot" },
      { pattern: /intercom/i, name: "Intercom" },
      { pattern: /segment/i, name: "Segment" },
      { pattern: /google-analytics/i, name: "Google Analytics" },
      { pattern: /mixpanel/i, name: "Mixpanel" },
      { pattern: /stripe/i, name: "Stripe" },
      { pattern: /shopify/i, name: "Shopify" },
      { pattern: /wordpress/i, name: "WordPress" },
      { pattern: /wix/i, name: "Wix" },
    ]

    for (const { pattern, name } of detectionPatterns) {
      if (pattern.test(html)) {
        tools.push(name)
      }
    }

    return tools
  } catch (error) {
    console.error("[v0] Competitor tool detection failed:", error)
    return []
  }
}

export async function batchScrapeWebsites(
  urls: string[],
  onProgress?: (completed: number, total: number) => void,
): Promise<Map<string, ScrapedData>> {
  const results = new Map<string, ScrapedData>()
  const batchSize = 5 // Process 5 at a time
  const delayMs = 1000 // 1 second delay between batches

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize)

    const batchResults = await Promise.allSettled(batch.map((url) => scrapeWebsite(url)))

    batchResults.forEach((result, index) => {
      const url = batch[index]
      if (result.status === "fulfilled") {
        results.set(url, result.value)
      } else {
        console.error(`[v0] Failed to scrape ${url}:`, result.reason)
      }
    })

    if (onProgress) {
      onProgress(Math.min(i + batchSize, urls.length), urls.length)
    }

    // Rate limiting delay
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return results
}
