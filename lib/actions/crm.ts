// "use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"

// Types
export type CRMType = "hubspot" | "salesforce" | "pipedrive"

interface CRMCredentials {
  accessToken: string
  refreshToken: string
  expiresAt: number
  instanceUrl?: string
}

interface CRMDeal {
  id: string
  name: string
  amount: number
  stage: string
  probability: number
  closeDate: string
  contactId?: string
  contactEmail?: string
  contactName?: string
}

interface CRMLead {
  id: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  jobTitle?: string
  phone?: string
  source?: string
  status?: string
}

function parseCredentials(credentials: Prisma.JsonValue): CRMCredentials | null {
  if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) {
    return null
  }
  const creds = credentials as Record<string, unknown>
  if (
    typeof creds.accessToken === "string" &&
    typeof creds.refreshToken === "string" &&
    typeof creds.expiresAt === "number"
  ) {
    return {
      accessToken: creds.accessToken,
      refreshToken: creds.refreshToken,
      expiresAt: creds.expiresAt,
      instanceUrl: typeof creds.instanceUrl === "string" ? creds.instanceUrl : undefined,
    }
  }
  return null
}

// Get CRM integration status
export async function getCRMIntegration() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const integration = await db.integration.findFirst({
      where: {
        userId: user.id,
        type: { in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"] },
        isActive: true,
      },
      select: {
        id: true,
        type: true,
        name: true,
        isActive: true,
        lastSyncedAt: true,
        settings: true,
        createdAt: true,
      },
    })

    if (!integration) {
      return { success: true, data: null }
    }

    // Get sync stats
    const [totalLeads, syncedLeads, dealsWithScores] = await Promise.all([
      db.prospect.count({ where: { userId: user.id } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null } } }),
      db.prospect.count({ where: { userId: user.id, dealScore: { not: null } } }),
    ])

    return {
      success: true,
      data: {
        ...integration,
        stats: {
          totalLeads,
          syncedLeads,
          dealsWithScores,
          syncPercentage: totalLeads > 0 ? Math.round((syncedLeads / totalLeads) * 100) : 0,
        },
      },
    }
  } catch (error) {
    console.error("[CRM] Get integration error:", error)
    return { success: false, error: "Failed to get CRM integration" }
  }
}

// Initialize OAuth flow
export async function initiateCRMConnection(crmType: CRMType) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const redirectUri = `${baseUrl}/api/integrations/crm/callback`
  const state = Buffer.from(JSON.stringify({ clerkId: userId, crmType, timestamp: Date.now() })).toString("base64url")

  let authUrl: string

  switch (crmType) {
    case "hubspot":
      const hubspotClientId = process.env.HUBSPOT_CLIENT_ID
      if (!hubspotClientId) return { success: false, error: "HubSpot not configured" }

      const hubspotScopes = [
        "crm.objects.contacts.read",
        "crm.objects.contacts.write",
        "crm.objects.deals.read",
        "crm.objects.deals.write",
        "crm.objects.companies.read",
      ].join(" ")

      authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${hubspotClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(hubspotScopes)}&state=${state}`
      break

    case "salesforce":
      const salesforceClientId = process.env.SALESFORCE_CLIENT_ID
      if (!salesforceClientId) return { success: false, error: "Salesforce not configured" }

      authUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${salesforceClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
      break

    case "pipedrive":
      const pipedriveClientId = process.env.PIPEDRIVE_CLIENT_ID
      if (!pipedriveClientId) return { success: false, error: "Pipedrive not configured" }

      authUrl = `https://oauth.pipedrive.com/oauth/authorize?client_id=${pipedriveClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
      break

    default:
      return { success: false, error: "Invalid CRM type" }
  }

  return { success: true, authUrl }
}

// Disconnect CRM
export async function disconnectCRM() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    await db.integration.updateMany({
      where: {
        userId: user.id,
        type: { in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"] },
      },
      data: { isActive: false },
    })

    await db.prospect.updateMany({
      where: { userId: user.id },
      data: {
        crmId: null,
        crmType: null,
        crmSyncedAt: null,
        crmData: Prisma.DbNull,
        dealId: null,
        dealScore: null,
      },
    })

    revalidatePath("/crm")
    return { success: true }
  } catch (error) {
    console.error("[CRM] Disconnect error:", error)
    return { success: false, error: "Failed to disconnect CRM" }
  }
}

// Sync leads from CRM
export async function syncLeadsFromCRM() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const integration = await db.integration.findFirst({
      where: {
        userId: user.id,
        type: { in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"] },
        isActive: true,
      },
    })

    if (!integration) return { success: false, error: "No CRM connected" }

    const credentials = parseCredentials(integration.credentials)
    if (!credentials) return { success: false, error: "Invalid CRM credentials" }

    const crmType = integration.type.toLowerCase() as CRMType

    const leads = await fetchLeadsFromCRM(crmType, credentials)

    let synced = 0
    for (const lead of leads) {
      if (!lead.email) continue

      // Find existing prospect by email
      const existingProspect = await db.prospect.findFirst({
        where: { userId: user.id, email: lead.email },
      })

      const crmDataJson = lead as unknown as Prisma.InputJsonValue

      if (existingProspect) {
        await db.prospect.update({
          where: { id: existingProspect.id },
          data: {
            firstName: lead.firstName || existingProspect.firstName,
            lastName: lead.lastName || existingProspect.lastName,
            company: lead.company || existingProspect.company,
            jobTitle: lead.jobTitle || existingProspect.jobTitle,
            phoneNumber: lead.phone || existingProspect.phoneNumber,
            crmId: lead.id,
            crmType: crmType,
            crmSyncedAt: new Date(),
            crmData: crmDataJson,
          },
        })
      } else {
        // Get a default campaign or create prospect without campaign
        const defaultCampaign = await db.campaign.findFirst({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        })

        if (defaultCampaign) {
          await db.prospect.create({
            data: {
              userId: user.id,
              campaignId: defaultCampaign.id,
              email: lead.email,
              firstName: lead.firstName,
              lastName: lead.lastName,
              company: lead.company,
              jobTitle: lead.jobTitle,
              phoneNumber: lead.phone,
              crmId: lead.id,
              crmType: crmType,
              crmSyncedAt: new Date(),
              crmData: crmDataJson,
              status: "ACTIVE",
            },
          })
        }
      }
      synced++
    }

    await db.integration.update({
      where: { id: integration.id },
      data: { lastSyncedAt: new Date() },
    })

    revalidatePath("/crm")
    return { success: true, synced }
  } catch (error) {
    console.error("[CRM] Sync error:", error)
    return { success: false, error: "Failed to sync leads" }
  }
}

// Sync deals and calculate AI scores
export async function syncDealsFromCRM() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const integration = await db.integration.findFirst({
      where: {
        userId: user.id,
        type: { in: ["HUBSPOT", "SALESFORCE", "PIPEDRIVE"] },
        isActive: true,
      },
    })

    if (!integration) return { success: false, error: "No CRM connected" }

    const credentials = parseCredentials(integration.credentials)
    if (!credentials) return { success: false, error: "Invalid CRM credentials" }

    const crmType = integration.type.toLowerCase() as CRMType

    const deals = await fetchDealsFromCRM(crmType, credentials)

    let scored = 0
    for (const deal of deals) {
      if (!deal.contactEmail) continue

      const aiScore = calculateDealScore(deal)

      await db.prospect.updateMany({
        where: {
          userId: user.id,
          email: deal.contactEmail,
        },
        data: {
          dealId: deal.id,
          dealScore: aiScore,
          crmSyncedAt: new Date(),
        },
      })
      scored++
    }

    revalidatePath("/crm")
    return { success: true, scored }
  } catch (error) {
    console.error("[CRM] Deal sync error:", error)
    return { success: false, error: "Failed to sync deals" }
  }
}

// Get CRM stats for dashboard
export async function getCRMStats() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const [totalLeads, hotLeads, warmLeads, coldLeads, repliedLeads] = await Promise.all([
      db.prospect.count({ where: { userId: user.id, crmId: { not: null } } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, dealScore: { gte: 70 } } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, dealScore: { gte: 40, lt: 70 } } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, dealScore: { lt: 40 } } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, replied: true } }),
    ])

    // Calculate pipeline value (sum of deal scores * assumed value factor)
    const prospectsWithScores = await db.prospect.findMany({
      where: { userId: user.id, dealScore: { not: null } },
      select: { dealScore: true },
    })

    const pipelineValue = prospectsWithScores.reduce((sum, p) => sum + (p.dealScore || 0) * 100, 0)
    const conversionRate = totalLeads > 0 ? Math.round((repliedLeads / totalLeads) * 100) : 0

    return {
      success: true,
      data: {
        totalLeads,
        hotLeads,
        warmLeads,
        coldLeads,
        pipelineValue,
        conversionRate,
      },
    }
  } catch (error) {
    console.error("[CRM] Get stats error:", error)
    return { success: false, error: "Failed to get CRM stats" }
  }
}

// Get pipeline stages with real data
export async function getPipelineStages() {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const [newLeads, contacted, qualified, replied, converted] = await Promise.all([
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, status: "ACTIVE", emailsReceived: 0 } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, status: "CONTACTED" } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, dealScore: { gte: 50 } } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, replied: true } }),
      db.prospect.count({ where: { userId: user.id, crmId: { not: null }, status: "COMPLETED" } }),
    ])

    const stages = [
      { name: "New Leads", count: newLeads, value: newLeads * 500 },
      { name: "Contacted", count: contacted, value: contacted * 750 },
      { name: "Qualified", count: qualified, value: qualified * 1200 },
      { name: "Replied", count: replied, value: replied * 2000 },
      { name: "Converted", count: converted, value: converted * 5000 },
    ]

    return { success: true, data: stages }
  } catch (error) {
    console.error("[CRM] Get pipeline error:", error)
    return { success: false, error: "Failed to get pipeline stages" }
  }
}

// Get hot deals
export async function getHotDeals(limit = 5) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const hotDeals = await db.prospect.findMany({
      where: {
        userId: user.id,
        crmId: { not: null },
        dealScore: { gte: 70 },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        jobTitle: true,
        dealScore: true,
        dealId: true,
        crmSyncedAt: true,
        replied: true,
      },
      orderBy: { dealScore: "desc" },
      take: limit,
    })

    return { success: true, data: hotDeals }
  } catch (error) {
    console.error("[CRM] Get hot deals error:", error)
    return { success: false, error: "Failed to get hot deals" }
  }
}

// Get CRM leads with pagination
export async function getCRMLeads(options?: {
  page?: number
  limit?: number
  search?: string
  scoreFilter?: "hot" | "warm" | "cold" | "all"
}) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  const { page = 1, limit = 20, search, scoreFilter = "all" } = options || {}

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const where: Prisma.ProspectWhereInput = {
      userId: user.id,
      crmId: { not: null },
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ]
    }

    if (scoreFilter !== "all") {
      switch (scoreFilter) {
        case "hot":
          where.dealScore = { gte: 70 }
          break
        case "warm":
          where.dealScore = { gte: 40, lt: 70 }
          break
        case "cold":
          where.dealScore = { lt: 40 }
          break
      }
    }

    const [leads, total] = await Promise.all([
      db.prospect.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          company: true,
          jobTitle: true,
          dealScore: true,
          dealId: true,
          crmType: true,
          crmSyncedAt: true,
          status: true,
          emailsReceived: true,
          emailsOpened: true,
          replied: true,
          phoneNumber: true,
        },
        orderBy: { dealScore: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.prospect.count({ where }),
    ])

    return {
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    }
  } catch (error) {
    console.error("[CRM] Get leads error:", error)
    return { success: false, error: "Failed to get CRM leads" }
  }
}

// Get deal scoring breakdown for a prospect
export async function getDealScoreBreakdown(prospectId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: "Unauthorized" }

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    })

    if (!user) return { success: false, error: "User not found" }

    const prospect = await db.prospect.findFirst({
      where: {
        id: prospectId,
        userId: user.id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        jobTitle: true,
        dealScore: true,
        dealId: true,
        crmData: true,
        emailsReceived: true,
        emailsOpened: true,
        emailsClicked: true,
        replied: true,
        status: true,
      },
    })

    if (!prospect) return { success: false, error: "Prospect not found" }

    const openRate = prospect.emailsReceived > 0 ? (prospect.emailsOpened / prospect.emailsReceived) * 100 : 0
    const clickRate = prospect.emailsOpened > 0 ? (prospect.emailsClicked / prospect.emailsOpened) * 100 : 0

    const breakdown = {
      engagement: {
        score: Math.min(30, Math.round(openRate * 0.3)),
        max: 30,
        factors: [
          { name: "Open Rate", value: `${openRate.toFixed(1)}%`, impact: openRate > 50 ? "positive" : "neutral" },
          { name: "Click Rate", value: `${clickRate.toFixed(1)}%`, impact: clickRate > 10 ? "positive" : "neutral" },
          {
            name: "Replied",
            value: prospect.replied ? "Yes" : "No",
            impact: prospect.replied ? "positive" : "negative",
          },
        ],
      },
      profile: {
        score: Math.min(25, (prospect.company ? 10 : 0) + (prospect.jobTitle ? 10 : 0) + 5),
        max: 25,
        factors: [
          { name: "Company", value: prospect.company || "Unknown", impact: prospect.company ? "positive" : "negative" },
          {
            name: "Job Title",
            value: prospect.jobTitle || "Unknown",
            impact: prospect.jobTitle ? "positive" : "negative",
          },
        ],
      },
      activity: {
        score: Math.min(25, prospect.emailsReceived * 2),
        max: 25,
        factors: [
          {
            name: "Emails Sent",
            value: prospect.emailsReceived.toString(),
            impact: prospect.emailsReceived > 3 ? "positive" : "neutral",
          },
          { name: "Status", value: prospect.status, impact: prospect.status === "REPLIED" ? "positive" : "neutral" },
        ],
      },
      timing: {
        score: 20,
        max: 20,
        factors: [{ name: "Recency", value: "Active", impact: "positive" }],
      },
    }

    return {
      success: true,
      data: {
        prospect,
        breakdown,
        totalScore: prospect.dealScore || 0,
        recommendation: getRecommendation(prospect.dealScore || 0),
      },
    }
  } catch (error) {
    console.error("[CRM] Get score breakdown error:", error)
    return { success: false, error: "Failed to get score breakdown" }
  }
}

// Helper: Fetch leads from CRM
async function fetchLeadsFromCRM(crmType: CRMType, credentials: CRMCredentials): Promise<CRMLead[]> {
  switch (crmType) {
    case "hubspot":
      return fetchHubSpotContacts(credentials)
    case "salesforce":
      return fetchSalesforceLeads(credentials)
    case "pipedrive":
      return fetchPipedrivePersons(credentials)
    default:
      return []
  }
}

// Helper: Fetch deals from CRM
async function fetchDealsFromCRM(crmType: CRMType, credentials: CRMCredentials): Promise<CRMDeal[]> {
  switch (crmType) {
    case "hubspot":
      return fetchHubSpotDeals(credentials)
    case "salesforce":
      return fetchSalesforceOpportunities(credentials)
    case "pipedrive":
      return fetchPipedriveDeals(credentials)
    default:
      return []
  }
}

// HubSpot API calls
async function fetchHubSpotContacts(credentials: CRMCredentials): Promise<CRMLead[]> {
  const response = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts?limit=100&properties=email,firstname,lastname,company,jobtitle,phone",
    {
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    },
  )

  if (!response.ok) throw new Error("HubSpot API error")

  const data = await response.json()
  return data.results.map((contact: Record<string, unknown>) => ({
    id: contact.id as string,
    email: (contact.properties as Record<string, string>).email,
    firstName: (contact.properties as Record<string, string>).firstname,
    lastName: (contact.properties as Record<string, string>).lastname,
    company: (contact.properties as Record<string, string>).company,
    jobTitle: (contact.properties as Record<string, string>).jobtitle,
    phone: (contact.properties as Record<string, string>).phone,
  }))
}

async function fetchHubSpotDeals(credentials: CRMCredentials): Promise<CRMDeal[]> {
  const response = await fetch(
    "https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,amount,dealstage,closedate,hs_deal_stage_probability&associations=contacts",
    {
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    },
  )

  if (!response.ok) throw new Error("HubSpot API error")

  const data = await response.json()
  return data.results.map((deal: Record<string, unknown>) => ({
    id: deal.id as string,
    name: (deal.properties as Record<string, string>).dealname,
    amount: Number.parseFloat((deal.properties as Record<string, string>).amount) || 0,
    stage: (deal.properties as Record<string, string>).dealstage,
    probability: Number.parseFloat((deal.properties as Record<string, string>).hs_deal_stage_probability) || 0,
    closeDate: (deal.properties as Record<string, string>).closedate,
  }))
}

// Salesforce API calls
async function fetchSalesforceLeads(credentials: CRMCredentials): Promise<CRMLead[]> {
  const response = await fetch(
    `${credentials.instanceUrl}/services/data/v57.0/query?q=SELECT+Id,Email,FirstName,LastName,Company,Title,Phone+FROM+Lead+LIMIT+100`,
    {
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    },
  )

  if (!response.ok) throw new Error("Salesforce API error")

  const data = await response.json()
  return data.records.map((lead: Record<string, string>) => ({
    id: lead.Id,
    email: lead.Email,
    firstName: lead.FirstName,
    lastName: lead.LastName,
    company: lead.Company,
    jobTitle: lead.Title,
    phone: lead.Phone,
  }))
}

async function fetchSalesforceOpportunities(credentials: CRMCredentials): Promise<CRMDeal[]> {
  const response = await fetch(
    `${credentials.instanceUrl}/services/data/v57.0/query?q=SELECT+Id,Name,Amount,StageName,Probability,CloseDate+FROM+Opportunity+LIMIT+100`,
    {
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    },
  )

  if (!response.ok) throw new Error("Salesforce API error")

  const data = await response.json()
  return data.records.map((opp: Record<string, unknown>) => ({
    id: opp.Id as string,
    name: opp.Name as string,
    amount: (opp.Amount as number) || 0,
    stage: opp.StageName as string,
    probability: (opp.Probability as number) || 0,
    closeDate: opp.CloseDate as string,
  }))
}

// Pipedrive API calls
async function fetchPipedrivePersons(credentials: CRMCredentials): Promise<CRMLead[]> {
  const response = await fetch("https://api.pipedrive.com/v1/persons?limit=100", {
    headers: { Authorization: `Bearer ${credentials.accessToken}` },
  })

  if (!response.ok) throw new Error("Pipedrive API error")

  const data = await response.json()
  return (
    data.data?.map((person: Record<string, unknown>) => ({
      id: String(person.id),
      email: (person.email as Array<{ value: string }>)?.[0]?.value || "",
      firstName: person.first_name as string,
      lastName: person.last_name as string,
      company: (person.org_name as string) || "",
      phone: (person.phone as Array<{ value: string }>)?.[0]?.value || "",
    })) || []
  )
}

async function fetchPipedriveDeals(credentials: CRMCredentials): Promise<CRMDeal[]> {
  const response = await fetch("https://api.pipedrive.com/v1/deals?limit=100", {
    headers: { Authorization: `Bearer ${credentials.accessToken}` },
  })

  if (!response.ok) throw new Error("Pipedrive API error")

  const data = await response.json()
  return (
    data.data?.map((deal: Record<string, unknown>) => ({
      id: String(deal.id),
      name: deal.title as string,
      amount: (deal.value as number) || 0,
      stage: String(deal.stage_id),
      probability: (deal.probability as number) || 0,
      closeDate: deal.expected_close_date as string,
    })) || []
  )
}

// Calculate AI deal score
function calculateDealScore(deal: CRMDeal): number {
  let score = 0

  // Deal value factor (max 30 points)
  if (deal.amount >= 50000) score += 30
  else if (deal.amount >= 20000) score += 25
  else if (deal.amount >= 10000) score += 20
  else if (deal.amount >= 5000) score += 15
  else score += 10

  // Probability factor (max 30 points)
  score += Math.round(deal.probability * 0.3)

  // Stage factor (max 25 points)
  const stageScores: Record<string, number> = {
    closedwon: 25,
    proposal: 20,
    negotiation: 18,
    qualified: 15,
    contacted: 10,
    new: 5,
  }
  const stageLower = deal.stage.toLowerCase()
  score += stageScores[stageLower] || 10

  // Timeline factor (max 15 points)
  if (deal.closeDate) {
    const daysUntilClose = Math.ceil((new Date(deal.closeDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (daysUntilClose <= 7) score += 15
    else if (daysUntilClose <= 30) score += 12
    else if (daysUntilClose <= 60) score += 8
    else score += 4
  }

  return Math.min(100, Math.max(0, score))
}

// Get recommendation based on score
function getRecommendation(score: number): string {
  if (score >= 80) return "High priority - Schedule demo or close call immediately"
  if (score >= 60) return "Good opportunity - Send personalized follow-up"
  if (score >= 40) return "Nurture lead - Add to drip campaign"
  return "Low priority - Monitor for engagement signals"
}
