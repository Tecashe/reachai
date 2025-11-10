// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { redirect } from "next/navigation"

// export async function getProspects(status?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = {
//     campaign: {
//       userId: user.id,
//     },
//   }

//   if (status) {
//     where.status = status
//   }

//   const prospects = await db.prospect.findMany({
//     where,
//     include: {
//       campaign: {
//         select: {
//           name: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return prospects
// }

// export async function createProspect(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const campaignId = formData.get("campaignId") as string
//   const email = formData.get("email") as string
//   const firstName = formData.get("firstName") as string
//   const lastName = formData.get("lastName") as string
//   const company = formData.get("company") as string
//   const jobTitle = formData.get("jobTitle") as string
//   const linkedinUrl = formData.get("linkedinUrl") as string
//   const websiteUrl = formData.get("websiteUrl") as string

//   const prospect = await db.prospect.create({
//     data: {
//       userId: user.id,
//       campaignId,
//       email,
//       firstName,
//       lastName,
//       company,
//       jobTitle,
//       linkedinUrl,
//       websiteUrl,
//       status: "ACTIVE",
//       qualityScore: 0,
//     },
//   })

//   revalidatePath("/dashboard/prospects")
//   redirect(`/dashboard/prospects/${prospect.id}`)
// }

// export async function uploadProspects(campaignId: string, prospects: any[]) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   // Verify campaign belongs to user
//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Create prospects in bulk
//   const created = await db.prospect.createMany({
//     data: prospects.map((p) => ({
//       userId: user.id,
//       campaignId,
//       email: p.email,
//       firstName: p.firstName || "",
//       lastName: p.lastName || "",
//       company: p.company || "",
//       jobTitle: p.jobTitle || "",
//       linkedinUrl: p.linkedinUrl || "",
//       websiteUrl: p.websiteUrl || p.companyWebsite || "",
//       status: "ACTIVE",
//       qualityScore: 0,
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/dashboard/prospects")
//   revalidatePath(`/dashboard/campaigns/${campaignId}`)

//   return { count: created.count }
// }

// export async function getProspectById(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const prospect = await db.prospect.findFirst({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//     include: {
//       campaign: true,
//       emailLogs: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//     },
//   })

//   if (!prospect) throw new Error("Prospect not found")

//   return prospect
// }

// export async function deleteProspect(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.prospect.delete({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//   })

//   revalidatePath("/dashboard/prospects")
// }

// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"

// export async function getProspects(status?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = {
//     campaign: {
//       userId: user.id,
//     },
//   }

//   if (status) {
//     where.status = status
//   }

//   const prospects = await db.prospect.findMany({
//     where,
//     include: {
//       campaign: {
//         select: {
//           name: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return prospects
// }

// export async function createProspect(formData: FormData) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const campaignId = formData.get("campaignId") as string
//   const email = formData.get("email") as string
//   const firstName = formData.get("firstName") as string
//   const lastName = formData.get("lastName") as string
//   const company = formData.get("company") as string
//   const jobTitle = formData.get("jobTitle") as string
//   const linkedinUrl = formData.get("linkedinUrl") as string
//   const websiteUrl = formData.get("websiteUrl") as string

//   const prospect = await db.prospect.create({
//     data: {
//       userId: user.id,
//       campaignId,
//       email,
//       firstName,
//       lastName,
//       company,
//       jobTitle,
//       linkedinUrl,
//       websiteUrl,
//       status: "ACTIVE",
//       qualityScore: 0,
//     },
//   })

//   revalidatePath("/dashboard/prospects")
//   return { success: true, prospectId: prospect.id }
// }

// export async function uploadProspects(campaignId: string, prospects: any[]) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   // Verify campaign belongs to user
//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Create prospects in bulk
//   const created = await db.prospect.createMany({
//     data: prospects.map((p) => ({
//       userId: user.id,
//       campaignId,
//       email: p.email,
//       firstName: p.firstName || "",
//       lastName: p.lastName || "",
//       company: p.company || "",
//       jobTitle: p.jobTitle || "",
//       linkedinUrl: p.linkedinUrl || "",
//       websiteUrl: p.websiteUrl || p.companyWebsite || "",
//       status: "ACTIVE",
//       qualityScore: 0,
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/dashboard/prospects")
//   revalidatePath(`/dashboard/campaigns/${campaignId}`)

//   return { count: created.count }
// }

// export async function getProspectById(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const prospect = await db.prospect.findFirst({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//     include: {
//       campaign: true,
//       emailLogs: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//     },
//   })

//   if (!prospect) throw new Error("Prospect not found")

//   return prospect
// }

// export async function deleteProspect(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.prospect.delete({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//   })

//   revalidatePath("/dashboard/prospects")
// }




// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { Prisma } from "@prisma/client"

// export async function getProspects(status?: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = {
//     campaign: {
//       userId: user.id,
//     },
//   }

//   if (status) {
//     where.status = status
//   }

//   const prospects = await db.prospect.findMany({
//     where,
//     include: {
//       campaign: {
//         select: {
//           name: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return prospects
// }

// export async function createProspect(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return { success: false, error: "You must be logged in to add prospects" }
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return { success: false, error: "User account not found" }
//     }

//     const campaignId = formData.get("campaignId") as string
//     const email = formData.get("email") as string
//     const firstName = formData.get("firstName") as string
//     const lastName = formData.get("lastName") as string
//     const company = formData.get("company") as string
//     const jobTitle = formData.get("jobTitle") as string
//     const linkedinUrl = formData.get("linkedinUrl") as string
//     const websiteUrl = formData.get("websiteUrl") as string

//     if (!email || !campaignId) {
//       return { success: false, error: "Email and campaign are required" }
//     }

//     const prospect = await db.prospect.create({
//       data: {
//         userId: user.id,
//         campaignId,
//         email,
//         firstName,
//         lastName,
//         company,
//         jobTitle,
//         linkedinUrl,
//         websiteUrl,
//         status: "ACTIVE",
//         qualityScore: 0,
//       },
//     })

//     revalidatePath("/dashboard/prospects")
//     return { success: true, prospectId: prospect.id }
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === "P2002") {
//         return {
//           success: false,
//           error:
//             "This prospect already exists in the selected campaign. Each email can only be added once per campaign.",
//         }
//       }
//     }
//     console.error("Error creating prospect:", error)
//     return { success: false, error: "Failed to create prospect. Please try again." }
//   }
// }

// export async function uploadProspects(campaignId: string, prospects: any[]) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   // Verify campaign belongs to user
//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Create prospects in bulk
//   const created = await db.prospect.createMany({
//     data: prospects.map((p) => ({
//       userId: user.id,
//       campaignId,
//       email: p.email,
//       firstName: p.firstName || "",
//       lastName: p.lastName || "",
//       company: p.company || "",
//       jobTitle: p.jobTitle || "",
//       linkedinUrl: p.linkedinUrl || "",
//       websiteUrl: p.websiteUrl || p.companyWebsite || "",
//       status: "ACTIVE",
//       qualityScore: 0,
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/dashboard/prospects")
//   revalidatePath(`/dashboard/campaigns/${campaignId}`)

//   return { count: created.count }
// }

// export async function getProspectById(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const prospect = await db.prospect.findFirst({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//     include: {
//       campaign: true,
//       emailLogs: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//     },
//   })

//   if (!prospect) throw new Error("Prospect not found")

//   return prospect
// }

// export async function deleteProspect(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.prospect.delete({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//   })

//   revalidatePath("/dashboard/prospects")
// }



// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { Prisma } from "@prisma/client"
// import { updateOnboardingStep } from "./onboarding"

// export async function getProspects(
//   status?: string,
//   folderId?: string | null,
//   isTrashed?: boolean,
//   searchQuery?: string,
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = {
//     campaign: {
//       userId: user.id,
//     },
//     isTrashed: isTrashed || false,
//   }

//   if (status) {
//     where.status = status
//   }

//   if (folderId !== undefined) {
//     where.folderId = folderId
//   }

//   if (searchQuery) {
//     where.OR = [
//       { email: { contains: searchQuery, mode: "insensitive" } },
//       { firstName: { contains: searchQuery, mode: "insensitive" } },
//       { lastName: { contains: searchQuery, mode: "insensitive" } },
//       { company: { contains: searchQuery, mode: "insensitive" } },
//     ]
//   }

//   const prospects = await db.prospect.findMany({
//     where,
//     include: {
//       campaign: {
//         select: {
//           name: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return prospects
// }

// export async function createProspect(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return { success: false, error: "You must be logged in to add prospects" }
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return { success: false, error: "User account not found" }
//     }

//     const campaignId = formData.get("campaignId") as string
//     const email = formData.get("email") as string
//     const firstName = formData.get("firstName") as string
//     const lastName = formData.get("lastName") as string
//     const company = formData.get("company") as string
//     const jobTitle = formData.get("jobTitle") as string
//     const linkedinUrl = formData.get("linkedinUrl") as string
//     const websiteUrl = formData.get("websiteUrl") as string

//     if (!email || !campaignId) {
//       return { success: false, error: "Email and campaign are required" }
//     }

//     const prospect = await db.prospect.create({
//       data: {
//         userId: user.id,
//         campaignId,
//         email,
//         firstName,
//         lastName,
//         company,
//         jobTitle,
//         linkedinUrl,
//         websiteUrl,
//         status: "ACTIVE",
//         qualityScore: 0,
//       },
//     })

//     await updateOnboardingStep("hasAddedProspects")

//     revalidatePath("/dashboard/prospects")
//     return { success: true, prospectId: prospect.id }
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === "P2002") {
//         return {
//           success: false,
//           error:
//             "This prospect already exists in the selected campaign. Each email can only be added once per campaign.",
//         }
//       }
//     }
//     console.error("Error creating prospect:", error)
//     return { success: false, error: "Failed to create prospect. Please try again." }
//   }
// }

// export async function uploadProspects(campaignId: string, prospects: any[]) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   // Verify campaign belongs to user
//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Create prospects in bulk
//   const created = await db.prospect.createMany({
//     data: prospects.map((p) => ({
//       userId: user.id,
//       campaignId,
//       email: p.email,
//       firstName: p.firstName || "",
//       lastName: p.lastName || "",
//       company: p.company || "",
//       jobTitle: p.jobTitle || "",
//       linkedinUrl: p.linkedinUrl || "",
//       websiteUrl: p.websiteUrl || p.companyWebsite || "",
//       status: "ACTIVE",
//       qualityScore: 0,
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/dashboard/prospects")
//   revalidatePath(`/dashboard/campaigns/${campaignId}`)

//   return { count: created.count }
// }

// export async function getProspectById(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const prospect = await db.prospect.findFirst({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//     include: {
//       campaign: true,
//       emailLogs: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//     },
//   })

//   if (!prospect) throw new Error("Prospect not found")

//   return prospect
// }

// export async function deleteProspect(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.prospect.delete({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//   })

//   revalidatePath("/dashboard/prospects")
// }


// "use server"

// import { auth } from "@clerk/nextjs/server"
// import { db } from "@/lib/db"
// import { revalidatePath } from "next/cache"
// import { Prisma } from "@prisma/client"
// import { updateOnboardingStep } from "./onboarding"

// export async function getProspects(
//   status?: string,
//   folderId?: string | null,
//   isTrashed?: boolean,
//   searchQuery?: string,
// ) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const where: any = {
//     campaign: {
//       userId: user.id,
//     },
//     isTrashed: isTrashed || false,
//   }

//   if (status) {
//     where.status = status
//   }

//   if (folderId !== undefined) {
//     where.folderId = folderId
//   }

//   if (searchQuery) {
//     where.OR = [
//       { email: { contains: searchQuery, mode: "insensitive" } },
//       { firstName: { contains: searchQuery, mode: "insensitive" } },
//       { lastName: { contains: searchQuery, mode: "insensitive" } },
//       { company: { contains: searchQuery, mode: "insensitive" } },
//     ]
//   }

//   const prospects = await db.prospect.findMany({
//     where,
//     include: {
//       campaign: {
//         select: {
//           name: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   })

//   return prospects
// }

// export async function createProspect(formData: FormData) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return { success: false, error: "You must be logged in to add prospects" }
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       return { success: false, error: "User account not found" }
//     }

//     const campaignId = formData.get("campaignId") as string
//     const email = formData.get("email") as string
//     const firstName = formData.get("firstName") as string
//     const lastName = formData.get("lastName") as string
//     const company = formData.get("company") as string
//     const jobTitle = formData.get("jobTitle") as string
//     const linkedinUrl = formData.get("linkedinUrl") as string
//     const websiteUrl = formData.get("websiteUrl") as string

//     if (!email || !campaignId) {
//       return { success: false, error: "Email and campaign are required" }
//     }

//     const prospect = await db.prospect.create({
//       data: {
//         userId: user.id,
//         campaignId,
//         email,
//         firstName,
//         lastName,
//         company,
//         jobTitle,
//         linkedinUrl,
//         websiteUrl,
//         status: "ACTIVE",
//         qualityScore: 0,
//       },
//     })

//     await updateOnboardingStep("hasAddedProspects")

//     revalidatePath("/dashboard/prospects")
//     return { success: true, prospectId: prospect.id }
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === "P2002") {
//         return {
//           success: false,
//           error:
//             "This prospect already exists in the selected campaign. Each email can only be added once per campaign.",
//         }
//       }
//     }
//     console.error("Error creating prospect:", error)
//     return { success: false, error: "Failed to create prospect. Please try again." }
//   }
// }

// export async function uploadProspects(campaignId: string, prospects: any[]) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   // Verify campaign belongs to user
//   const campaign = await db.campaign.findUnique({
//     where: { id: campaignId, userId: user.id },
//   })

//   if (!campaign) throw new Error("Campaign not found")

//   // Create prospects in bulk
//   const created = await db.prospect.createMany({
//     data: prospects.map((p) => ({
//       userId: user.id,
//       campaignId,
//       email: p.email,
//       firstName: p.firstName || "",
//       lastName: p.lastName || "",
//       company: p.company || "",
//       jobTitle: p.jobTitle || "",
//       linkedinUrl: p.linkedinUrl || "",
//       websiteUrl: p.websiteUrl || p.companyWebsite || "",
//       status: "ACTIVE",
//       qualityScore: 0,
//     })),
//     skipDuplicates: true,
//   })

//   revalidatePath("/dashboard/prospects")
//   revalidatePath(`/dashboard/campaigns/${campaignId}`)

//   return { count: created.count }
// }

// export async function getProspectById(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   const prospect = await db.prospect.findFirst({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//     include: {
//       campaign: true,
//       emailLogs: {
//         orderBy: { createdAt: "desc" },
//         take: 10,
//       },
//     },
//   })

//   if (!prospect) throw new Error("Prospect not found")

//   return prospect
// }

// export async function deleteProspect(prospectId: string) {
//   const { userId } = await auth()
//   if (!userId) throw new Error("Unauthorized")

//   const user = await db.user.findUnique({
//     where: { clerkId: userId },
//   })

//   if (!user) throw new Error("User not found")

//   await db.prospect.delete({
//     where: {
//       id: prospectId,
//       campaign: {
//         userId: user.id,
//       },
//     },
//   })

//   revalidatePath("/dashboard/prospects")
// }


"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { Prisma } from "@prisma/client"
import { updateOnboardingStep } from "./onboarding"

export async function getProspects(
  status?: string,
  folderId?: string | null,
  isTrashed?: boolean,
  searchQuery?: string,
) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const where: any = {
    campaign: {
      userId: user.id,
    },
    isTrashed: isTrashed || false,
  }

  if (status) {
    where.status = status
  }

  if (folderId !== undefined) {
    where.folderId = folderId
  }

  if (searchQuery) {
    where.OR = [
      { email: { contains: searchQuery, mode: "insensitive" } },
      { firstName: { contains: searchQuery, mode: "insensitive" } },
      { lastName: { contains: searchQuery, mode: "insensitive" } },
      { company: { contains: searchQuery, mode: "insensitive" } },
    ]
  }

  const prospects = await db.prospect.findMany({
    where,
    include: {
      campaign: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return prospects
}

export async function createProspect(formData: FormData) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return { success: false, error: "You must be logged in to add prospects" }
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!user) {
      return { success: false, error: "User account not found" }
    }

    const campaignId = formData.get("campaignId") as string
    const email = formData.get("email") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const company = formData.get("company") as string
    const jobTitle = formData.get("jobTitle") as string
    const linkedinUrl = formData.get("linkedinUrl") as string
    const websiteUrl = formData.get("websiteUrl") as string

    if (!email || !campaignId) {
      return { success: false, error: "Email and campaign are required" }
    }

    const prospect = await db.prospect.create({
      data: {
        userId: user.id,
        campaignId,
        email,
        firstName,
        lastName,
        company,
        jobTitle,
        linkedinUrl,
        websiteUrl,
        status: "ACTIVE",
        qualityScore: 0,
      },
    })

    await updateOnboardingStep("hasAddedProspects")

    revalidatePath("/dashboard/prospects")
    return { success: true, prospectId: prospect.id }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          error:
            "This prospect already exists in the selected campaign. Each email can only be added once per campaign.",
        }
      }
    }
    console.error("Error creating prospect:", error)
    return { success: false, error: "Failed to create prospect. Please try again." }
  }
}

export async function uploadProspects(campaignId: string, prospects: any[]) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  // Verify campaign belongs to user
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId, userId: user.id },
  })

  if (!campaign) throw new Error("Campaign not found")

  // Create prospects in bulk
  const created = await db.prospect.createMany({
    data: prospects.map((p) => ({
      userId: user.id,
      campaignId,
      email: p.email,
      firstName: p.firstName || "",
      lastName: p.lastName || "",
      company: p.company || "",
      jobTitle: p.jobTitle || "",
      linkedinUrl: p.linkedinUrl || "",
      websiteUrl: p.websiteUrl || p.companyWebsite || "",
      status: "ACTIVE",
      qualityScore: 0,
    })),
    skipDuplicates: true,
  })

  revalidatePath("/dashboard/prospects")
  revalidatePath(`/dashboard/campaigns/${campaignId}`)

  return { count: created.count }
}

export async function getProspectById(prospectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const prospect = await db.prospect.findFirst({
    where: {
      id: prospectId,
      campaign: {
        userId: user.id,
      },
    },
    include: {
      campaign: true,
      emailLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!prospect) throw new Error("Prospect not found")

  return prospect
}

export async function deleteProspect(prospectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  await db.prospect.delete({
    where: {
      id: prospectId,
      campaign: {
        userId: user.id,
      },
    },
  })

  revalidatePath("/dashboard/prospects")
}

export async function bulkMoveToFolder(prospectIds: string[], folderId: string | null) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  await db.prospect.updateMany({
    where: {
      id: { in: prospectIds },
      campaign: {
        userId: user.id,
      },
    },
    data: {
      folderId,
    },
  })

  revalidatePath("/dashboard/prospects")
  return { success: true }
}

export async function bulkDeleteProspects(prospectIds: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  await db.prospect.updateMany({
    where: {
      id: { in: prospectIds },
      campaign: {
        userId: user.id,
      },
    },
    data: {
      isTrashed: true,
      trashedAt: new Date(),
    },
  })

  revalidatePath("/dashboard/prospects")
  return { success: true }
}

export async function bulkRestoreProspects(prospectIds: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  await db.prospect.updateMany({
    where: {
      id: { in: prospectIds },
      campaign: {
        userId: user.id,
      },
    },
    data: {
      isTrashed: false,
      trashedAt: null,
    },
  })

  revalidatePath("/dashboard/prospects")
  return { success: true }
}

export async function removeDuplicates(prospectIds: string[], keepProspectId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const toDelete = prospectIds.filter((id) => id !== keepProspectId)

  await db.prospect.updateMany({
    where: {
      id: { in: toDelete },
      campaign: {
        userId: user.id,
      },
    },
    data: {
      isTrashed: true,
      trashedAt: new Date(),
    },
  })

  revalidatePath("/dashboard/prospects")
  return { success: true, removed: toDelete.length }
}
