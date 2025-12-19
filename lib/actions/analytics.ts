
"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function getAnalyticsOverview() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  // Get all campaigns for the user
  const campaigns = await db.campaign.findMany({
    where: { userId: user.id },
  })

  // Calculate totals
  const totals = campaigns.reduce(
    (acc, campaign) => ({
      emailsSent: acc.emailsSent + campaign.emailsSent,
      emailsDelivered: acc.emailsDelivered + campaign.emailsDelivered,
      emailsOpened: acc.emailsOpened + campaign.emailsOpened,
      emailsClicked: acc.emailsClicked + campaign.emailsClicked,
      emailsReplied: acc.emailsReplied + campaign.emailsReplied,
      emailsBounced: acc.emailsBounced + campaign.emailsBounced,
    }),
    {
      emailsSent: 0,
      emailsDelivered: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      emailsReplied: 0,
      emailsBounced: 0,
    },
  )

  // Calculate rates
  const deliveryRate = totals.emailsSent > 0 ? (totals.emailsDelivered / totals.emailsSent) * 100 : 0
  const openRate = totals.emailsDelivered > 0 ? (totals.emailsOpened / totals.emailsDelivered) * 100 : 0
  const clickRate = totals.emailsOpened > 0 ? (totals.emailsClicked / totals.emailsOpened) * 100 : 0
  const replyRate = totals.emailsDelivered > 0 ? (totals.emailsReplied / totals.emailsDelivered) * 100 : 0

  return {
    ...totals,
    deliveryRate: Math.round(deliveryRate * 10) / 10,
    openRate: Math.round(openRate * 10) / 10,
    clickRate: Math.round(clickRate * 10) / 10,
    replyRate: Math.round(replyRate * 10) / 10,
    activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
    totalProspects: campaigns.reduce((acc, c) => acc + c.totalProspects, 0),
  }
}

export async function getAnalyticsData() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  // Get all campaigns for the user
  const campaigns = await db.campaign.findMany({
    where: { userId: user.id },
  })

  // Calculate totals
  const totals = campaigns.reduce(
    (acc, campaign) => ({
      emailsSent: acc.emailsSent + campaign.emailsSent,
      emailsDelivered: acc.emailsDelivered + campaign.emailsDelivered,
      emailsOpened: acc.emailsOpened + campaign.emailsOpened,
      emailsClicked: acc.emailsClicked + campaign.emailsClicked,
      emailsReplied: acc.emailsReplied + campaign.emailsReplied,
      emailsBounced: acc.emailsBounced + campaign.emailsBounced,
    }),
    {
      emailsSent: 0,
      emailsDelivered: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      emailsReplied: 0,
      emailsBounced: 0,
    },
  )

  // Calculate rates
  const deliveryRate = totals.emailsSent > 0 ? (totals.emailsDelivered / totals.emailsSent) * 100 : 0
  const openRate = totals.emailsDelivered > 0 ? (totals.emailsOpened / totals.emailsDelivered) * 100 : 0
  const clickRate = totals.emailsOpened > 0 ? (totals.emailsClicked / totals.emailsOpened) * 100 : 0
  const replyRate = totals.emailsDelivered > 0 ? (totals.emailsReplied / totals.emailsDelivered) * 100 : 0

  return {
    ...totals,
    deliveryRate: Math.round(deliveryRate * 10) / 10,
    openRate: Math.round(openRate * 10) / 10,
    clickRate: Math.round(clickRate * 10) / 10,
    replyRate: Math.round(replyRate * 10) / 10,
    activeCampaigns: campaigns.filter((c) => c.status === "ACTIVE").length,
    totalProspects: campaigns.reduce((acc, c) => acc + c.totalProspects, 0),
  }
}

export async function getCampaignPerformance() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const campaigns = await db.campaign.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  return campaigns.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    emailsSent: campaign.emailsSent,
    emailsDelivered: campaign.emailsDelivered,
    emailsOpened: campaign.emailsOpened,
    emailsClicked: campaign.emailsClicked,
    emailsReplied: campaign.emailsReplied,
    deliveryRate:
      campaign.emailsSent > 0 ? Math.round((campaign.emailsDelivered / campaign.emailsSent) * 1000) / 10 : 0,
    openRate:
      campaign.emailsDelivered > 0 ? Math.round((campaign.emailsOpened / campaign.emailsDelivered) * 1000) / 10 : 0,
    clickRate: campaign.emailsOpened > 0 ? Math.round((campaign.emailsClicked / campaign.emailsOpened) * 1000) / 10 : 0,
    replyRate:
      campaign.emailsDelivered > 0 ? Math.round((campaign.emailsReplied / campaign.emailsDelivered) * 1000) / 10 : 0,
  }))
}

export async function getCampaignAnalytics(campaignId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const campaign = await db.campaign.findUnique({
    where: { id: campaignId, userId: user.id },
    include: {
      analytics: {
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  })

  if (!campaign) throw new Error("Campaign not found")

  return campaign
}

export async function getEmailMetrics() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const prospects = await db.prospect.findMany({
    where: {
      campaign: {
        userId: user.id,
      },
    },
  })

  const metrics = {
    totalSent: prospects.reduce((sum, p) => sum + p.emailsReceived, 0),
    delivered: prospects.reduce((sum, p) => sum + p.emailsReceived, 0),
    opened: prospects.reduce((sum, p) => sum + p.emailsOpened, 0),
    clicked: prospects.reduce((sum, p) => sum + p.emailsClicked, 0),
    replied: prospects.reduce((sum, p) => sum + p.emailsReplied, 0),
    bounced: prospects.filter((p) => p.bounced).length,
    unsubscribed: prospects.filter((p) => p.unsubscribed).length,
  }

  return { metrics, bestTimes: [] }
}

export async function getProspectEngagement() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const prospects = await db.prospect.findMany({
    where: {
      campaign: {
        userId: user.id,
      },
    },
    orderBy: { qualityScore: "desc" },
    take: 10,
  })

  const engagementLevels = {
    hot: prospects.filter((p) => p.emailsReplied > 0).length,
    warm: prospects.filter((p) => p.emailsOpened > 0 && p.emailsReplied === 0).length,
    cold: prospects.filter((p) => p.emailsReceived > 0 && p.emailsOpened === 0).length,
    unresponsive: prospects.filter((p) => p.emailsReceived === 0).length,
  }

  const topProspects = prospects.slice(0, 5).map((p) => ({
    id: p.id,
    firstName: p.firstName || "",
    lastName: p.lastName || "",
    company: p.company || "",
    qualityScore: p.qualityScore || 0,
    emailsSent: p.emailsReceived,
    emailsReplied: p.emailsReplied,
  }))

  return { engagementLevels, topProspects }
}

export async function getRevenueData() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error("User not found")

  const campaigns = await db.campaign.findMany({
    where: { userId: user.id },
  })

  const revenueData = campaigns.map((c) => ({
    campaignId: c.id,
    campaignName: c.name,
    revenue: 0,
    deals: 0,
  }))

  return { revenueData, previousMonthRevenue: 0 }
}
