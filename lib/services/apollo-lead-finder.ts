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
export async function searchLeadsWithApollo(params: ApolloSearchParams): Promise<{
  success: boolean
  leads?: ApolloLead[]
  error?: string
  totalResults?: number
}> {
  try {
    const apolloApiKey = process.env.APOLLO_API_KEY
    if (!apolloApiKey) {
      return { success: false, error: "Apollo.io API key not configured" }
    }

    // Build query parameters
    const queryParams = new URLSearchParams()

    if (params.jobTitles) {
      params.jobTitles.forEach((title) => {
        queryParams.append("person_titles[]", title)
      })
    }

    if (params.locations) {
      params.locations.forEach((loc) => {
        queryParams.append("person_locations[]", loc)
      })
    }

    if (params.keywords) {
      params.keywords.forEach((kw) => {
        queryParams.append("q_keywords", kw)
      })
    }

    queryParams.append("per_page", (params.perPage || 25).toString())

    // Call Apollo API
    const response = await fetch(`https://api.apollo.io/api/v1/mixed_people/search?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": apolloApiKey,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      return {
        success: false,
        error: errorData?.message || `Apollo API error: ${response.statusText}`,
      }
    }

    const data = await response.json()

    // Transform Apollo response to our format
    const leads: ApolloLead[] = (data.people || []).map((person: any) => ({
      id: person.id,
      firstName: person.first_name,
      lastName: person.last_name,
      email: person.email,
      title: person.title,
      company: {
        name: person.organization?.name,
        website: person.organization?.website_url,
        industry: person.organization?.industry,
        size: person.organization?.estimated_num_employees,
      },
      linkedinUrl: person.linkedin_url,
      location: person.city && person.state ? `${person.city}, ${person.state}` : person.state,
      phoneNumber: person.phone_numbers?.[0]?.raw_number,
    }))

    return {
      success: true,
      leads,
      totalResults: data.pagination?.total_entries || leads.length,
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
 */
export async function enrichLeadWithApollo(email: string): Promise<{
  success: boolean
  lead?: ApolloLead
  error?: string
}> {
  try {
    const apolloApiKey = process.env.APOLLO_API_KEY
    if (!apolloApiKey) {
      return { success: false, error: "Apollo.io API key not configured" }
    }

    const response = await fetch(`https://api.apollo.io/api/v1/people/match?email=${encodeURIComponent(email)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "x-api-key": apolloApiKey,
      },
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Enrichment failed: ${response.statusText}`,
      }
    }

    const data = await response.json()
    const person = data.person

    if (!person) {
      return { success: false, error: "No data found for this email" }
    }

    const lead: ApolloLead = {
      id: person.id,
      firstName: person.first_name,
      lastName: person.last_name,
      email: person.email,
      title: person.title,
      company: {
        name: person.organization?.name,
        website: person.organization?.website_url,
        industry: person.organization?.industry,
        size: person.organization?.estimated_num_employees,
      },
      linkedinUrl: person.linkedin_url,
      location: person.city && person.state ? `${person.city}, ${person.state}` : person.state,
      phoneNumber: person.phone_numbers?.[0]?.raw_number,
    }

    return { success: true, lead }
  } catch (error: any) {
    console.error("[Apollo Enrichment] Error:", error)
    return { success: false, error: error.message || "Enrichment failed" }
  }
}
