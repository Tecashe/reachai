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
            body,
            sendingAccountId: sendingAccount.id,
            prospectId: prospect.id,
            campaignId: context.data.campaign?.id,
            userId: context.userId
        })

        return { emailLogId: result.emailLogId }
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
