
"use server"

interface ApolloSearchParams {
  jobTitles?: string[]
  locations?: string[]
  industries?: string[]
  companySize?: string[]
  keywords?: string[]
  perPage?: number
}

interface ApolloLead {
  id: string
  firstName: string
  lastName: string
  email: string
  title: string
  company: {
    name: string
    website?: string
    industry?: string
    size?: string
  }
  linkedinUrl?: string
  location?: string
  phoneNumber?: string
}

/**
 * Search for leads using Apollo.io API
 */
/**
 * Search for leads using Apollo.io API
 * Docs: https://api.apollo.io/api/v1/mixed_people/api_search
 */
export async function searchLeadsWithApollo(params: ApolloSearchParams): Promise<{
  success: boolean
  leads?: ApolloLead[]
  error?: string
  totalResults?: number
}> {
  try {
    const apolloApiKey = process.env.APOLLO_API_KEY
    console.log("[Apollo Debug] Key loaded:", !!apolloApiKey, "Length:", apolloApiKey?.length, "Prefix:", apolloApiKey?.substring(0, 10))

    if (!apolloApiKey) {
      return { success: false, error: "Apollo.io API key not configured" }
    }

    // Build query parameters
    const requestBody: any = {
      page: 1, // Default to page 1
      per_page: params.perPage || 25,
      person_titles: params.jobTitles,
      person_locations: params.locations,
      q_keywords: params.keywords?.join(" "),
    }

    // Add company size filter if present (parsing "1-10", "11-50" etc)
    // if (params.companySize) { ... } - Apollo uses organization_num_employees_ranges

    // Call Apollo API - Using api_search as requested
    // Note: This endpoint accepts JSON body, not just query params, which is cleaner
    const response = await fetch("https://api.apollo.io/api/v1/mixed_people/api_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": apolloApiKey,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Apollo Debug] Error Status:", response.status, "Body:", errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        // Not JSON
      }

      return {
        success: false,
        error: errorData?.message || `Apollo API error: ${response.status} ${response.statusText} - ${errorText.substring(0, 100)}`,
      }
    }

    const data = await response.json()

    // Transform Apollo response to our format
    const peopleArray = data.people || data.contacts || data.results || []

    const leads: ApolloLead[] = peopleArray.map((person: any) => {
      // Handle nested company object or direct properties
      const companyData = person.organization || person.company || {}
      const companyName = companyData.name || person.company_name || "Unknown"

      // Handle different name formats
      const firstName = person.first_name || person.firstName || ""
      const lastName = person.last_name || person.lastName || ""

      // Handle different title formats
      const title = person.title || person.job_title || ""

      // Handle different location formats
      let location = ""
      if (person.city || person.state || person.country) {
        location = [person.city, person.state, person.country].filter(Boolean).join(", ")
      } else if (typeof person.location === "string") {
        location = person.location
      }

      return {
        id: person.id, // CRITICAL: This ID is needed for enrichment
        firstName,
        lastName,
        email: person.email || "", // Likely empty in api_search
        title,
        company: {
          name: companyName,
          website: companyData.website_url || companyData.website,
          industry: companyData.industry,
          size: companyData.employee_count?.toString() || companyData.estimated_num_employees?.toString(),
        },
        linkedinUrl: person.linkedin_url,
        location,
      }
    })

    // CRITICAL CHANGE: Do NOT filter by email existence.
    // The api_search endpoint deliberately DOES NOT return emails for new prospects.
    // We must return them so the user can select them -> then we "Reveal" (Expect cost).

    return {
      success: true,
      leads: leads,
      totalResults: data.pagination?.total_entries || data.total_entries || data.total || leads.length,
    }
  } catch (error: any) {
    console.error("[Apollo Lead Finder] Error:", error)
    return {
      success: false,
      error: error.message || "Failed to search leads",
    }
  }
}

/**
 * Enrich a single lead using Apollo.io
 * Now supports enriching by ID (preferred) or Email.
 */
export async function enrichLeadWithApollo(identifier: { email?: string; id?: string }): Promise<{
  success: boolean
  lead?: ApolloLead
  error?: string
}> {
  try {
    const apolloApiKey = process.env.APOLLO_API_KEY
    if (!apolloApiKey) {
      return { success: false, error: "Apollo.io API key not configured" }
    }

    // Docs: https://api.apollo.io/api/v1/people/match
    const requestBody: any = {
      reveal_personal_emails: true,
      reveal_phone_number: false, // Optional, costs extra
    }

    if (identifier.id) {
      requestBody.id = identifier.id
    } else if (identifier.email) {
      requestBody.email = identifier.email
    } else {
      return { success: false, error: "Must provide either ID or Email for enrichment" }
    }

    const response = await fetch("https://api.apollo.io/api/v1/people/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": apolloApiKey,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      // ... (error handling)
      const errorData = await response.json().catch(() => null)
      return {
        success: false,
        error: errorData?.message || `Enrichment failed: ${response.statusText}`,
      }
    }

    const data = await response.json()
    const person = data.person

    if (!person) {
      return { success: false, error: "No data found for this person" }
    }

    // Normalize enriched data
    const lead: ApolloLead = {
      id: person.id,
      firstName: person.first_name || identifier.email?.split('@')[0] || "Unknown", // Fallback
      lastName: person.last_name || "",
      email: person.email || identifier.email || "", // The revealed email!
      title: person.title || "",
      company: {
        name: person.organization?.name || person.organization_name || "Unknown",
        website: person.organization?.website_url || person.organization?.domain,
        industry: person.organization?.industry,
        size: person.organization?.estimated_num_employees,
      },
      linkedinUrl: person.linkedin_url,
      location: person.city ? `${person.city}, ${person.state || person.country}` : person.country,
      phoneNumber: person.phone_numbers?.[0]?.sanitized_number,
    }

    return { success: true, lead }
  } catch (error: any) {
    console.error("[Apollo Enrichment] Error:", error)
    return { success: false, error: error.message || "Enrichment failed" }
  }
}
