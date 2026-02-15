import { z } from "zod"
import { tool } from "ai"
import { db } from "@/lib/db"

// ==========================================
// Mailfra AI Agent Tools
// All tools require a userId to scope data
// ==========================================

export function createMailfraTools(userId: string, dbUserId: string) {
    return {
        // ─────────────────────────────────────────
        // 1. RETRIEVE LEADS / PROSPECTS
        // ─────────────────────────────────────────
        retrieve_leads: tool({
            description:
                "Search and retrieve leads/prospects from the user's database. Can filter by industry, company, status, score, date range, and more. Returns structured lead data. Use this when the user asks to find, search, list, or show leads/prospects.",
            parameters: z.object({
                industry: z.string().optional().describe("Filter by industry (e.g. 'SaaS', 'Healthcare', 'Finance')"),
                company: z.string().optional().describe("Filter by company name (partial match)"),
                status: z.enum(["ACTIVE", "CONTACTED", "REPLIED", "BOUNCED", "UNSUBSCRIBED", "PAUSED"]).optional().describe("Filter by prospect status"),
                minScore: z.number().optional().describe("Minimum quality score (0-100)"),
                maxScore: z.number().optional().describe("Maximum quality score (0-100)"),
                hasReplied: z.boolean().optional().describe("Filter for prospects who have replied"),
                jobTitle: z.string().optional().describe("Filter by job title (partial match)"),
                limit: z.number().min(1).max(50).default(10).describe("Number of results to return (max 50)"),
                sortBy: z.enum(["score", "recent", "engagement", "name"]).default("score").describe("Sort order"),
                campaignId: z.string().optional().describe("Filter by specific campaign ID"),
            }),
            execute: async (args) => {
                const where: any = { userId: dbUserId }

                if (args.industry) where.industry = { contains: args.industry, mode: "insensitive" }
                if (args.company) where.company = { contains: args.company, mode: "insensitive" }
                if (args.status) where.status = args.status
                if (args.minScore !== undefined || args.maxScore !== undefined) {
                    where.qualityScore = {}
                    if (args.minScore !== undefined) where.qualityScore.gte = args.minScore
                    if (args.maxScore !== undefined) where.qualityScore.lte = args.maxScore
                }
                if (args.hasReplied !== undefined) where.replied = args.hasReplied
                if (args.jobTitle) where.jobTitle = { contains: args.jobTitle, mode: "insensitive" }
                if (args.campaignId) where.campaignId = args.campaignId

                const orderBy: any = {}
                switch (args.sortBy) {
                    case "score":
                        orderBy.qualityScore = "desc"
                        break
                    case "recent":
                        orderBy.createdAt = "desc"
                        break
                    case "engagement":
                        orderBy.emailsOpened = "desc"
                        break
                    case "name":
                        orderBy.firstName = "asc"
                        break
                }

                const prospects = await db.prospect.findMany({
                    where,
                    orderBy,
                    take: args.limit,
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        company: true,
                        jobTitle: true,
                        industry: true,
                        qualityScore: true,
                        status: true,
                        replied: true,
                        emailsReceived: true,
                        emailsOpened: true,
                        emailsClicked: true,
                        emailsReplied: true,
                        lastContactedAt: true,
                        dealScore: true,
                        createdAt: true,
                        campaign: { select: { id: true, name: true } },
                    },
                })

                const total = await db.prospect.count({ where })

                return {
                    success: true,
                    total,
                    showing: prospects.length,
                    leads: prospects.map((p) => ({
                        id: p.id,
                        name: `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Unknown",
                        email: p.email,
                        company: p.company || "N/A",
                        jobTitle: p.jobTitle || "N/A",
                        industry: p.industry || "N/A",
                        score: p.qualityScore ?? 0,
                        dealScore: p.dealScore ?? 0,
                        status: p.status,
                        replied: p.replied,
                        engagement: {
                            sent: p.emailsReceived,
                            opened: p.emailsOpened,
                            clicked: p.emailsClicked,
                            replied: p.emailsReplied,
                        },
                        lastContacted: p.lastContactedAt?.toISOString() || "Never",
                        campaign: p.campaign?.name || "None",
                        createdAt: p.createdAt.toISOString(),
                    })),
                }
            },
        }),

        // ─────────────────────────────────────────
        // 2. ANALYZE CAMPAIGN PERFORMANCE
        // ─────────────────────────────────────────
        analyze_campaign: tool({
            description:
                "Analyze a specific campaign's performance or get an overview of all campaigns. Returns metrics like open rate, reply rate, bounce rate, and AI-generated insights. Use when the user asks about campaign performance, stats, or analytics.",
            parameters: z.object({
                campaignName: z.string().optional().describe("Name of the campaign to analyze (partial match). If not provided, shows overview of all campaigns."),
                campaignId: z.string().optional().describe("Specific campaign ID to analyze"),
            }),
            execute: async (args) => {
                const where: any = { userId: dbUserId }
                if (args.campaignId) where.id = args.campaignId
                if (args.campaignName) where.name = { contains: args.campaignName, mode: "insensitive" }

                const campaigns = await db.campaign.findMany({
                    where,
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        totalProspects: true,
                        emailsSent: true,
                        emailsDelivered: true,
                        emailsOpened: true,
                        emailsClicked: true,
                        emailsReplied: true,
                        emailsBounced: true,
                        launchedAt: true,
                        createdAt: true,
                        toneOfVoice: true,
                        personalizationLevel: true,
                        researchDepth: true,
                    },
                    orderBy: { createdAt: "desc" },
                    take: args.campaignId || args.campaignName ? 1 : 10,
                })

                if (campaigns.length === 0) {
                    return { success: false, message: "No campaigns found matching your criteria." }
                }

                return {
                    success: true,
                    campaigns: campaigns.map((c) => {
                        const openRate = c.emailsSent > 0 ? ((c.emailsOpened / c.emailsSent) * 100).toFixed(1) : "0"
                        const replyRate = c.emailsSent > 0 ? ((c.emailsReplied / c.emailsSent) * 100).toFixed(1) : "0"
                        const bounceRate = c.emailsSent > 0 ? ((c.emailsBounced / c.emailsSent) * 100).toFixed(1) : "0"
                        const clickRate = c.emailsSent > 0 ? ((c.emailsClicked / c.emailsSent) * 100).toFixed(1) : "0"

                        return {
                            id: c.id,
                            name: c.name,
                            status: c.status,
                            prospects: c.totalProspects,
                            emailsSent: c.emailsSent,
                            delivered: c.emailsDelivered,
                            opened: c.emailsOpened,
                            clicked: c.emailsClicked,
                            replied: c.emailsReplied,
                            bounced: c.emailsBounced,
                            rates: {
                                open: `${openRate}%`,
                                reply: `${replyRate}%`,
                                bounce: `${bounceRate}%`,
                                click: `${clickRate}%`,
                            },
                            settings: {
                                tone: c.toneOfVoice,
                                personalization: c.personalizationLevel,
                                research: c.researchDepth,
                            },
                            launchedAt: c.launchedAt?.toISOString() || "Not launched",
                            createdAt: c.createdAt.toISOString(),
                        }
                    }),
                }
            },
        }),

        // ─────────────────────────────────────────
        // 3. GENERATE EMAIL DRAFT
        // ─────────────────────────────────────────
        generate_email_draft: tool({
            description:
                "Generate a personalized cold email draft for a specific prospect or a general template. Uses AI to create subject line and body. Use when the user asks to write, draft, compose, or generate an email.",
            parameters: z.object({
                prospectId: z.string().optional().describe("ID of the prospect to personalize the email for"),
                prospectName: z.string().optional().describe("Name of the prospect (used if no ID provided)"),
                company: z.string().optional().describe("Company name for personalization"),
                jobTitle: z.string().optional().describe("Prospect's job title"),
                industry: z.string().optional().describe("Prospect's industry"),
                goal: z.string().default("book a meeting").describe("Goal of the email (e.g. 'book a meeting', 'product demo', 'partnership')"),
                tone: z.enum(["professional", "casual", "friendly", "formal", "enthusiastic"]).default("professional"),
                valueProposition: z.string().optional().describe("What value you offer"),
            }),
            execute: async (args) => {
                let prospectData: any = {
                    firstName: args.prospectName?.split(" ")[0],
                    lastName: args.prospectName?.split(" ").slice(1).join(" "),
                    company: args.company,
                    jobTitle: args.jobTitle,
                    industry: args.industry,
                }

                // If prospect ID provided, fetch real data
                if (args.prospectId) {
                    const prospect = await db.prospect.findFirst({
                        where: { id: args.prospectId, userId: dbUserId },
                    })
                    if (prospect) {
                        prospectData = {
                            firstName: prospect.firstName,
                            lastName: prospect.lastName,
                            company: prospect.company,
                            jobTitle: prospect.jobTitle,
                            industry: prospect.industry,
                            researchData: prospect.researchData,
                        }
                    }
                }

                // Use the existing OpenAI email generator
                const { generateEmailContent } = await import("@/lib/openai")
                const result = await generateEmailContent({
                    prospectData,
                    campaignContext: {
                        goal: args.goal,
                        valueProposition: args.valueProposition || "Our solution helps companies achieve better results",
                        callToAction: `Let's schedule a quick call to discuss how we can help ${prospectData.company || "your company"}`,
                    },
                    tone: args.tone,
                    personalizationLevel: "HIGH",
                })

                return {
                    success: true,
                    email: {
                        subject: result.subject,
                        body: result.body,
                        personalizedFor: `${prospectData.firstName || ""} ${prospectData.lastName || ""}`.trim() || "General",
                        company: prospectData.company || "N/A",
                        tone: args.tone,
                    },
                }
            },
        }),

        // ─────────────────────────────────────────
        // 4. CRM / PIPELINE INSIGHTS
        // ─────────────────────────────────────────
        crm_insights: tool({
            description:
                "Get insights about the CRM pipeline, deal scores, and prospect engagement. Shows top prospects, pipeline summary, and engagement trends. Use when the user asks about their pipeline, deals, CRM, or engagement metrics.",
            parameters: z.object({
                metric: z.enum(["pipeline_summary", "top_deals", "engagement_trends", "recent_replies"]).default("pipeline_summary"),
                limit: z.number().min(1).max(20).default(10),
            }),
            execute: async (args) => {
                switch (args.metric) {
                    case "pipeline_summary": {
                        const statusCounts = await db.prospect.groupBy({
                            by: ["status"],
                            where: { userId: dbUserId },
                            _count: { id: true },
                        })
                        const totalProspects = await db.prospect.count({ where: { userId: dbUserId } })
                        const repliedCount = await db.prospect.count({ where: { userId: dbUserId, replied: true } })
                        const avgScore = await db.prospect.aggregate({
                            where: { userId: dbUserId, qualityScore: { not: null } },
                            _avg: { qualityScore: true, dealScore: true },
                        })
                        return {
                            success: true,
                            pipeline: {
                                total: totalProspects,
                                replied: repliedCount,
                                replyRate: totalProspects > 0 ? `${((repliedCount / totalProspects) * 100).toFixed(1)}%` : "0%",
                                avgQualityScore: avgScore._avg.qualityScore?.toFixed(1) || "N/A",
                                avgDealScore: avgScore._avg.dealScore?.toFixed(1) || "N/A",
                                byStatus: statusCounts.map((s) => ({ status: s.status, count: s._count.id })),
                            },
                        }
                    }
                    case "top_deals": {
                        const topDeals = await db.prospect.findMany({
                            where: { userId: dbUserId, dealScore: { not: null } },
                            orderBy: { dealScore: "desc" },
                            take: args.limit,
                            select: {
                                id: true, firstName: true, lastName: true, email: true,
                                company: true, jobTitle: true, dealScore: true, qualityScore: true,
                                replied: true, status: true,
                            },
                        })
                        return {
                            success: true,
                            topDeals: topDeals.map((d) => ({
                                name: `${d.firstName || ""} ${d.lastName || ""}`.trim(),
                                email: d.email, company: d.company, jobTitle: d.jobTitle,
                                dealScore: d.dealScore, qualityScore: d.qualityScore,
                                replied: d.replied, status: d.status,
                            })),
                        }
                    }
                    case "recent_replies": {
                        const replies = await db.prospect.findMany({
                            where: { userId: dbUserId, replied: true },
                            orderBy: { repliedAt: "desc" },
                            take: args.limit,
                            select: {
                                firstName: true, lastName: true, email: true,
                                company: true, repliedAt: true, emailsReplied: true,
                                campaign: { select: { name: true } },
                            },
                        })
                        return {
                            success: true,
                            recentReplies: replies.map((r) => ({
                                name: `${r.firstName || ""} ${r.lastName || ""}`.trim(),
                                email: r.email, company: r.company,
                                repliedAt: r.repliedAt?.toISOString(),
                                totalReplies: r.emailsReplied,
                                campaign: r.campaign?.name || "N/A",
                            })),
                        }
                    }
                    case "engagement_trends": {
                        const totalSent = await db.prospect.aggregate({
                            where: { userId: dbUserId },
                            _sum: { emailsReceived: true, emailsOpened: true, emailsClicked: true, emailsReplied: true },
                        })
                        return {
                            success: true,
                            engagement: {
                                totalSent: totalSent._sum.emailsReceived || 0,
                                totalOpened: totalSent._sum.emailsOpened || 0,
                                totalClicked: totalSent._sum.emailsClicked || 0,
                                totalReplied: totalSent._sum.emailsReplied || 0,
                                openRate: totalSent._sum.emailsReceived
                                    ? `${(((totalSent._sum.emailsOpened || 0) / totalSent._sum.emailsReceived) * 100).toFixed(1)}%`
                                    : "0%",
                                clickRate: totalSent._sum.emailsReceived
                                    ? `${(((totalSent._sum.emailsClicked || 0) / totalSent._sum.emailsReceived) * 100).toFixed(1)}%`
                                    : "0%",
                                replyRate: totalSent._sum.emailsReceived
                                    ? `${(((totalSent._sum.emailsReplied || 0) / totalSent._sum.emailsReceived) * 100).toFixed(1)}%`
                                    : "0%",
                            },
                        }
                    }
                }
            },
        }),

        // ─────────────────────────────────────────
        // 5. DELIVERABILITY CHECK
        // ─────────────────────────────────────────
        deliverability_check: tool({
            description:
                "Check the health and deliverability status of sending accounts. Shows warmup progress, health scores, bounce rates, and domain reputation. Use when the user asks about email deliverability, account health, warmup status, or sending reputation.",
            parameters: z.object({
                accountEmail: z.string().optional().describe("Specific sending account email to check"),
                showAll: z.boolean().default(false).describe("Show all accounts or just active ones"),
            }),
            execute: async (args) => {
                const where: any = { userId: dbUserId }
                if (args.accountEmail) where.email = { contains: args.accountEmail, mode: "insensitive" }
                if (!args.showAll) where.isActive = true

                const accounts = await db.sendingAccount.findMany({
                    where,
                    select: {
                        id: true, name: true, email: true, provider: true,
                        isActive: true, healthScore: true, bounceRate: true,
                        spamComplaintRate: true, replyRate: true, openRate: true,
                        warmupEnabled: true, warmupStage: true, warmupProgress: true,
                        emailsSentToday: true, dailyLimit: true,
                        lastHealthCheck: true, lastError: true,
                    },
                    orderBy: { healthScore: "desc" },
                })

                return {
                    success: true,
                    totalAccounts: accounts.length,
                    accounts: accounts.map((a) => ({
                        name: a.name,
                        email: a.email,
                        provider: a.provider,
                        active: a.isActive,
                        health: {
                            score: a.healthScore,
                            status: a.healthScore >= 80 ? "Healthy" : a.healthScore >= 50 ? "Warning" : "Critical",
                            bounceRate: `${(a.bounceRate * 100).toFixed(2)}%`,
                            spamRate: `${(a.spamComplaintRate * 100).toFixed(2)}%`,
                            replyRate: `${(a.replyRate * 100).toFixed(2)}%`,
                            openRate: `${(a.openRate * 100).toFixed(2)}%`,
                        },
                        warmup: {
                            enabled: a.warmupEnabled,
                            stage: a.warmupStage,
                            progress: a.warmupProgress,
                        },
                        sending: {
                            sentToday: a.emailsSentToday,
                            dailyLimit: a.dailyLimit,
                            utilization: `${((a.emailsSentToday / a.dailyLimit) * 100).toFixed(0)}%`,
                        },
                        lastHealthCheck: a.lastHealthCheck?.toISOString() || "Never",
                        lastError: a.lastError || null,
                    })),
                }
            },
        }),

        // ─────────────────────────────────────────
        // 6. BULK PROSPECT ACTIONS
        // ─────────────────────────────────────────
        bulk_prospect_actions: tool({
            description:
                "Perform bulk actions on prospects: update status, move to folder, or tag. Use when the user wants to bulk-update, move, tag, or change status of multiple prospects at once.",
            parameters: z.object({
                action: z.enum(["update_status", "move_to_campaign", "trash", "untrash"]).describe("Action to perform"),
                filter: z.object({
                    status: z.enum(["ACTIVE", "CONTACTED", "REPLIED", "BOUNCED", "UNSUBSCRIBED", "PAUSED"]).optional(),
                    industry: z.string().optional(),
                    company: z.string().optional(),
                    minScore: z.number().optional(),
                    campaignId: z.string().optional(),
                    hasReplied: z.boolean().optional(),
                }).describe("Filter to select which prospects to act on"),
                newStatus: z.enum(["ACTIVE", "CONTACTED", "REPLIED", "BOUNCED", "UNSUBSCRIBED", "PAUSED"]).optional().describe("New status for update_status action"),
                targetCampaignId: z.string().optional().describe("Target campaign ID for move_to_campaign action"),
            }),
            execute: async (args) => {
                const where: any = { userId: dbUserId }
                if (args.filter.status) where.status = args.filter.status
                if (args.filter.industry) where.industry = { contains: args.filter.industry, mode: "insensitive" }
                if (args.filter.company) where.company = { contains: args.filter.company, mode: "insensitive" }
                if (args.filter.minScore) where.qualityScore = { gte: args.filter.minScore }
                if (args.filter.campaignId) where.campaignId = args.filter.campaignId
                if (args.filter.hasReplied !== undefined) where.replied = args.filter.hasReplied

                const matchCount = await db.prospect.count({ where })

                if (matchCount === 0) {
                    return { success: false, message: "No prospects found matching the filter criteria." }
                }

                // Safety: limit bulk actions to 500 at a time
                if (matchCount > 500) {
                    return {
                        success: false,
                        message: `Found ${matchCount} matching prospects. For safety, please narrow your filter to affect fewer than 500 prospects at a time.`,
                    }
                }

                let data: any = {}
                switch (args.action) {
                    case "update_status":
                        if (!args.newStatus) return { success: false, message: "newStatus is required for update_status action" }
                        data = { status: args.newStatus }
                        break
                    case "move_to_campaign":
                        if (!args.targetCampaignId) return { success: false, message: "targetCampaignId is required" }
                        data = { campaignId: args.targetCampaignId }
                        break
                    case "trash":
                        data = { isTrashed: true, trashedAt: new Date() }
                        break
                    case "untrash":
                        data = { isTrashed: false, trashedAt: null }
                        break
                }

                const result = await db.prospect.updateMany({ where, data })

                return {
                    success: true,
                    action: args.action,
                    affectedCount: result.count,
                    message: `Successfully performed "${args.action}" on ${result.count} prospects.`,
                }
            },
        }),

        // ─────────────────────────────────────────
        // 7. SCHEDULE CAMPAIGN
        // ─────────────────────────────────────────
        schedule_campaign: tool({
            description:
                "Configure or view campaign scheduling settings. Set sending days, time windows, and daily limits. Use when the user asks to schedule, configure, or set up campaign sending.",
            parameters: z.object({
                campaignId: z.string().optional().describe("Campaign ID to configure"),
                campaignName: z.string().optional().describe("Campaign name to find and configure"),
                dailySendLimit: z.number().min(1).max(500).optional().describe("Max emails per day"),
                sendingDays: z.array(z.string()).optional().describe("Days to send (e.g. ['Monday','Tuesday','Wednesday','Thursday','Friday'])"),
                startTime: z.string().optional().describe("Start time in HH:mm format (e.g. '09:00')"),
                endTime: z.string().optional().describe("End time in HH:mm format (e.g. '17:00')"),
            }),
            execute: async (args) => {
                const where: any = { userId: dbUserId }
                if (args.campaignId) where.id = args.campaignId
                if (args.campaignName) where.name = { contains: args.campaignName, mode: "insensitive" }

                const campaign = await db.campaign.findFirst({ where })
                if (!campaign) return { success: false, message: "Campaign not found." }

                // If only querying, return current settings
                if (!args.dailySendLimit && !args.sendingDays && !args.startTime && !args.endTime) {
                    return {
                        success: true,
                        campaign: {
                            id: campaign.id,
                            name: campaign.name,
                            status: campaign.status,
                            dailySendLimit: campaign.dailySendLimit,
                            sendingSchedule: campaign.sendingSchedule,
                        },
                    }
                }

                // Update schedule
                const updateData: any = {}
                if (args.dailySendLimit) updateData.dailySendLimit = args.dailySendLimit
                if (args.sendingDays || args.startTime || args.endTime) {
                    const currentSchedule = (campaign.sendingSchedule as any) || {}
                    updateData.sendingSchedule = {
                        days: args.sendingDays || currentSchedule.days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                        startTime: args.startTime || currentSchedule.startTime || "09:00",
                        endTime: args.endTime || currentSchedule.endTime || "17:00",
                    }
                }

                const updated = await db.campaign.update({
                    where: { id: campaign.id },
                    data: updateData,
                })

                return {
                    success: true,
                    message: `Campaign "${updated.name}" schedule updated successfully.`,
                    settings: {
                        dailySendLimit: updated.dailySendLimit,
                        sendingSchedule: updated.sendingSchedule,
                    },
                }
            },
        }),

        // ─────────────────────────────────────────
        // 8. TEMPLATE OPTIMIZER
        // ─────────────────────────────────────────
        template_optimizer: tool({
            description:
                "Analyze email template performance and get optimization suggestions. Shows usage stats, open rates, and reply rates. Use when the user asks about template performance, optimization, or wants to improve their templates.",
            parameters: z.object({
                templateId: z.string().optional().describe("Specific template ID to analyze"),
                templateName: z.string().optional().describe("Template name to search for"),
                showAll: z.boolean().default(false).describe("Show all templates or just top performers"),
            }),
            execute: async (args) => {
                const where: any = { userId: dbUserId }
                if (args.templateId) where.id = args.templateId
                if (args.templateName) where.name = { contains: args.templateName, mode: "insensitive" }

                const templates = await db.emailTemplate.findMany({
                    where,
                    orderBy: { timesUsed: "desc" },
                    take: args.showAll ? 50 : 10,
                    select: {
                        id: true, name: true, subject: true, category: true,
                        timesUsed: true, avgOpenRate: true, avgReplyRate: true,
                        isFavorite: true, industry: true, tags: true,
                        lastUsedAt: true, createdAt: true,
                    },
                })

                return {
                    success: true,
                    total: templates.length,
                    templates: templates.map((t) => ({
                        id: t.id,
                        name: t.name,
                        subject: t.subject,
                        category: t.category || "Uncategorized",
                        industry: t.industry || "General",
                        timesUsed: t.timesUsed,
                        performance: {
                            openRate: t.avgOpenRate ? `${(t.avgOpenRate * 100).toFixed(1)}%` : "N/A",
                            replyRate: t.avgReplyRate ? `${(t.avgReplyRate * 100).toFixed(1)}%` : "N/A",
                            rating: t.avgReplyRate && t.avgReplyRate > 0.05 ? "High Performer" : t.avgReplyRate && t.avgReplyRate > 0.02 ? "Average" : "Needs Improvement",
                        },
                        favorite: t.isFavorite,
                        tags: t.tags,
                        lastUsed: t.lastUsedAt?.toISOString() || "Never",
                    })),
                }
            },
        }),

        // ─────────────────────────────────────────
        // 9. ACCOUNT OVERVIEW / DASHBOARD STATS
        // ─────────────────────────────────────────
        account_overview: tool({
            description:
                "Get a comprehensive overview of the user's account: total campaigns, prospects, emails sent, credit balance, subscription info, and key metrics. Use when the user asks for a summary, overview, dashboard, or status of their account.",
            parameters: z.object({}),
            execute: async () => {
                const user = await db.user.findUnique({
                    where: { id: dbUserId },
                    select: {
                        name: true, email: true,
                        subscriptionTier: true, subscriptionStatus: true,
                        emailCredits: true, researchCredits: true,
                        emailsSentThisMonth: true, prospectsThisMonth: true, aiCreditsUsed: true,
                    },
                })

                if (!user) return { success: false, message: "User not found." }

                const [campaignCount, prospectCount, templateCount, activeCampaigns] = await Promise.all([
                    db.campaign.count({ where: { userId: dbUserId } }),
                    db.prospect.count({ where: { userId: dbUserId, isTrashed: false } }),
                    db.emailTemplate.count({ where: { userId: dbUserId } }),
                    db.campaign.count({ where: { userId: dbUserId, status: "ACTIVE" } }),
                ])

                return {
                    success: true,
                    account: {
                        name: user.name,
                        email: user.email,
                        plan: user.subscriptionTier,
                        status: user.subscriptionStatus,
                    },
                    credits: {
                        email: user.emailCredits,
                        research: user.researchCredits,
                    },
                    usage: {
                        emailsSentThisMonth: user.emailsSentThisMonth,
                        prospectsThisMonth: user.prospectsThisMonth,
                        aiCreditsUsed: user.aiCreditsUsed,
                    },
                    stats: {
                        totalCampaigns: campaignCount,
                        activeCampaigns,
                        totalProspects: prospectCount,
                        totalTemplates: templateCount,
                    },
                }
            },
        }),
    }
}
