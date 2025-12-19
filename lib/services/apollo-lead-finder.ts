
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
    const peopleArray = data.people || data.contacts || data.results || []

    const leads: ApolloLead[] = peopleArray.map((person: any) => {
      // Handle nested company object or direct properties
      const companyData = person.organization || person.company || person.organization_name || {}
      const companyName =
        typeof companyData === "string"
          ? companyData
          : companyData.name || companyData.organization_name || person.company_name || "Unknown"

      // Handle different email formats
      const email = person.email || person.primary_email || person.work_email || person.email_address || ""

      // Handle different name formats
      const firstName = person.first_name || person.firstName || person.given_name || ""
      const lastName = person.last_name || person.lastName || person.family_name || person.surname || ""

      // Handle different title formats
      const title = person.title || person.job_title || person.position || person.headline || ""

      // Handle different location formats
      let location = ""
      if (person.location) {
        location = typeof person.location === "string" ? person.location : person.location.name
      } else if (person.city || person.state) {
        location = [person.city, person.state].filter(Boolean).join(", ")
      } else if (person.country) {
        location = person.country
      }

      // Handle different phone formats
      const phoneNumber =
        person.phone_number ||
        person.phoneNumber ||
        person.phone ||
        person.mobile_phone ||
        (person.phone_numbers && person.phone_numbers.length > 0
          ? person.phone_numbers[0].raw_number || person.phone_numbers[0].sanitized_number || person.phone_numbers[0]
          : undefined)

      return {
        id: person.id || person.apollo_id || `${firstName}-${lastName}-${Date.now()}`,
        firstName,
        lastName,
        email,
        title,
        company: {
          name: companyName,
          website: companyData.website_url || companyData.website || companyData.domain || person.company_website,
          industry: companyData.industry || companyData.primary_industry || person.industry,
          size:
            companyData.estimated_num_employees ||
            companyData.employee_count ||
            companyData.size ||
            person.company_size,
        },
        linkedinUrl: person.linkedin_url || person.linkedinUrl || person.linkedin || person.linkedin_profile_url,
        location,
        phoneNumber,
      }
    })

    const validLeads = leads.filter((lead) => lead.email && lead.email.trim() !== "")

    return {
      success: true,
      leads: validLeads,
      totalResults: data.pagination?.total_entries || data.total || data.count || validLeads.length,
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
      id: person.id || person.apollo_id || `${person.first_name}-${person.last_name}-${Date.now()}`,
      firstName: person.first_name || person.firstName || person.given_name || "",
      lastName: person.last_name || person.lastName || person.family_name || person.surname || "",
      email: person.email || person.primary_email || person.work_email || person.email_address || "",
      title: person.title || person.job_title || person.position || person.headline || "",
      company: {
        name:
          person.organization?.name ||
          person.company?.name ||
          person.organization_name ||
          person.company_name ||
          "Unknown",
        website:
          person.organization?.website_url ||
          person.company?.website ||
          person.organization?.domain ||
          person.company_website,
        industry:
          person.organization?.industry ||
          person.company?.industry ||
          person.organization?.primary_industry ||
          person.industry,
        size:
          person.organization?.estimated_num_employees ||
          person.company?.employee_count ||
          person.organization?.size ||
          person.company_size,
      },
      linkedinUrl: person.linkedin_url || person.linkedinUrl || person.linkedin || person.linkedin_profile_url,
      location: person.location?.name || [person.city, person.state].filter(Boolean).join(", ") || person.country || "",
      phoneNumber:
        person.phone_number ||
        person.phoneNumber ||
        person.phone ||
        person.mobile_phone ||
        (person.phone_numbers && person.phone_numbers.length > 0
          ? person.phone_numbers[0].raw_number || person.phone_numbers[0].sanitized_number || person.phone_numbers[0]
          : undefined),
    }

    return { success: true, lead }
  } catch (error: any) {
    console.error("[Apollo Enrichment] Error:", error)
    return { success: false, error: error.message || "Enrichment failed" }
  }
}
