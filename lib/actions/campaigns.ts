// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { redirect } from "next/navigation"

// export async function getCampaigns(status?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = { userId: user.id }
//   if (status) {
//     where.status = status.toUpperCase()
//   }

//   const campaigns = await db.campaign.findMany({
//     where,
//     include: {
//       _count: {
//         select: {
//           prospects: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   // Get email stats for each campaign
//   const campaignsWithStats = await Promise.all(
//     campaigns.map(async (campaign) => {
//       const prospects = await db.prospect.findMany({
//         where: { campaignId: campaign.id },
//         select: {
//           emailsReceived: true,
//           emailsOpened: true,
//           emailsReplied: true,
//         },
//       })

//       const totalSent = prospects.reduce((sum, p) => sum + p.emailsReceived, 0)
//       const totalOpened = prospects.reduce((sum, p) => sum + p.emailsOpened, 0)
//       const totalReplied = prospects.reduce((sum, p) => sum + p.emailsReplied, 0)

//       return {
//         ...campaign,
//         totalProspects: campaign._count.prospects,
//         emailsSent: totalSent,
//         emailsOpened: totalOpened,
//         emailsReplied: totalReplied,
//       }
//     }),
//   )

//   return campaignsWithStats
// }

// export async function createCampaign(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const name = formData.get("name") as string
//   const description = formData.get("description") as string
//   const researchDepth = formData.get("researchDepth") as string
//   const personalizationLevel = formData.get("personalizationLevel") as string
//   const tone = formData.get("tone") as string
//   const dailyLimit = Number.parseInt(formData.get("dailyLimit") as string)
//   const trackOpens = formData.get("trackOpens") === "true"
//   const trackClicks = formData.get("trackClicks") === "true"

//   const campaign = await db.campaign.create({
//     data: {
//       userId: user.id,
//       name,
//       description,
//       status: "DRAFT",
//       researchDepth: researchDepth as any,
//       personalizationLevel: personalizationLevel as any,
//       tone: tone as any,
//       dailyLimit,
//       trackOpens,
//       trackClicks,
//     },
//   })

//   revalidatePath("/dashboard/campaigns")
//   redirect(`/dashboard/campaigns/${campaign.id}`)
// }

// export async function updateCampaignStatus(campaignId: string, status: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.campaign.update({
//     where: { id: campaignId, userId: user.id },
//     data: { status: status as any },
//   })

//   revalidatePath("/dashboard/campaigns")
//   revalidatePath(`/dashboard/campaigns/${campaignId}`)
// }

// export async function deleteCampaign(campaignId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.campaign.delete({
//     where: { id: campaignId, userId: user.id },
//   })

//   revalidatePath("/dashboard/campaigns")
//   redirect("/dashboard/campaigns")
// }

// export async function getCampaignById(campaignId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//     include: {
//       prospects: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//       _count: {
//         select: { prospects: true },
//       },
//     },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Calculate stats
//   const allProspects = await db.prospect.findMany({
//     where: { campaignId: campaign.id },
//     select: {
//       emailsReceived: true,
//       emailsOpened: true,
//       emailsClicked: true,
//       emailsReplied: true,
//     },
//   })

//   const stats = {
//     totalProspects: campaign._count.prospects,
//     emailsSent: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
//     emailsOpened: allProspects.reduce((sum, p) => sum + p.emailsOpened, 0),
//     emailsClicked: allProspects.reduce((sum, p) => sum + p.emailsClicked, 0),
//     emailsReplied: allProspects.reduce((sum, p) => sum + p.emailsReplied, 0),
//   }

//   return { ...campaign, stats }
// }

// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { redirect } from "next/navigation"

// export async function getCampaigns(status?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = { userId: user.id }
//   if (status) {
//     where.status = status.toUpperCase()
//   }

//   const campaigns = await db.campaign.findMany({
//     where,
//     include: {
//       _count: {
//         select: {
//           prospects: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   // Get email stats for each campaign
//   const campaignsWithStats = await Promise.all(
//     campaigns.map(async (campaign) => {
//       const prospects = await db.prospect.findMany({
//         where: { campaignId: campaign.id },
//         select: {
//           emailsReceived: true,
//           emailsOpened: true,
//           emailsReplied: true,
//         },
//       })

//       const totalSent = prospects.reduce((sum, p) => sum + p.emailsReceived, 0)
//       const totalOpened = prospects.reduce((sum, p) => sum + p.emailsOpened, 0)
//       const totalReplied = prospects.reduce((sum, p) => sum + p.emailsReplied, 0)

//       return {
//         ...campaign,
//         totalProspects: campaign._count.prospects,
//         emailsSent: totalSent,
//         emailsOpened: totalOpened,
//         emailsReplied: totalReplied,
//       }
//     }),
//   )

//   return campaignsWithStats
// }

// export async function createCampaign(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) return { success: false, error: "Unauthorized" }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) return { success: false, error: "User not found" }

//     const name = formData.get("name") as string
//     const description = formData.get("description") as string
//     const researchDepth = formData.get("researchDepth") as string
//     const personalizationLevel = formData.get("personalizationLevel") as string
//     const toneOfVoice = formData.get("tone") as string
//     const dailySendLimit = Number.parseInt(formData.get("dailyLimit") as string)
//     const trackOpens = formData.get("trackOpens") === "true"
//     const trackClicks = formData.get("trackClicks") === "true"

//     const campaign = await db.campaign.create({
//       data: {
//         userId: user.id,
//         name,
//         description,
//         status: "DRAFT",
//         researchDepth: researchDepth as any,
//         personalizationLevel: personalizationLevel as any,
//         toneOfVoice,
//         dailySendLimit,
//         trackOpens,
//         trackClicks,
//       },
//     })

//     revalidatePath("/dashboard/campaigns")
//     return { success: true, campaignId: campaign.id }
//   } catch (error) {
//     console.error("[v0] Error creating campaign:", error)
//     return { success: false, error: "Failed to create campaign" }
//   }
// }

// export async function updateCampaignStatus(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) throw new Error("Unauthorized")

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) throw new Error("User not found")

//     const campaignId = formData.get("campaignId") as string
//     const status = formData.get("status") as string

//     await db.campaign.update({
//       where: { id: campaignId, userId: user.id },
//       data: { status: status as any },
//     })

//     revalidatePath("/dashboard/campaigns")
//     revalidatePath(`/dashboard/campaigns/${campaignId}`)
//   } catch (error) {
//     console.error("[v0] Error updating campaign status:", error)
//     throw error
//   }
// }

// export async function deleteCampaign(campaignId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.campaign.delete({
//     where: { id: campaignId, userId: user.id },
//   })

//   revalidatePath("/dashboard/campaigns")
//   redirect("/dashboard/campaigns")
// }

// export async function getCampaignById(campaignId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//     include: {
//       prospects: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//       _count: {
//         select: { prospects: true },
//       },
//     },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Calculate stats
//   const allProspects = await db.prospect.findMany({
//     where: { campaignId: campaign.id },
//     select: {
//       emailsReceived: true,
//       emailsOpened: true,
//       emailsClicked: true,
//       emailsReplied: true,
//     },
//   })

//   const stats = {
//     totalProspects: campaign._count.prospects,
//     emailsSent: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
//     emailsOpened: allProspects.reduce((sum, p) => sum + p.emailsOpened, 0),
//     emailsClicked: allProspects.reduce((sum, p) => sum + p.emailsClicked, 0),
//     emailsReplied: allProspects.reduce((sum, p) => sum + p.emailsReplied, 0),
//   }

//   return { ...campaign, stats }
// }

// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { redirect } from "next/navigation"

// export async function getCampaigns(status?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = { userId: user.id }
//   if (status) {
//     where.status = status.toUpperCase()
//   }

//   const campaigns = await db.campaign.findMany({
//     where,
//     include: {
//       _count: {
//         select: {
//           prospects: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   // Get email stats for each campaign
//   const campaignsWithStats = await Promise.all(
//     campaigns.map(async (campaign) => {
//       const prospects = await db.prospect.findMany({
//         where: { campaignId: campaign.id },
//         select: {
//           emailsReceived: true,
//           emailsOpened: true,
//           emailsReplied: true,
//         },
//       })

//       const totalSent = prospects.reduce((sum, p) => sum + p.emailsReceived, 0)
//       const totalOpened = prospects.reduce((sum, p) => sum + p.emailsOpened, 0)
//       const totalReplied = prospects.reduce((sum, p) => sum + p.emailsReplied, 0)

//       return {
//         ...campaign,
//         totalProspects: campaign._count.prospects,
//         emailsSent: totalSent,
//         emailsOpened: totalOpened,
//         emailsReplied: totalReplied,
//       }
//     }),
//   )

//   return campaignsWithStats
// }

// export async function createCampaign(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) return { success: false, error: "Unauthorized" }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) return { success: false, error: "User not found" }

//     const name = formData.get("name") as string
//     const description = formData.get("description") as string
//     const researchDepth = formData.get("researchDepth") as string
//     const personalizationLevel = formData.get("personalizationLevel") as string
//     const toneOfVoice = formData.get("tone") as string
//     const dailySendLimit = Number.parseInt(formData.get("dailyLimit") as string)
//     const trackOpens = formData.get("trackOpens") === "true"
//     const trackClicks = formData.get("trackClicks") === "true"

//     const campaign = await db.campaign.create({
//       data: {
//         userId: user.id,
//         name,
//         description,
//         status: "DRAFT",
//         researchDepth: researchDepth as any,
//         personalizationLevel: personalizationLevel as any,
//         toneOfVoice,
//         dailySendLimit,
//         trackOpens,
//         trackClicks,
//       },
//     })

//     revalidatePath("/dashboard/campaigns")
//     return { success: true, campaignId: campaign.id }
//   } catch (error) {
//     console.error("[v0] Error creating campaign:", error)
//     return { success: false, error: "Failed to create campaign" }
//   }
// }

// export async function updateCampaignStatus(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) throw new Error("Unauthorized")

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) throw new Error("User not found")

//     const campaignId = formData.get("campaignId") as string
//     const status = formData.get("status") as string

//     await db.campaign.update({
//       where: { id: campaignId, userId: user.id },
//       data: { status: status as any },
//     })

//     revalidatePath("/dashboard/campaigns")
//     revalidatePath(`/dashboard/campaigns/${campaignId}`)
//   } catch (error) {
//     console.error("[v0] Error updating campaign status:", error)
//     throw error
//   }
// }

// export async function deleteCampaign(campaignId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.campaign.delete({
//     where: { id: campaignId, userId: user.id },
//   })

//   revalidatePath("/dashboard/campaigns")
//   redirect("/dashboard/campaigns")
// }

// export async function getCampaignById(campaignId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//     include: {
//       prospects: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//       _count: {
//         select: { prospects: true },
//       },
//     },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Calculate stats
//   const allProspects = await db.prospect.findMany({
//     where: { campaignId: campaign.id },
//     select: {
//       emailsReceived: true,
//       emailsOpened: true,
//       emailsClicked: true,
//       emailsReplied: true,
//     },
//   })

//   const stats = {
//     totalProspects: campaign._count.prospects,
//     emailsSent: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
//     emailsDelivered: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
//     emailsOpened: allProspects.reduce((sum, p) => sum + p.emailsOpened, 0),
//     emailsClicked: allProspects.reduce((sum, p) => sum + p.emailsClicked, 0),
//     emailsReplied: allProspects.reduce((sum, p) => sum + p.emailsReplied, 0),
//   }

//   return { ...campaign, stats }
// }

// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getCampaigns(status?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = { userId: user.id }
//   if (status) {
//     where.status = status.toUpperCase()
//   }

//   const campaigns = await db.campaign.findMany({
//     where,
//     include: {
//       _count: {
//         select: {
//           prospects: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   // Get email stats for each campaign
//   const campaignsWithStats = await Promise.all(
//     campaigns.map(async (campaign) => {
//       const prospects = await db.prospect.findMany({
//         where: { campaignId: campaign.id },
//         select: {
//           emailsReceived: true,
//           emailsOpened: true,
//           emailsReplied: true,
//         },
//       })

//       const totalSent = prospects.reduce((sum, p) => sum + p.emailsReceived, 0)
//       const totalOpened = prospects.reduce((sum, p) => sum + p.emailsOpened, 0)
//       const totalReplied = prospects.reduce((sum, p) => sum + p.emailsReplied, 0)

//       return {
//         ...campaign,
//         totalProspects: campaign._count.prospects,
//         emailsSent: totalSent,
//         emailsOpened: totalOpened,
//         emailsReplied: totalReplied,
//       }
//     }),
//   )

//   return campaignsWithStats
// }

// export async function createCampaign(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) return { success: false, error: "Unauthorized" }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) return { success: false, error: "User not found" }

//     const name = formData.get("name") as string
//     const description = formData.get("description") as string
//     const researchDepth = formData.get("researchDepth") as string
//     const personalizationLevel = formData.get("personalizationLevel") as string
//     const toneOfVoice = formData.get("tone") as string
//     const dailySendLimit = Number.parseInt(formData.get("dailyLimit") as string)
//     const trackOpens = formData.get("trackOpens") === "true"
//     const trackClicks = formData.get("trackClicks") === "true"

//     const campaign = await db.campaign.create({
//       data: {
//         userId: user.id,
//         name,
//         description,
//         status: "DRAFT",
//         researchDepth: researchDepth as any,
//         personalizationLevel: personalizationLevel as any,
//         toneOfVoice,
//         dailySendLimit,
//         trackOpens,
//         trackClicks,
//       },
//     })

//     revalidatePath("/dashboard/campaigns")
//     return { success: true, campaignId: campaign.id }
//   } catch (error) {
//     console.error("[v0] Error creating campaign:", error)
//     return { success: false, error: "Failed to create campaign" }
//   }
// }

// export async function updateCampaignStatus(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) throw new Error("Unauthorized")

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) throw new Error("User not found")

//     const campaignId = formData.get("campaignId") as string
//     const status = formData.get("status") as string

//     await db.campaign.update({
//       where: { id: campaignId, userId: user.id },
//       data: { status: status as any },
//     })

//     revalidatePath("/dashboard/campaigns")
//     revalidatePath(`/dashboard/campaigns/${campaignId}`)
//   } catch (error) {
//     console.error("[v0] Error updating campaign status:", error)
//     throw error
//   }
// }

// export async function deleteCampaign(campaignId: string) {
//   try {
//     const { userId } = await auth()
//     if (!userId) throw new Error("Unauthorized")

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) throw new Error("User not found")

//     await db.campaign.delete({
//       where: { id: campaignId, userId: user.id },
//     })

//     revalidatePath("/dashboard/campaigns")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error deleting campaign:", error)
//     return { success: false, error: "Failed to delete campaign" }
//   }
// }

// export async function getCampaignById(campaignId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//     include: {
//       prospects: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//       _count: {
//         select: { prospects: true },
//       },
//     },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Calculate stats
//   const allProspects = await db.prospect.findMany({
//     where: { campaignId: campaign.id },
//     select: {
//       emailsReceived: true,
//       emailsOpened: true,
//       emailsClicked: true,
//       emailsReplied: true,
//     },
//   })

//   const stats = {
//     totalProspects: campaign._count.prospects,
//     emailsSent: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
//     emailsDelivered: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
//     emailsOpened: allProspects.reduce((sum, p) => sum + p.emailsOpened, 0),
//     emailsClicked: allProspects.reduce((sum, p) => sum + p.emailsClicked, 0),
//     emailsReplied: allProspects.reduce((sum, p) => sum + p.emailsReplied, 0),
//   }

//   return { ...campaign, stats }
// }


// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getCampaigns(status?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = { userId: user.id }
//   if (status) {
//     where.status = status.toUpperCase()
//   }

//   const campaigns = await db.campaign.findMany({
//     where,
//     include: {
//       _count: {
//         select: {
//           prospects: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   // Get email stats for each campaign
//   const campaignsWithStats = await Promise.all(
//     campaigns.map(async (campaign) => {
//       const prospects = await db.prospect.findMany({
//         where: { campaignId: campaign.id },
//         select: {
//           emailsReceived: true,
//           emailsOpened: true,
//           emailsReplied: true,
//         },
//       })

//       const totalSent = prospects.reduce((sum, p) => sum + p.emailsReceived, 0)
//       const totalOpened = prospects.reduce((sum, p) => sum + p.emailsOpened, 0)
//       const totalReplied = prospects.reduce((sum, p) => sum + p.emailsReplied, 0)

//       return {
//         ...campaign,
//         totalProspects: campaign._count.prospects,
//         emailsSent: totalSent,
//         emailsOpened: totalOpened,
//         emailsReplied: totalReplied,
//       }
//     }),
//   )

//   return campaignsWithStats
// }

// export async function createCampaign(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) return { success: false, error: "Unauthorized" }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) return { success: false, error: "User not found" }

//     const name = formData.get("name") as string
//     const description = formData.get("description") as string
//     const researchDepth = formData.get("researchDepth") as string
//     const personalizationLevel = formData.get("personalizationLevel") as string
//     const toneOfVoice = formData.get("tone") as string
//     const dailySendLimit = Number.parseInt(formData.get("dailyLimit") as string)
//     const trackOpens = formData.get("trackOpens") === "true"
//     const trackClicks = formData.get("trackClicks") === "true"

//     const campaign = await db.campaign.create({
//       data: {
//         userId: user.id,
//         name,
//         description,
//         status: "DRAFT",
//         researchDepth: researchDepth as any,
//         personalizationLevel: personalizationLevel as any,
//         toneOfVoice,
//         dailySendLimit,
//         trackOpens,
//         trackClicks,
//       },
//     })

//     await db.user.update({
//       where: { id: user.id },
//       data: { hasCreatedCampaign: true },
//     })

//     revalidatePath("/dashboard/campaigns")
//     return { success: true, campaignId: campaign.id }
//   } catch (error) {
//     console.error("[v0] Error creating campaign:", error)
//     return { success: false, error: "Failed to create campaign" }
//   }
// }

// export async function updateCampaignStatus(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) throw new Error("Unauthorized")

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) throw new Error("User not found")

//     const campaignId = formData.get("campaignId") as string
//     const status = formData.get("status") as string

//     await db.campaign.update({
//       where: { id: campaignId, userId: user.id },
//       data: { status: status as any },
//     })

//     revalidatePath("/dashboard/campaigns")
//     revalidatePath(`/dashboard/campaigns/${campaignId}`)
//   } catch (error) {
//     console.error("[v0] Error updating campaign status:", error)
//     throw error
//   }
// }

// export async function deleteCampaign(campaignId: string) {
//   try {
//     const { userId } = await auth()
//     if (!userId) throw new Error("Unauthorized")

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) throw new Error("User not found")

//     await db.campaign.delete({
//       where: { id: campaignId, userId: user.id },
//     })

//     revalidatePath("/dashboard/campaigns")
//     return { success: true }
//   } catch (error) {
//     console.error("[v0] Error deleting campaign:", error)
//     return { success: false, error: "Failed to delete campaign" }
//   }
// }

// export async function getCampaignById(campaignId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//     include: {
//       prospects: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//       _count: {
//         select: { prospects: true },
//       },
//     },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Calculate stats
//   const allProspects = await db.prospect.findMany({
//     where: { campaignId: campaign.id },
//     select: {
//       emailsReceived: true,
//       emailsOpened: true,
//       emailsClicked: true,
//       emailsReplied: true,
//     },
//   })

//   const stats = {
//     totalProspects: campaign._count.prospects,
//     emailsSent: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
//     emailsDelivered: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
//     emailsOpened: allProspects.reduce((sum, p) => sum + p.emailsOpened, 0),
//     emailsClicked: allProspects.reduce((sum, p) => sum + p.emailsClicked, 0),
//     emailsReplied: allProspects.reduce((sum, p) => sum + p.emailsReplied, 0),
//   }

//   return { ...campaign, stats }
// }


"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { updateOnboardingStep } from "./onboarding"

export async function getCampaigns(status?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const where: any = { userId: user.id }
  if (status) {
    where.status = status.toUpperCase()
  }

  const campaigns = await db.campaign.findMany({
    where,
    include: {
      _count: {
        select: {
          prospects: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Get email stats for each campaign
  const campaignsWithStats = await Promise.all(
    campaigns.map(async (campaign) => {
      const prospects = await db.prospect.findMany({
        where: { campaignId: campaign.id },
        select: {
          emailsReceived: true,
          emailsOpened: true,
          emailsReplied: true,
        },
      })

      const totalSent = prospects.reduce((sum, p) => sum + p.emailsReceived, 0)
      const totalOpened = prospects.reduce((sum, p) => sum + p.emailsOpened, 0)
      const totalReplied = prospects.reduce((sum, p) => sum + p.emailsReplied, 0)

      return {
        ...campaign,
        totalProspects: campaign._count.prospects,
        emailsSent: totalSent,
        emailsOpened: totalOpened,
        emailsReplied: totalReplied,
      }
    }),
  )

  return campaignsWithStats
}

export async function createCampaign(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) return { success: false, error: "Unauthorized" }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) return { success: false, error: "User not found" }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const researchDepth = formData.get("researchDepth") as string
    const personalizationLevel = formData.get("personalizationLevel") as string
    const toneOfVoice = formData.get("tone") as string
    const dailySendLimit = Number.parseInt(formData.get("dailyLimit") as string)
    const trackOpens = formData.get("trackOpens") === "true"
    const trackClicks = formData.get("trackClicks") === "true"

    const campaign = await db.campaign.create({
      data: {
        userId: user.id,
        name,
        description,
        status: "DRAFT",
        researchDepth: researchDepth as any,
        personalizationLevel: personalizationLevel as any,
        toneOfVoice,
        dailySendLimit,
        trackOpens,
        trackClicks,
      },
    })

    await updateOnboardingStep("hasCreatedCampaign")

    revalidatePath("/dashboard/campaigns")
    return { success: true, campaignId: campaign.id }
  } catch (error) {
    console.error("[v0] Error creating campaign:", error)
    return { success: false, error: "Failed to create campaign" }
  }
}

export async function updateCampaignStatus(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    const campaignId = formData.get("campaignId") as string
    const status = formData.get("status") as string

    await db.campaign.update({
      where: { id: campaignId, userId: user.id },
      data: { status: status as any },
    })

    revalidatePath("/dashboard/campaigns")
    revalidatePath(`/dashboard/campaigns/${campaignId}`)
  } catch (error) {
    console.error("[v0] Error updating campaign status:", error)
    throw error
  }
}

export async function deleteCampaign(campaignId: string) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    await db.campaign.delete({
      where: { id: campaignId, userId: user.id },
    })

    revalidatePath("/dashboard/campaigns")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting campaign:", error)
    return { success: false, error: "Failed to delete campaign" }
  }
}

export async function getCampaignById(campaignId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const campaign = await db.campaign.findUnique({
    where: { id: campaignId, userId: user.id },
    include: {
      prospects: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: { prospects: true },
      },
    },
  })

  if (!campaign) throw new Error("Campaign not found")

  // Calculate stats
  const allProspects = await db.prospect.findMany({
    where: { campaignId: campaign.id },
    select: {
      emailsReceived: true,
      emailsOpened: true,
      emailsClicked: true,
      emailsReplied: true,
    },
  })

  const stats = {
    totalProspects: campaign._count.prospects,
    emailsSent: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
    emailsDelivered: allProspects.reduce((sum, p) => sum + p.emailsReceived, 0),
    emailsOpened: allProspects.reduce((sum, p) => sum + p.emailsOpened, 0),
    emailsClicked: allProspects.reduce((sum, p) => sum + p.emailsClicked, 0),
    emailsReplied: allProspects.reduce((sum, p) => sum + p.emailsReplied, 0),
  }

  return { ...campaign, stats }
}

export async function updateCampaignWizardProgress(
  campaignId: string,
  step: string,
  completedSteps: string[],
  data?: any,
) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    await db.campaign.update({
      where: { id: campaignId, userId: user.id },
      data: {
        wizardStep: step,
        wizardCompletedSteps: completedSteps,
        wizardData: data || {},
        updatedAt: new Date(),
      },
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating wizard progress:", error)
    return { success: false, error: "Failed to update wizard progress" }
  }
}

export async function getDraftCampaigns() {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) throw new Error("User not found")

    const draftCampaigns = await db.campaign.findMany({
      where: {
        userId: user.id,
        status: "DRAFT",
      },
      include: {
        _count: {
          select: {
            prospects: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return draftCampaigns
  } catch (error) {
    console.error("[v0] Error fetching draft campaigns:", error)
    return []
  }
}
