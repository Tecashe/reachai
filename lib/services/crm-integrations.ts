// "use server"

// import { db } from "@/lib/db"

// export interface CrmCredentials {
//   accessToken?: string
//   apiKey?: string
//   refreshToken?: string
//   instanceUrl?: string
// }

// export interface CrmLead {
//   id: string
//   email: string
//   firstName?: string
//   lastName?: string
//   company?: string
//   title?: string
//   phone?: string
//   linkedinUrl?: string
//   externalId?: string
//   dealValue?: number
//   dealStage?: string
//   estimatedCloseDate?: string
//   notes?: string
// }

// // HubSpot Integration
// export const hubspotService = {
//   async validateConnection(apiKey: string): Promise<boolean> {
//     try {
//       const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
//         headers: { Authorization: `Bearer ${apiKey}` },
//         method: "GET",
//       })
//       return response.ok
//     } catch (error) {
//       console.error("[builtbycashe] HubSpot validation error:", error)
//       return false
//     }
//   },

//   async syncLeads(userId: string, apiKey: string): Promise<CrmLead[]> {
//     try {
//       console.log("[builtbycashe] Starting HubSpot sync for user:", userId)
//       const leads: CrmLead[] = []
//       let after: string | undefined

//       // Paginate through HubSpot contacts
//       do {
//         const url = new URL("https://api.hubapi.com/crm/v3/objects/contacts")
//         url.searchParams.append("limit", "100")
//         if (after) url.searchParams.append("after", after)

//         const response = await fetch(url.toString(), {
//           headers: {
//             Authorization: `Bearer ${apiKey}`,
//             "Content-Type": "application/json",
//           },
//           method: "GET",
//         })

//         if (!response.ok) throw new Error("HubSpot API error")
//         const data = await response.json()

//         data.results?.forEach((contact: any) => {
//           const props = contact.properties || {}
//           leads.push({
//             id: contact.id,
//             email: props.email || "",
//             firstName: props.firstname || "",
//             lastName: props.lastname || "",
//             company: props.company || "",
//             title: props.jobtitle || "",
//             phone: props.phone || "",
//             linkedinUrl: props.linkedin_profile_url || "",
//             externalId: contact.id,
//           })
//         })

//         after = data.paging?.next?.after
//       } while (after)

//       console.log("[builtbycashe] HubSpot sync completed, leads found:", leads.length)
//       return leads
//     } catch (error) {
//       console.error("[builtbycashe] HubSpot sync error:", error)
//       return []
//     }
//   },

//   async createDeal(apiKey: string, leadData: CrmLead, dealValue: number): Promise<string | null> {
//     try {
//       const response = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           properties: {
//             dealname: `${leadData.firstName} ${leadData.lastName} - ${leadData.company}`,
//             dealstage: "negotiation",
//             amount: dealValue,
//             closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//           },
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to create deal")
//       const data = await response.json()
//       return data.id
//     } catch (error) {
//       console.error("[builtbycashe] HubSpot deal creation error:", error)
//       return null
//     }
//   },
// }

// // Salesforce Integration
// export const salesforceService = {
//   async validateConnection(accessToken: string, instanceUrl: string): Promise<boolean> {
//     try {
//       const response = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Account`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         method: "GET",
//       })
//       return response.ok
//     } catch (error) {
//       console.error("[builtbycashe] Salesforce validation error:", error)
//       return false
//     }
//   },

//   async syncLeads(userId: string, accessToken: string, instanceUrl: string): Promise<CrmLead[]> {
//     try {
//       console.log("[builtbycashe] Starting Salesforce sync for user:", userId)
//       const leads: CrmLead[] = []

//       const response = await fetch(
//         `${instanceUrl}/services/data/v57.0/query?q=SELECT Id, FirstName, LastName, Email, Phone, Title, Company, LinkedIn__c FROM Contact LIMIT 500`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//           method: "GET",
//         },
//       )

//       if (!response.ok) throw new Error("Salesforce API error")
//       const data = await response.json()

//       data.records?.forEach((contact: any) => {
//         leads.push({
//           id: contact.Id,
//           email: contact.Email || "",
//           firstName: contact.FirstName || "",
//           lastName: contact.LastName || "",
//           company: contact.Company || "",
//           title: contact.Title || "",
//           phone: contact.Phone || "",
//           linkedinUrl: contact.LinkedIn__c || "",
//           externalId: contact.Id,
//         })
//       })

//       console.log("[builtbycashe] Salesforce sync completed, leads found:", leads.length)
//       return leads
//     } catch (error) {
//       console.error("[builtbycashe] Salesforce sync error:", error)
//       return []
//     }
//   },

//   async createOpportunity(
//     accessToken: string,
//     instanceUrl: string,
//     leadData: CrmLead,
//     dealValue: number,
//   ): Promise<string | null> {
//     try {
//       const response = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Opportunity`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           Name: `${leadData.firstName} ${leadData.lastName} - ${leadData.company}`,
//           StageName: "Negotiation/Review",
//           Amount: dealValue,
//           CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to create opportunity")
//       const data = await response.json()
//       return data.id
//     } catch (error) {
//       console.error("[builtbycashe] Salesforce opportunity creation error:", error)
//       return null
//     }
//   },
// }

// // Pipedrive Integration
// export const pipedriveService = {
//   async validateConnection(apiKey: string): Promise<boolean> {
//     try {
//       const response = await fetch(`https://api.pipedrive.com/v1/users/me?api_token=${apiKey}`, {
//         method: "GET",
//       })
//       return response.ok
//     } catch (error) {
//       console.error("[builtbycashe] Pipedrive validation error:", error)
//       return false
//     }
//   },

//   async syncLeads(userId: string, apiKey: string): Promise<CrmLead[]> {
//     try {
//       console.log("[builtbycashe] Starting Pipedrive sync for user:", userId)
//       const leads: CrmLead[] = []
//       let start = 0

//       do {
//         const response = await fetch(
//           `https://api.pipedrive.com/v1/persons?api_token=${apiKey}&start=${start}&limit=500`,
//           { method: "GET" },
//         )

//         if (!response.ok) throw new Error("Pipedrive API error")
//         const data = await response.json()

//         data.data?.forEach((person: any) => {
//           leads.push({
//             id: person.id,
//             email: person.email?.[0]?.value || "",
//             firstName: person.first_name || "",
//             lastName: person.last_name || "",
//             phone: person.phone?.[0]?.value || "",
//             linkedinUrl: person.linkedin_profile_url || "",
//             externalId: person.id,
//           })
//         })

//         start = data.additional_data?.pagination?.next_start || 0
//         if (!data.additional_data?.pagination?.more_items_in_collection) break
//       } while (true)

//       console.log("[builtbycashe] Pipedrive sync completed, leads found:", leads.length)
//       return leads
//     } catch (error) {
//       console.error("[builtbycashe] Pipedrive sync error:", error)
//       return []
//     }
//   },
// }

// // Database sync helpers
// export async function syncCrmLeads(userId: string, crmType: string, credentials: CrmCredentials) {
//   try {
//     console.log("[builtbycashe] Syncing CRM leads for user:", userId, "CRM type:", crmType)
//     let leads: CrmLead[] = []

//     if (crmType === "hubspot" && credentials.accessToken) {
//       leads = await hubspotService.syncLeads(userId, credentials.accessToken)
//     } else if (crmType === "salesforce" && credentials.accessToken && credentials.instanceUrl) {
//       leads = await salesforceService.syncLeads(userId, credentials.accessToken, credentials.instanceUrl)
//     } else if (crmType === "pipedrive" && credentials.apiKey) {
//       leads = await pipedriveService.syncLeads(userId, credentials.apiKey)
//     }

//     // Upsert leads into Prospects table
//     for (const lead of leads) {
//       await db.prospect.upsert({
//         where: { email_userId: { email: lead.email, userId } },
//         update: {
//           firstName: lead.firstName || undefined,
//           lastName: lead.lastName || undefined,
//           company: lead.company || undefined,
//           jobTitle: lead.title || undefined,
//           phoneNumber: lead.phone || undefined,
//           linkedinUrl: lead.linkedinUrl || undefined,
//           crmId: lead.externalId,
//           crmType,
//           crmSyncedAt: new Date(),
//           crmData: lead,
//         },
//         create: {
//           userId,
//           email: lead.email,
//           firstName: lead.firstName,
//           lastName: lead.lastName,
//           company: lead.company,
//           jobTitle: lead.title,
//           phoneNumber: lead.phone,
//           linkedinUrl: lead.linkedinUrl,
//           crmId: lead.externalId,
//           crmType,
//           crmSyncedAt: new Date(),
//           crmData: lead,
//         },
//       })
//     }

//     console.log("[builtbycashe] Synced", leads.length, "leads from CRM")
//     return leads
//   } catch (error) {
//     console.error("[builtbycashe] CRM sync error:", error)
//     return []
//   }
// }

// // AI Deal Scoring
// export async function scoreProspect(prospect: any, crmData?: any): Promise<number> {
//   try {
//     let score = 0

//     // Email engagement score (40%)
//     const engagementRate = prospect.emailsOpened > 0 ? prospect.emailsOpened / prospect.emailsReceived : 0
//     score += engagementRate * 40

//     // Reply rate (30%)
//     const replyRate = prospect.emailsReplied > 0 ? prospect.emailsReplied / prospect.emailsReceived : 0
//     score += replyRate * 30

//     // Research quality (20%)
//     if (prospect.qualityScore) {
//       score += (prospect.qualityScore / 100) * 20
//     }

//     // CRM signals (10%)
//     if (crmData?.dealStage === "negotiation" || crmData?.dealStage === "decision") {
//       score += 10
//     }

//     return Math.min(100, Math.max(0, score))
//   } catch (error) {
//     console.error("[builtbycashe] Deal scoring error:", error)
//     return 0
//   }
// }



// import { db } from "@/lib/db"

// export interface CrmCredentials {
//   accessToken?: string
//   apiKey?: string
//   refreshToken?: string
//   instanceUrl?: string
// }

// export interface CrmLead {
//   id: string
//   email: string
//   firstName?: string
//   lastName?: string
//   company?: string
//   title?: string
//   phone?: string
//   linkedinUrl?: string
//   externalId?: string
//   dealValue?: number
//   dealStage?: string
//   estimatedCloseDate?: string
//   notes?: string
// }

// // HubSpot Integration
// export const hubspotService = {
//   async validateConnection(apiKey: string): Promise<boolean> {
//     try {
//       const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
//         headers: { Authorization: `Bearer ${apiKey}` },
//         method: "GET",
//       })
//       return response.ok
//     } catch (error) {
//       console.error("[builtbycashe] HubSpot validation error:", error)
//       return false
//     }
//   },

//   async syncLeads(userId: string, apiKey: string): Promise<CrmLead[]> {
//     try {
//       console.log("[builtbycashe] Starting HubSpot sync for user:", userId)
//       const leads: CrmLead[] = []
//       let after: string | undefined

//       // Paginate through HubSpot contacts
//       do {
//         const url = new URL("https://api.hubapi.com/crm/v3/objects/contacts")
//         url.searchParams.append("limit", "100")
//         if (after) url.searchParams.append("after", after)

//         const response = await fetch(url.toString(), {
//           headers: {
//             Authorization: `Bearer ${apiKey}`,
//             "Content-Type": "application/json",
//           },
//           method: "GET",
//         })

//         if (!response.ok) throw new Error("HubSpot API error")
//         const data = await response.json()

//         data.results?.forEach((contact: any) => {
//           const props = contact.properties || {}
//           leads.push({
//             id: contact.id,
//             email: props.email || "",
//             firstName: props.firstname || "",
//             lastName: props.lastname || "",
//             company: props.company || "",
//             title: props.jobtitle || "",
//             phone: props.phone || "",
//             linkedinUrl: props.linkedin_profile_url || "",
//             externalId: contact.id,
//           })
//         })

//         after = data.paging?.next?.after
//       } while (after)

//       console.log("[builtbycashe] HubSpot sync completed, leads found:", leads.length)
//       return leads
//     } catch (error) {
//       console.error("[builtbycashe] HubSpot sync error:", error)
//       return []
//     }
//   },

//   async createDeal(apiKey: string, leadData: CrmLead, dealValue: number): Promise<string | null> {
//     try {
//       const response = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           properties: {
//             dealname: `${leadData.firstName} ${leadData.lastName} - ${leadData.company}`,
//             dealstage: "negotiation",
//             amount: dealValue,
//             closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//           },
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to create deal")
//       const data = await response.json()
//       return data.id
//     } catch (error) {
//       console.error("[builtbycashe] HubSpot deal creation error:", error)
//       return null
//     }
//   },
// }

// // Salesforce Integration
// export const salesforceService = {
//   async validateConnection(accessToken: string, instanceUrl: string): Promise<boolean> {
//     try {
//       const response = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Account`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//         method: "GET",
//       })
//       return response.ok
//     } catch (error) {
//       console.error("[builtbycashe] Salesforce validation error:", error)
//       return false
//     }
//   },

//   async syncLeads(userId: string, accessToken: string, instanceUrl: string): Promise<CrmLead[]> {
//     try {
//       console.log("[builtbycashe] Starting Salesforce sync for user:", userId)
//       const leads: CrmLead[] = []

//       const response = await fetch(
//         `${instanceUrl}/services/data/v57.0/query?q=SELECT Id, FirstName, LastName, Email, Phone, Title, Company, LinkedIn__c FROM Contact LIMIT 500`,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//           method: "GET",
//         },
//       )

//       if (!response.ok) throw new Error("Salesforce API error")
//       const data = await response.json()

//       data.records?.forEach((contact: any) => {
//         leads.push({
//           id: contact.Id,
//           email: contact.Email || "",
//           firstName: contact.FirstName || "",
//           lastName: contact.LastName || "",
//           company: contact.Company || "",
//           title: contact.Title || "",
//           phone: contact.Phone || "",
//           linkedinUrl: contact.LinkedIn__c || "",
//           externalId: contact.Id,
//         })
//       })

//       console.log("[builtbycashe] Salesforce sync completed, leads found:", leads.length)
//       return leads
//     } catch (error) {
//       console.error("[builtbycashe] Salesforce sync error:", error)
//       return []
//     }
//   },

//   async createOpportunity(
//     accessToken: string,
//     instanceUrl: string,
//     leadData: CrmLead,
//     dealValue: number,
//   ): Promise<string | null> {
//     try {
//       const response = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Opportunity`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           Name: `${leadData.firstName} ${leadData.lastName} - ${leadData.company}`,
//           StageName: "Negotiation/Review",
//           Amount: dealValue,
//           CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to create opportunity")
//       const data = await response.json()
//       return data.id
//     } catch (error) {
//       console.error("[builtbycashe] Salesforce opportunity creation error:", error)
//       return null
//     }
//   },
// }

// // Pipedrive Integration
// export const pipedriveService = {
//   async validateConnection(apiKey: string): Promise<boolean> {
//     try {
//       const response = await fetch(`https://api.pipedrive.com/v1/users/me?api_token=${apiKey}`, {
//         method: "GET",
//       })
//       return response.ok
//     } catch (error) {
//       console.error("[builtbycashe] Pipedrive validation error:", error)
//       return false
//     }
//   },

//   async syncLeads(userId: string, apiKey: string): Promise<CrmLead[]> {
//     try {
//       console.log("[builtbycashe] Starting Pipedrive sync for user:", userId)
//       const leads: CrmLead[] = []
//       let start = 0

//       do {
//         const response = await fetch(
//           `https://api.pipedrive.com/v1/persons?api_token=${apiKey}&start=${start}&limit=500`,
//           { method: "GET" },
//         )

//         if (!response.ok) throw new Error("Pipedrive API error")
//         const data = await response.json()

//         data.data?.forEach((person: any) => {
//           leads.push({
//             id: person.id,
//             email: person.email?.[0]?.value || "",
//             firstName: person.first_name || "",
//             lastName: person.last_name || "",
//             phone: person.phone?.[0]?.value || "",
//             linkedinUrl: person.linkedin_profile_url || "",
//             externalId: person.id,
//           })
//         })

//         start = data.additional_data?.pagination?.next_start || 0
//         if (!data.additional_data?.pagination?.more_items_in_collection) break
//       } while (true)

//       console.log("[builtbycashe] Pipedrive sync completed, leads found:", leads.length)
//       return leads
//     } catch (error) {
//       console.error("[builtbycashe] Pipedrive sync error:", error)
//       return []
//     }
//   },
// }

// // Database sync helpers
// export async function syncCrmLeads(userId: string, crmType: string, credentials: CrmCredentials) {
//   try {
//     console.log("[builtbycashe] Syncing CRM leads for user:", userId, "CRM type:", crmType)
//     let leads: CrmLead[] = []

//     if (crmType === "hubspot" && credentials.accessToken) {
//       leads = await hubspotService.syncLeads(userId, credentials.accessToken)
//     } else if (crmType === "salesforce" && credentials.accessToken && credentials.instanceUrl) {
//       leads = await salesforceService.syncLeads(userId, credentials.accessToken, credentials.instanceUrl)
//     } else if (crmType === "pipedrive" && credentials.apiKey) {
//       leads = await pipedriveService.syncLeads(userId, credentials.apiKey)
//     }

//     // Upsert leads into Prospects table
//     for (const lead of leads) {
//       const existingProspect = await db.prospect.findFirst({
//         where: {
//           email: lead.email,
//           userId,
//         },
//       })

//       if (existingProspect) {
//         await db.prospect.update({
//           where: { id: existingProspect.id },
//           data: {
//             firstName: lead.firstName || undefined,
//             lastName: lead.lastName || undefined,
//             company: lead.company || undefined,
//             jobTitle: lead.title || undefined,
//             phoneNumber: lead.phone || undefined,
//             linkedinUrl: lead.linkedinUrl || undefined,
//             crmId: lead.externalId,
//             crmType,
//             crmSyncedAt: new Date(),
//             crmData: lead as any, // Cast to any since Prisma accepts JSON
//           },
//         })
//       } else {
//         await db.prospect.create({
//           data: {
//             userId,
//             email: lead.email,
//             firstName: lead.firstName || undefined,
//             lastName: lead.lastName || undefined,
//             company: lead.company || undefined,
//             jobTitle: lead.title || undefined,
//             phoneNumber: lead.phone || undefined,
//             linkedinUrl: lead.linkedinUrl || undefined,
//             crmId: lead.externalId,
//             crmType,
//             crmSyncedAt: new Date(),
//             crmData: lead as any, // Cast to any since Prisma accepts JSON
//           },
//         })
//       }
//     }

//     console.log("[builtbycashe] Synced", leads.length, "leads from CRM")
//     return leads
//   } catch (error) {
//     console.error("[builtbycashe] CRM sync error:", error)
//     return []
//   }
// }

// // AI Deal Scoring
// export async function scoreProspect(prospect: any, crmData?: any): Promise<number> {
//   try {
//     let score = 0

//     // Email engagement score (40%)
//     const engagementRate = prospect.emailsOpened > 0 ? prospect.emailsOpened / prospect.emailsReceived : 0
//     score += engagementRate * 40

//     // Reply rate (30%)
//     const replyRate = prospect.emailsReplied > 0 ? prospect.emailsReplied / prospect.emailsReceived : 0
//     score += replyRate * 30

//     // Research quality (20%)
//     if (prospect.qualityScore) {
//       score += (prospect.qualityScore / 100) * 20
//     }

//     // CRM signals (10%)
//     if (crmData?.dealStage === "negotiation" || crmData?.dealStage === "decision") {
//       score += 10
//     }

//     return Math.min(100, Math.max(0, score))
//   } catch (error) {
//     console.error("[builtbycashe] Deal scoring error:", error)
//     return 0
//   }
// }
import { db } from "@/lib/db"

export interface CrmCredentials {
  accessToken?: string
  apiKey?: string
  refreshToken?: string
  instanceUrl?: string
}

export interface CrmLead {
  id: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  title?: string
  phone?: string
  linkedinUrl?: string
  externalId?: string
  dealValue?: number
  dealStage?: string
  estimatedCloseDate?: string
  notes?: string
}

// HubSpot Integration
export const hubspotService = {
  async validateConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        headers: { Authorization: `Bearer ${apiKey}` },
        method: "GET",
      })
      return response.ok
    } catch (error) {
      console.error("[builtbycashe] HubSpot validation error:", error)
      return false
    }
  },

  async syncLeads(userId: string, apiKey: string): Promise<CrmLead[]> {
    try {
      console.log("[builtbycashe] Starting HubSpot sync for user:", userId)
      const leads: CrmLead[] = []
      let after: string | undefined

      // Paginate through HubSpot contacts
      do {
        const url = new URL("https://api.hubapi.com/crm/v3/objects/contacts")
        url.searchParams.append("limit", "100")
        if (after) url.searchParams.append("after", after)

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          method: "GET",
        })

        if (!response.ok) throw new Error("HubSpot API error")
        const data = await response.json()

        data.results?.forEach((contact: any) => {
          const props = contact.properties || {}
          leads.push({
            id: contact.id,
            email: props.email || "",
            firstName: props.firstname || "",
            lastName: props.lastname || "",
            company: props.company || "",
            title: props.jobtitle || "",
            phone: props.phone || "",
            linkedinUrl: props.linkedin_profile_url || "",
            externalId: contact.id,
          })
        })

        after = data.paging?.next?.after
      } while (after)

      console.log("[builtbycashe] HubSpot sync completed, leads found:", leads.length)
      return leads
    } catch (error) {
      console.error("[builtbycashe] HubSpot sync error:", error)
      return []
    }
  },

  async createDeal(apiKey: string, leadData: CrmLead, dealValue: number): Promise<string | null> {
    try {
      const response = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            dealname: `${leadData.firstName} ${leadData.lastName} - ${leadData.company}`,
            dealstage: "negotiation",
            amount: dealValue,
            closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        }),
      })

      if (!response.ok) throw new Error("Failed to create deal")
      const data = await response.json()
      return data.id
    } catch (error) {
      console.error("[builtbycashe] HubSpot deal creation error:", error)
      return null
    }
  },
}

// Salesforce Integration
export const salesforceService = {
  async validateConnection(accessToken: string, instanceUrl: string): Promise<boolean> {
    try {
      const response = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Account`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        method: "GET",
      })
      return response.ok
    } catch (error) {
      console.error("[builtbycashe] Salesforce validation error:", error)
      return false
    }
  },

  async syncLeads(userId: string, accessToken: string, instanceUrl: string): Promise<CrmLead[]> {
    try {
      console.log("[builtbycashe] Starting Salesforce sync for user:", userId)
      const leads: CrmLead[] = []

      const response = await fetch(
        `${instanceUrl}/services/data/v57.0/query?q=SELECT Id, FirstName, LastName, Email, Phone, Title, Company, LinkedIn__c FROM Contact LIMIT 500`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          method: "GET",
        },
      )

      if (!response.ok) throw new Error("Salesforce API error")
      const data = await response.json()

      data.records?.forEach((contact: any) => {
        leads.push({
          id: contact.Id,
          email: contact.Email || "",
          firstName: contact.FirstName || "",
          lastName: contact.LastName || "",
          company: contact.Company || "",
          title: contact.Title || "",
          phone: contact.Phone || "",
          linkedinUrl: contact.LinkedIn__c || "",
          externalId: contact.Id,
        })
      })

      console.log("[builtbycashe] Salesforce sync completed, leads found:", leads.length)
      return leads
    } catch (error) {
      console.error("[builtbycashe] Salesforce sync error:", error)
      return []
    }
  },

  async createOpportunity(
    accessToken: string,
    instanceUrl: string,
    leadData: CrmLead,
    dealValue: number,
  ): Promise<string | null> {
    try {
      const response = await fetch(`${instanceUrl}/services/data/v57.0/sobjects/Opportunity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: `${leadData.firstName} ${leadData.lastName} - ${leadData.company}`,
          StageName: "Negotiation/Review",
          Amount: dealValue,
          CloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        }),
      })

      if (!response.ok) throw new Error("Failed to create opportunity")
      const data = await response.json()
      return data.id
    } catch (error) {
      console.error("[builtbycashe] Salesforce opportunity creation error:", error)
      return null
    }
  },
}

// Pipedrive Integration
export const pipedriveService = {
  async validateConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.pipedrive.com/v1/users/me?api_token=${apiKey}`, {
        method: "GET",
      })
      return response.ok
    } catch (error) {
      console.error("[builtbycashe] Pipedrive validation error:", error)
      return false
    }
  },

  async syncLeads(userId: string, apiKey: string): Promise<CrmLead[]> {
    try {
      console.log("[builtbycashe] Starting Pipedrive sync for user:", userId)
      const leads: CrmLead[] = []
      let start = 0

      do {
        const response = await fetch(
          `https://api.pipedrive.com/v1/persons?api_token=${apiKey}&start=${start}&limit=500`,
          { method: "GET" },
        )

        if (!response.ok) throw new Error("Pipedrive API error")
        const data = await response.json()

        data.data?.forEach((person: any) => {
          leads.push({
            id: person.id,
            email: person.email?.[0]?.value || "",
            firstName: person.first_name || "",
            lastName: person.last_name || "",
            phone: person.phone?.[0]?.value || "",
            linkedinUrl: person.linkedin_profile_url || "",
            externalId: person.id,
          })
        })

        start = data.additional_data?.pagination?.next_start || 0
        if (!data.additional_data?.pagination?.more_items_in_collection) break
      } while (true)

      console.log("[builtbycashe] Pipedrive sync completed, leads found:", leads.length)
      return leads
    } catch (error) {
      console.error("[builtbycashe] Pipedrive sync error:", error)
      return []
    }
  },
}

// Database sync helpers
export async function syncCrmLeads(userId: string, crmType: string, credentials: CrmCredentials) {
  try {
    console.log("[builtbycashe] Syncing CRM leads for user:", userId, "CRM type:", crmType)
    let leads: CrmLead[] = []

    if (crmType === "hubspot" && credentials.accessToken) {
      leads = await hubspotService.syncLeads(userId, credentials.accessToken)
    } else if (crmType === "salesforce" && credentials.accessToken && credentials.instanceUrl) {
      leads = await salesforceService.syncLeads(userId, credentials.accessToken, credentials.instanceUrl)
    } else if (crmType === "pipedrive" && credentials.apiKey) {
      leads = await pipedriveService.syncLeads(userId, credentials.apiKey)
    }

    // Upsert leads into Prospects table
    for (const lead of leads) {
      const existingProspect = await db.prospect.findFirst({
        where: {
          email: lead.email,
          userId,
        },
      })

      if (existingProspect) {
        await db.prospect.update({
          where: { id: existingProspect.id },
          data: {
            firstName: lead.firstName || undefined,
            lastName: lead.lastName || undefined,
            company: lead.company || undefined,
            jobTitle: lead.title || undefined,
            phoneNumber: lead.phone || undefined,
            linkedinUrl: lead.linkedinUrl || undefined,
            crmId: lead.externalId,
            crmType,
            crmSyncedAt: new Date(),
            crmData: lead as any, // Cast to any since Prisma accepts JSON
          },
        })
      } else {
        await db.prospect.create({
          data: {
            userId,
            email: lead.email,
            firstName: lead.firstName || undefined,
            lastName: lead.lastName || undefined,
            company: lead.company || undefined,
            jobTitle: lead.title || undefined,
            phoneNumber: lead.phone || undefined,
            linkedinUrl: lead.linkedinUrl || undefined,
            crmId: lead.externalId,
            crmType,
            crmSyncedAt: new Date(),
            crmData: lead as any, // Cast to any since Prisma accepts JSON
          },
        })
      }
    }

    console.log("[builtbycashe] Synced", leads.length, "leads from CRM")
    return leads
  } catch (error) {
    console.error("[builtbycashe] CRM sync error:", error)
    return []
  }
}

export const syncLeadsFromCRM = syncCrmLeads

// AI Deal Scoring
export async function scoreProspect(prospect: any, crmData?: any): Promise<number> {
  try {
    let score = 0

    // Email engagement score (40%)
    const engagementRate = prospect.emailsOpened > 0 ? prospect.emailsOpened / prospect.emailsReceived : 0
    score += engagementRate * 40

    // Reply rate (30%)
    const replyRate = prospect.emailsReplied > 0 ? prospect.emailsReplied / prospect.emailsReceived : 0
    score += replyRate * 30

    // Research quality (20%)
    if (prospect.qualityScore) {
      score += (prospect.qualityScore / 100) * 20
    }

    // CRM signals (10%)
    if (crmData?.dealStage === "negotiation" || crmData?.dealStage === "decision") {
      score += 10
    }

    return Math.min(100, Math.max(0, score))
  } catch (error) {
    console.error("[builtbycashe] Deal scoring error:", error)
    return 0
  }
}
