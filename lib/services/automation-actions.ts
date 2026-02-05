/**
 * Automation Actions Executor
 * Executes individual actions within an automation
 */

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendEmail } from './email-sender'
import type {
    AutomationAction,
    AutomationContext,
    SendEmailActionConfig,
    ScheduleEmailActionConfig,
    SequenceActionConfig,
    TagActionConfig,
    SlackMessageConfig,
    WebhookActionConfig,
    NotificationConfig,
    DelayConfig
} from '@/lib/types/automation-types'

// ============================================================
// ACTION EXECUTOR
// ============================================================

class AutomationActionExecutor {
    /**
     * Execute a single action
     */
    async execute(
        action: AutomationAction,
        context: AutomationContext
    ): Promise<{ success: boolean; result?: unknown; error?: string }> {
        logger.info(`[ActionExecutor] Executing action ${action.type}`, {
            actionId: action.id,
            executionId: context.executionId
        })

        try {
            let result: unknown

            switch (action.type) {
                // Email Actions
                case 'SEND_EMAIL':
                    result = await this.executeSendEmail(action.config as SendEmailActionConfig, context)
                    break
                case 'SCHEDULE_EMAIL':
                    result = await this.executeScheduleEmail(action.config as ScheduleEmailActionConfig, context)
                    break
                case 'PAUSE_SEQUENCE':
                    result = await this.executePauseSequence(context)
                    break
                case 'RESUME_SEQUENCE':
                    result = await this.executeResumeSequence(context)
                    break
                case 'REMOVE_FROM_SEQUENCE':
                    result = await this.executeRemoveFromSequence(context)
                    break
                case 'MOVE_TO_SEQUENCE':
                    result = await this.executeMoveToSequence(action.config as SequenceActionConfig, context)
                    break

                // Prospect Actions
                case 'ADD_TAG':
                    result = await this.executeAddTag(action.config as TagActionConfig, context)
                    break
                case 'REMOVE_TAG':
                    result = await this.executeRemoveTag(action.config as TagActionConfig, context)
                    break
                case 'CHANGE_STATUS':
                    result = await this.executeChangeStatus(action.config as { status: string }, context)
                    break

                // Communication Actions
                case 'SEND_SLACK_MESSAGE':
                    result = await this.executeSendSlack(action.config as SlackMessageConfig, context)
                    break
                case 'SEND_WEBHOOK':
                    result = await this.executeSendWebhook(action.config as WebhookActionConfig, context)
                    break
                case 'SEND_NOTIFICATION':
                    result = await this.executeSendNotification(action.config as NotificationConfig, context)
                    break

                // Task Actions
                case 'CREATE_TASK':
                    result = await this.executeCreateTask(action.config as { title: string; description?: string; dueDays?: number }, context)
                    break

                // CRM Actions (generic and provider-specific)
                case 'SYNC_TO_CRM':
                    result = await this.executeSyncToCRM(action.config as { platform: string; mode: string }, context)
                    break
                case 'SYNC_TO_HUBSPOT':
                    result = await this.executeSyncToCRM({ platform: 'hubspot', mode: 'upsert' }, context)
                    break
                case 'SYNC_TO_SALESFORCE':
                    result = await this.executeSyncToCRM({ platform: 'salesforce', mode: 'upsert' }, context)
                    break
                case 'SYNC_TO_PIPEDRIVE':
                    result = await this.executeSyncToCRM({ platform: 'pipedrive', mode: 'upsert' }, context)
                    break

                // Productivity Integrations
                case 'ADD_TO_NOTION':
                    result = await this.executeAddToNotion(action.config as { databaseId: string }, context)
                    break
                case 'ADD_TO_AIRTABLE':
                    result = await this.executeAddToAirtable(action.config as { baseId: string; tableId: string }, context)
                    break
                case 'CREATE_TRELLO_CARD':
                    result = await this.executeCreateTrelloCard(action.config as { boardId: string; listId: string; title: string }, context)
                    break
                case 'CREATE_ASANA_TASK':
                    result = await this.executeCreateAsanaTask(action.config as { projectId: string; title: string }, context)
                    break

                // Logic Actions
                case 'DELAY':
                    result = await this.executeDelay(action.config as DelayConfig, context)
                    break

                default:
                    throw new Error(`Unknown action type: ${action.type}`)
            }

            await this.logAction(context, action, 'INFO', 'Action completed successfully', result)
            return { success: true, result }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            await this.logAction(context, action, 'ERROR', `Action failed: ${errorMessage}`, { error: errorMessage })

            if (action.continueOnError) {
                return { success: true, result: null, error: errorMessage }
            }
            return { success: false, error: errorMessage }
        }
    }

    // ============================================================
    // EMAIL ACTIONS
    // ============================================================

    private async executeSendEmail(
        config: SendEmailActionConfig,
        context: AutomationContext
    ): Promise<{ emailLogId?: string }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available for sending email')
        }

        // Get sending account
        const sendingAccount = config.fromAccountId
            ? await db.sendingAccount.findUnique({ where: { id: config.fromAccountId } })
            : await db.sendingAccount.findFirst({
                where: { userId: context.userId, isActive: true },
                orderBy: { healthScore: 'desc' }
            })

        if (!sendingAccount) {
            throw new Error('No sending account available')
        }

        // Get template or use custom content
        let subject = config.subject || ''
        let body = config.body || ''

        if (config.templateId) {
            const template = await db.emailTemplate.findUnique({
                where: { id: config.templateId }
            })
            if (template) {
                subject = template.subject
                body = template.body
            }
        }

        // Replace variables
        subject = this.replaceVariables(subject, context)
        body = this.replaceVariables(body, context)

        // Send email using existing email sender
        const result = await sendEmail({
            to: prospect.email,
            subject,
            html: body,
            prospectId: prospect.id,
            campaignId: context.data.campaign?.id,
            userId: context.userId
        })

        return { emailLogId: result.logId }
    }

    private async executeScheduleEmail(
        config: ScheduleEmailActionConfig,
        context: AutomationContext
    ): Promise<{ scheduleId?: string }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available for scheduling email')
        }

        // Calculate scheduled time
        let scheduledFor = new Date()
        if (config.delayMinutes) {
            scheduledFor = new Date(scheduledFor.getTime() + config.delayMinutes * 60 * 1000)
        }

        // Get template content
        let subject = config.subject || ''
        let body = config.body || ''

        if (config.templateId) {
            const template = await db.emailTemplate.findUnique({
                where: { id: config.templateId }
            })
            if (template) {
                subject = template.subject
                body = template.body
            }
        }

        // Replace variables
        subject = this.replaceVariables(subject, context)
        body = this.replaceVariables(body, context)

        // Get sending account
        const sendingAccount = await db.sendingAccount.findFirst({
            where: { userId: context.userId, isActive: true },
            orderBy: { healthScore: 'desc' }
        })

        // Create schedule
        const schedule = await db.sendingSchedule.create({
            data: {
                userId: context.userId,
                prospectId: prospect.id,
                campaignId: context.data.campaign?.id,
                subject,
                body,
                scheduledFor,
                timezone: config.timezone || 'America/New_York',
                sendInBusinessHours: config.sendInBusinessHours ?? true,
                sendingAccountId: sendingAccount?.id,
                status: 'PENDING'
            }
        })

        return { scheduleId: schedule.id }
    }

    private async executePauseSequence(context: AutomationContext): Promise<{ enrollment?: unknown }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available')
        }

        // Find active enrollment and pause it
        const enrollment = await db.sequenceEnrollment.findFirst({
            where: {
                prospectId: prospect.id,
                status: 'ACTIVE'
            }
        })

        if (enrollment) {
            await db.sequenceEnrollment.update({
                where: { id: enrollment.id },
                data: {
                    status: 'PAUSED',
                    pausedAt: new Date()
                }
            })
        }

        return { enrollment }
    }

    private async executeResumeSequence(context: AutomationContext): Promise<{ enrollment?: unknown }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available')
        }

        const enrollment = await db.sequenceEnrollment.findFirst({
            where: {
                prospectId: prospect.id,
                status: 'PAUSED'
            }
        })

        if (enrollment) {
            await db.sequenceEnrollment.update({
                where: { id: enrollment.id },
                data: {
                    status: 'ACTIVE',
                    resumedAt: new Date()
                }
            })
        }

        return { enrollment }
    }

    private async executeRemoveFromSequence(context: AutomationContext): Promise<{ enrollment?: unknown }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available')
        }

        const enrollment = await db.sequenceEnrollment.findFirst({
            where: {
                prospectId: prospect.id,
                status: { in: ['ACTIVE', 'PAUSED'] }
            }
        })

        if (enrollment) {
            await db.sequenceEnrollment.update({
                where: { id: enrollment.id },
                data: {
                    status: 'EXITED',
                    exitReason: 'AUTOMATION',
                    exitedAt: new Date()
                }
            })
        }

        return { enrollment }
    }

    private async executeMoveToSequence(
        config: SequenceActionConfig,
        context: AutomationContext
    ): Promise<{ newEnrollment?: unknown }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available')
        }

        // Remove from current sequence
        await this.executeRemoveFromSequence(context)

        // Enroll in new sequence
        const newEnrollment = await db.sequenceEnrollment.create({
            data: {
                sequenceId: config.sequenceId,
                prospectId: prospect.id,
                status: 'ACTIVE',
                currentStep: config.stepNumber || 0,
                enrolledAt: new Date()
            }
        })

        return { newEnrollment }
    }

    // ============================================================
    // PROSPECT ACTIONS
    // ============================================================

    private async executeAddTag(
        config: TagActionConfig,
        context: AutomationContext
    ): Promise<{ addedTags: string[] }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available')
        }

        // Get current tags from personalizationTokens
        const currentTokens = await db.prospect.findUnique({
            where: { id: prospect.id },
            select: { personalizationTokens: true }
        })

        const tokens = (currentTokens?.personalizationTokens as Record<string, unknown>) || {}
        const existingTags = (tokens.tags as string[]) || []
        const newTags = [...new Set([...existingTags, ...config.tags])]

        await db.prospect.update({
            where: { id: prospect.id },
            data: {
                personalizationTokens: {
                    ...tokens,
                    tags: newTags
                }
            }
        })

        return { addedTags: config.tags }
    }

    private async executeRemoveTag(
        config: TagActionConfig,
        context: AutomationContext
    ): Promise<{ removedTags: string[] }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available')
        }

        const currentTokens = await db.prospect.findUnique({
            where: { id: prospect.id },
            select: { personalizationTokens: true }
        })

        const tokens = (currentTokens?.personalizationTokens as Record<string, unknown>) || {}
        const existingTags = (tokens.tags as string[]) || []
        const newTags = existingTags.filter(tag => !config.tags.includes(tag))

        await db.prospect.update({
            where: { id: prospect.id },
            data: {
                personalizationTokens: {
                    ...tokens,
                    tags: newTags
                }
            }
        })

        return { removedTags: config.tags }
    }

    private async executeChangeStatus(
        config: { status: string },
        context: AutomationContext
    ): Promise<{ oldStatus?: string; newStatus: string }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available')
        }

        const current = await db.prospect.findUnique({
            where: { id: prospect.id },
            select: { status: true }
        })

        await db.prospect.update({
            where: { id: prospect.id },
            data: {
                status: config.status as any
            }
        })

        return { oldStatus: current?.status, newStatus: config.status }
    }

    // ============================================================
    // COMMUNICATION ACTIONS
    // ============================================================

    private async executeSendSlack(
        config: SlackMessageConfig,
        context: AutomationContext
    ): Promise<{ sent: boolean }> {
        // Get Slack integration
        const integration = await db.integration.findFirst({
            where: {
                userId: context.userId,
                type: 'SLACK',
                isActive: true
            },
            include: { oauthToken: true }
        })

        if (!integration || !integration.oauthToken) {
            throw new Error('Slack integration not connected')
        }

        // Replace variables in message
        const message = this.replaceVariables(config.message, context)

        // Build Slack message with prospect details if requested
        let fullMessage = message
        if (config.includeProspectDetails && context.data.prospect) {
            const p = context.data.prospect
            fullMessage += `\n\n*Prospect Details:*\n• Name: ${p.firstName || ''} ${p.lastName || ''}\n• Email: ${p.email}\n• Company: ${p.company || 'N/A'}\n• Title: ${p.jobTitle || 'N/A'}`
        }

        // Send to Slack
        const response = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${integration.oauthToken.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channel: config.channel || '#general',
                text: fullMessage,
                mrkdwn: true
            })
        })

        const result = await response.json()
        if (!result.ok) {
            throw new Error(`Slack API error: ${result.error}`)
        }

        return { sent: true }
    }

    private async executeSendWebhook(
        config: WebhookActionConfig,
        context: AutomationContext
    ): Promise<{ status: number; response?: unknown }> {
        // Build request body with variable replacement
        const body = config.body
            ? JSON.parse(this.replaceVariables(JSON.stringify(config.body), context))
            : {
                automation: {
                    id: context.automationId,
                    executionId: context.executionId
                },
                trigger: {
                    type: context.triggerType,
                    entityType: context.entityType,
                    entityId: context.entityId
                },
                data: context.data
            }

        // Build headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...config.headers
        }

        // Add authentication
        if (config.authentication) {
            switch (config.authentication.type) {
                case 'bearer':
                    headers['Authorization'] = `Bearer ${config.authentication.token}`
                    break
                case 'basic':
                    const credentials = Buffer.from(
                        `${config.authentication.username}:${config.authentication.password}`
                    ).toString('base64')
                    headers['Authorization'] = `Basic ${credentials}`
                    break
                case 'apikey':
                    if (config.authentication.apiKeyHeader) {
                        headers[config.authentication.apiKeyHeader] = config.authentication.apiKeyValue || ''
                    }
                    break
            }
        }

        const response = await fetch(config.url, {
            method: config.method,
            headers,
            body: config.method !== 'GET' ? JSON.stringify(body) : undefined
        })

        let responseData: unknown
        try {
            responseData = await response.json()
        } catch {
            responseData = await response.text()
        }

        return { status: response.status, response: responseData }
    }

    private async executeSendNotification(
        config: NotificationConfig,
        context: AutomationContext
    ): Promise<{ sent: boolean }> {
        const message = this.replaceVariables(config.message, context)
        const subject = config.subject ? this.replaceVariables(config.subject, context) : 'Automation Notification'

        // Determine recipients
        const recipients = config.recipients || [context.userId]

        for (const recipientId of recipients) {
            const userId = recipientId === 'owner' ? context.userId : recipientId

            // Create in-app notification
            if (config.type === 'in_app' || config.type === 'both') {
                await db.notification.create({
                    data: {
                        userId,
                        type: 'SYSTEM_UPDATE',
                        title: subject,
                        message,
                        metadata: {
                            automationId: context.automationId,
                            executionId: context.executionId,
                            priority: config.priority || 'medium'
                        }
                    }
                })
            }

            // Send email notification
            if (config.type === 'email' || config.type === 'both') {
                const user = await db.user.findUnique({ where: { id: userId } })
                if (user) {
                    // Use your email service to send notification email
                    // This is a placeholder - integrate with your actual email service
                    logger.info(`[ActionExecutor] Would send email notification to ${user.email}`)
                }
            }
        }

        return { sent: true }
    }

    // ============================================================
    // LOGIC ACTIONS
    // ============================================================

    private async executeDelay(
        config: DelayConfig,
        context: AutomationContext
    ): Promise<{ delayUntil: Date }> {
        let delayMs = 0

        if (config.minutes) delayMs += config.minutes * 60 * 1000
        if (config.hours) delayMs += config.hours * 60 * 60 * 1000
        if (config.days) delayMs += config.days * 24 * 60 * 60 * 1000

        const delayUntil = new Date(Date.now() + delayMs)

        // Update execution with next action time
        await db.automationExecution.update({
            where: { id: context.executionId },
            data: {
                status: 'WAITING',
                nextActionAt: delayUntil
            }
        })

        return { delayUntil }
    }

    // ============================================================
    // TASK ACTIONS
    // ============================================================

    private async executeCreateTask(
        config: { title: string; description?: string; dueDays?: number },
        context: AutomationContext
    ): Promise<{ taskId?: string }> {
        const prospect = context.data.prospect

        // Replace variables in title and description
        const title = this.replaceVariables(config.title || 'Follow up', context)
        const description = config.description
            ? this.replaceVariables(config.description, context)
            : undefined

        // Calculate due date
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + (config.dueDays || 1))

        // Create task (using Notification model as a task tracker for now)
        // In a full implementation, you'd have a dedicated Task model
        const task = await db.notification.create({
            data: {
                userId: context.userId,
                type: 'TASK_ASSIGNED',
                title: `Task: ${title}`,
                message: description || `Follow up with ${prospect?.email || 'prospect'}`,
                metadata: {
                    taskType: 'AUTOMATION_TASK',
                    prospectId: prospect?.id,
                    dueDate: dueDate.toISOString(),
                    automationId: context.automationId,
                    executionId: context.executionId,
                    status: 'PENDING'
                }
            }
        })

        logger.info(`[ActionExecutor] Created task for prospect ${prospect?.email}`, {
            taskId: task.id,
            dueDate: dueDate.toISOString()
        })

        return { taskId: task.id }
    }

    // ============================================================
    // CRM ACTIONS
    // ============================================================

    private async executeSyncToCRM(
        config: { platform: string; mode: string },
        context: AutomationContext
    ): Promise<{ synced: boolean; recordId?: string }> {
        const prospect = context.data.prospect
        if (!prospect) {
            throw new Error('No prospect data available for CRM sync')
        }

        // Get CRM integration
        const integration = await db.integration.findFirst({
            where: {
                userId: context.userId,
                type: config.platform as any,
                isActive: true
            },
            include: { oauthToken: true }
        })

        if (!integration || !integration.oauthToken) {
            throw new Error(`${config.platform} integration not connected`)
        }

        // Build prospect data for CRM
        const prospectData = {
            email: prospect.email,
            firstName: prospect.firstName,
            lastName: prospect.lastName,
            company: prospect.company,
            jobTitle: prospect.jobTitle,
            phone: prospect.phoneNumber,
            linkedinUrl: prospect.linkedinUrl,
            website: prospect.websiteUrl,
        }

        let result: { synced: boolean; recordId?: string } = { synced: false }

        // Handle different CRM platforms
        switch (config.platform) {
            case 'HUBSPOT':
                result = await this.syncToHubSpot(integration.oauthToken.accessToken, prospectData, config.mode)
                break
            case 'SALESFORCE': {
                const credentials = integration.credentials as Record<string, unknown> || {}
                const instanceUrl = credentials.instanceUrl as string
                result = await this.syncToSalesforce(integration.oauthToken.accessToken, prospectData, config.mode, instanceUrl)
                break
            }
            case 'PIPEDRIVE':
                result = await this.syncToPipedrive(integration.oauthToken.accessToken, prospectData, config.mode)
                break
            default:
                throw new Error(`Unsupported CRM platform: ${config.platform}`)
        }

        logger.info(`[ActionExecutor] Synced prospect to ${config.platform}`, {
            prospectId: prospect.id,
            recordId: result.recordId
        })

        return result
    }

    private async syncToHubSpot(
        accessToken: string,
        data: Record<string, unknown>,
        mode: string
    ): Promise<{ synced: boolean; recordId?: string }> {
        // Search for existing contact if mode is upsert or update
        let existingContactId: string | null = null

        if (mode !== 'create') {
            const searchResponse = await fetch(
                `https://api.hubapi.com/crm/v3/objects/contacts/search`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        filterGroups: [{
                            filters: [{
                                propertyName: 'email',
                                operator: 'EQ',
                                value: data.email
                            }]
                        }]
                    })
                }
            )
            const searchResult = await searchResponse.json()
            if (searchResult.results?.length > 0) {
                existingContactId = searchResult.results[0].id
            }
        }

        // Skip if update-only and no existing contact
        if (mode === 'update' && !existingContactId) {
            return { synced: false }
        }

        // Build HubSpot properties
        const properties = {
            email: data.email,
            firstname: data.firstName,
            lastname: data.lastName,
            company: data.company,
            jobtitle: data.jobTitle,
            phone: data.phone,
            website: data.website,
        }

        let response: Response
        if (existingContactId) {
            // Update existing contact
            response = await fetch(
                `https://api.hubapi.com/crm/v3/objects/contacts/${existingContactId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ properties })
                }
            )
        } else {
            // Create new contact
            response = await fetch(
                'https://api.hubapi.com/crm/v3/objects/contacts',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ properties })
                }
            )
        }

        const result = await response.json()
        if (!response.ok) {
            throw new Error(`HubSpot API error: ${result.message || JSON.stringify(result)}`)
        }

        return { synced: true, recordId: result.id }
    }

    private async syncToSalesforce(
        accessToken: string,
        data: Record<string, unknown>,
        mode: string,
        instanceUrl?: string
    ): Promise<{ synced: boolean; recordId?: string }> {
        if (!instanceUrl) {
            throw new Error('Salesforce instanceUrl is required')
        }

        // Search for existing contact by email if mode is upsert or update
        let existingContactId: string | null = null

        if (mode !== 'create' && data.email) {
            const searchUrl = `${instanceUrl}/services/data/v57.0/query?q=SELECT+Id+FROM+Contact+WHERE+Email='${encodeURIComponent(String(data.email))}'`
            const searchResponse = await fetch(searchUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })

            if (searchResponse.ok) {
                const searchResult = await searchResponse.json()
                if (searchResult.records?.length > 0) {
                    existingContactId = searchResult.records[0].Id
                }
            }
        }

        // Skip if update-only and no existing contact
        if (mode === 'update' && !existingContactId) {
            return { synced: false }
        }

        // Build Salesforce Contact fields
        const contactData = {
            Email: data.email,
            FirstName: data.firstName,
            LastName: data.lastName || 'Unknown',
            Title: data.jobTitle,
            Phone: data.phone,
            ...(data.linkedinUrl ? { LinkedIn_Profile__c: data.linkedinUrl } : {})
        }

        let response: Response
        if (existingContactId) {
            // Update existing contact
            response = await fetch(
                `${instanceUrl}/services/data/v57.0/sobjects/Contact/${existingContactId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                }
            )

            if (!response.ok) {
                const error = await response.json()
                throw new Error(`Salesforce API error: ${JSON.stringify(error)}`)
            }

            logger.info('[ActionExecutor] Updated Salesforce contact', { contactId: existingContactId })
            return { synced: true, recordId: existingContactId }
        } else {
            // Create new contact
            response = await fetch(
                `${instanceUrl}/services/data/v57.0/sobjects/Contact`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(contactData)
                }
            )

            const result = await response.json()
            if (!response.ok) {
                throw new Error(`Salesforce API error: ${JSON.stringify(result)}`)
            }

            logger.info('[ActionExecutor] Created Salesforce contact', { contactId: result.id })
            return { synced: true, recordId: result.id }
        }
    }


    private async syncToPipedrive(
        accessToken: string,
        data: Record<string, unknown>,
        mode: string
    ): Promise<{ synced: boolean; recordId?: string }> {
        // Search for existing person by email if mode is upsert or update
        let existingPersonId: number | null = null

        if (mode !== 'create' && data.email) {
            const searchResponse = await fetch(
                `https://api.pipedrive.com/v1/persons/search?term=${encodeURIComponent(String(data.email))}&fields=email&api_token=${accessToken}`,
                { method: 'GET' }
            )

            if (searchResponse.ok) {
                const searchResult = await searchResponse.json()
                if (searchResult.data?.items?.length > 0) {
                    existingPersonId = searchResult.data.items[0].item.id
                }
            }
        }

        // Skip if update-only and no existing person
        if (mode === 'update' && !existingPersonId) {
            return { synced: false }
        }

        // Build Pipedrive Person fields
        const personData = {
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || String(data.email),
            email: [{ value: data.email, primary: true }],
            phone: data.phone ? [{ value: data.phone, primary: true }] : undefined,
            ...(data.company ? { org_id: null } : {}) // Note: would need org lookup for company
        }

        let response: Response
        if (existingPersonId) {
            // Update existing person
            response = await fetch(
                `https://api.pipedrive.com/v1/persons/${existingPersonId}?api_token=${accessToken}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(personData)
                }
            )
        } else {
            // Create new person
            response = await fetch(
                `https://api.pipedrive.com/v1/persons?api_token=${accessToken}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(personData)
                }
            )
        }

        const result = await response.json()
        if (!result.success) {
            throw new Error(`Pipedrive API error: ${result.error || JSON.stringify(result)}`)
        }

        logger.info('[ActionExecutor] Synced to Pipedrive', { personId: result.data?.id })
        return { synced: true, recordId: String(result.data?.id) }
    }

    // ============================================================
    // PRODUCTIVITY INTEGRATIONS
    // ============================================================

    private async executeAddToNotion(
        config: { databaseId: string; titleField?: string; properties?: Record<string, unknown> },
        context: AutomationContext
    ): Promise<{ added: boolean; pageId?: string }> {
        const prospect = context.data.prospect

        logger.info('[ActionExecutor] Adding to Notion', {
            databaseId: config.databaseId,
            prospectId: prospect?.id
        })

        // Check for Notion integration with OAuth token
        const integration = await db.integration.findFirst({
            where: {
                userId: context.userId,
                type: 'NOTION',
                isActive: true
            },
            include: { oauthToken: true }
        })

        if (!integration || !integration.oauthToken) {
            throw new Error('Notion integration not connected')
        }

        // Build page properties - Notion requires specific property format
        const titleField = config.titleField || 'Name'
        const pageProperties: Record<string, unknown> = {
            [titleField]: {
                title: [{
                    text: { content: `${prospect?.firstName || ''} ${prospect?.lastName || ''}`.trim() || prospect?.email || 'Unknown' }
                }]
            }
        }

        // Add common properties if they exist in the database
        if (prospect?.email) {
            pageProperties['Email'] = { email: prospect.email }
        }
        if (prospect?.company) {
            pageProperties['Company'] = { rich_text: [{ text: { content: prospect.company } }] }
        }
        if (prospect?.jobTitle) {
            pageProperties['Title'] = { rich_text: [{ text: { content: prospect.jobTitle } }] }
        }

        // Merge custom properties
        if (config.properties) {
            Object.assign(pageProperties, config.properties)
        }

        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${integration.oauthToken.accessToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                parent: { database_id: config.databaseId },
                properties: pageProperties
            })
        })

        const result = await response.json()
        if (!response.ok) {
            throw new Error(`Notion API error: ${result.message || JSON.stringify(result)}`)
        }

        logger.info('[ActionExecutor] Added page to Notion', { pageId: result.id })
        return { added: true, pageId: result.id }
    }

    private async executeAddToAirtable(
        config: { baseId: string; tableId: string; fields?: Record<string, unknown> },
        context: AutomationContext
    ): Promise<{ added: boolean; recordId?: string }> {
        const prospect = context.data.prospect

        logger.info('[ActionExecutor] Adding to Airtable', {
            baseId: config.baseId,
            tableId: config.tableId,
            prospectId: prospect?.id
        })

        // Check for Airtable integration with OAuth token
        const integration = await db.integration.findFirst({
            where: {
                userId: context.userId,
                type: 'AIRTABLE',
                isActive: true
            },
            include: { oauthToken: true }
        })

        if (!integration || !integration.oauthToken) {
            throw new Error('Airtable integration not connected')
        }

        // Build record fields - using common field names
        const fields: Record<string, unknown> = {
            'Name': `${prospect?.firstName || ''} ${prospect?.lastName || ''}`.trim() || prospect?.email,
            'Email': prospect?.email,
            'Company': prospect?.company,
            'Title': prospect?.jobTitle,
            'Phone': prospect?.phoneNumber,
            ...config.fields
        }

        // Remove undefined values
        Object.keys(fields).forEach(key => {
            if (fields[key] === undefined || fields[key] === null) {
                delete fields[key]
            }
        })

        const response = await fetch(
            `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableId)}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${integration.oauthToken.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fields })
            }
        )

        const result = await response.json()
        if (!response.ok) {
            throw new Error(`Airtable API error: ${result.error?.message || JSON.stringify(result)}`)
        }

        logger.info('[ActionExecutor] Added record to Airtable', { recordId: result.id })
        return { added: true, recordId: result.id }
    }

    private async executeCreateTrelloCard(
        config: { boardId: string; listId: string; title: string; description?: string },
        context: AutomationContext
    ): Promise<{ created: boolean; cardId?: string }> {
        const prospect = context.data.prospect
        const title = this.replaceVariables(config.title, context)
        const description = config.description ? this.replaceVariables(config.description, context) : undefined

        logger.info('[ActionExecutor] Creating Trello card', {
            boardId: config.boardId,
            listId: config.listId,
            title,
            prospectId: prospect?.id
        })

        // Check for Trello integration with credentials
        const integration = await db.integration.findFirst({
            where: {
                userId: context.userId,
                type: 'TRELLO',
                isActive: true
            },
            include: { oauthToken: true }
        })

        if (!integration || !integration.oauthToken) {
            throw new Error('Trello integration not connected')
        }

        // Get API key from credentials (Trello uses API key + token)
        const credentials = integration.credentials as Record<string, unknown> || {}
        const apiKey = credentials.apiKey as string
        const token = integration.oauthToken.accessToken

        if (!apiKey) {
            throw new Error('Trello API key not configured')
        }

        // Build card description with prospect info if not provided
        const cardDescription = description || [
            prospect?.email ? `Email: ${prospect.email}` : null,
            prospect?.company ? `Company: ${prospect.company}` : null,
            prospect?.jobTitle ? `Title: ${prospect.jobTitle}` : null,
            prospect?.phoneNumber ? `Phone: ${prospect.phoneNumber}` : null
        ].filter(Boolean).join('\n')

        const response = await fetch(
            `https://api.trello.com/1/cards?key=${apiKey}&token=${token}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idList: config.listId,
                    name: title,
                    desc: cardDescription
                })
            }
        )

        const result = await response.json()
        if (!response.ok) {
            throw new Error(`Trello API error: ${result.message || JSON.stringify(result)}`)
        }

        logger.info('[ActionExecutor] Created Trello card', { cardId: result.id })
        return { created: true, cardId: result.id }
    }

    private async executeCreateAsanaTask(
        config: { projectId: string; title: string; notes?: string; dueInDays?: number },
        context: AutomationContext
    ): Promise<{ created: boolean; taskId?: string }> {
        const prospect = context.data.prospect
        const title = this.replaceVariables(config.title, context)
        const notes = config.notes ? this.replaceVariables(config.notes, context) : undefined

        logger.info('[ActionExecutor] Creating Asana task', {
            projectId: config.projectId,
            title,
            prospectId: prospect?.id
        })

        // Check for Asana integration with OAuth token
        const integration = await db.integration.findFirst({
            where: {
                userId: context.userId,
                type: 'ASANA',
                isActive: true
            },
            include: { oauthToken: true }
        })

        if (!integration || !integration.oauthToken) {
            throw new Error('Asana integration not connected')
        }

        // Build task notes with prospect info if not provided
        const taskNotes = notes || [
            prospect?.email ? `Email: ${prospect.email}` : null,
            prospect?.company ? `Company: ${prospect.company}` : null,
            prospect?.jobTitle ? `Title: ${prospect.jobTitle}` : null,
            prospect?.phoneNumber ? `Phone: ${prospect.phoneNumber}` : null,
            prospect?.linkedinUrl ? `LinkedIn: ${prospect.linkedinUrl}` : null
        ].filter(Boolean).join('\n')

        // Calculate due date if specified
        let dueOn: string | undefined
        if (config.dueInDays) {
            const dueDate = new Date()
            dueDate.setDate(dueDate.getDate() + config.dueInDays)
            dueOn = dueDate.toISOString().split('T')[0]
        }

        const response = await fetch('https://app.asana.com/api/1.0/tasks', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${integration.oauthToken.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    name: title,
                    notes: taskNotes,
                    projects: [config.projectId],
                    ...(dueOn && { due_on: dueOn })
                }
            })
        })

        const result = await response.json()
        if (!response.ok || result.errors) {
            throw new Error(`Asana API error: ${result.errors?.[0]?.message || JSON.stringify(result)}`)
        }

        logger.info('[ActionExecutor] Created Asana task', { taskId: result.data?.gid })
        return { created: true, taskId: result.data?.gid }
    }

    // ============================================================
    // HELPERS
    // ============================================================

    /**
     * Replace {{variables}} in text with actual values
     */
    private replaceVariables(text: string, context: AutomationContext): string {
        return text.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
            const value = this.getNestedValue(context.data, path.trim())
            return value !== undefined ? String(value) : match
        })
    }

    private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
        return path.split('.').reduce((current, key) => {
            return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined
        }, obj as unknown)
    }

    private async logAction(
        context: AutomationContext,
        action: AutomationAction,
        level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR',
        message: string,
        details?: unknown
    ): Promise<void> {
        await db.automationLog.create({
            data: {
                automationId: context.automationId,
                executionId: context.executionId,
                actionIndex: action.order,
                level,
                message: `[${action.type}] ${message}`,
                details: details as any
            }
        })
    }
}

export const automationActionExecutor = new AutomationActionExecutor()
