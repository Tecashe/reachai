/**
 * Automation Engine
 * Core service for triggering and executing automations
 */

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { inngest } from '@/lib/inngest/client'
import type {
    AutomationContext,
    TriggerEvent,
    ConditionGroup,
    Condition,
    AutomationAction
} from '@/lib/types/automation-types'
import type { AutomationTriggerType, Automation, AutomationExecutionStatus } from '@prisma/client'
import { Prisma } from '@prisma/client'

// ============================================================
// AUTOMATION ENGINE
// ============================================================

class AutomationEngine {
    /**
     * Main entry point - trigger automations for an event
     * Called from various places in the app when events occur
     */
    async trigger(event: TriggerEvent): Promise<void> {
        logger.info(`[AutomationEngine] Triggering automations for ${event.type}`, {
            userId: event.userId,
            entityType: event.entityType,
            entityId: event.entityId
        })

        try {
            // Find all active automations for this trigger type and user
            const automations = await db.automation.findMany({
                where: {
                    userId: event.userId,
                    status: 'ACTIVE',
                    triggerType: event.type as AutomationTriggerType
                }
            })

            logger.info(`[AutomationEngine] Found ${automations.length} active automations`)

            // Check each automation
            for (const automation of automations) {
                await this.processAutomation(automation, event)
            }
        } catch (error) {
            logger.error('[AutomationEngine] Error triggering automations', { error, event })
        }
    }

    /**
     * Process a single automation for an event
     */
    private async processAutomation(automation: Automation, event: TriggerEvent): Promise<void> {
        try {
            // Check rate limits
            if (!await this.checkRateLimits(automation)) {
                logger.warn(`[AutomationEngine] Rate limit exceeded for automation ${automation.id}`)
                return
            }

            // Check cooldown
            if (!await this.checkCooldown(automation, event)) {
                logger.debug(`[AutomationEngine] Cooldown active for automation ${automation.id}`)
                return
            }

            // Check trigger config filters
            if (!this.matchesTriggerConfig(automation, event)) {
                logger.debug(`[AutomationEngine] Event does not match trigger config for ${automation.id}`)
                return
            }

            // Check conditions
            if (!await this.evaluateConditions(automation, event)) {
                logger.debug(`[AutomationEngine] Conditions not met for automation ${automation.id}`)
                return
            }

            // Check max runs
            if (automation.maxRuns && automation.totalRuns >= automation.maxRuns) {
                logger.info(`[AutomationEngine] Max runs reached for automation ${automation.id}`)
                return
            }

            // All checks passed - queue for execution via Inngest
            await this.queueExecution(automation, event)
        } catch (error) {
            logger.error(`[AutomationEngine] Error processing automation ${automation.id}`, { error })
            await this.logError(automation.id, null, 'Failed to process automation', error)
        }
    }

    /**
     * Check rate limits (per hour and per day)
     */
    private async checkRateLimits(automation: Automation): Promise<boolean> {
        const now = new Date()
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

        // Reset hourly counter if needed
        if (automation.lastResetHour < hourAgo) {
            await db.automation.update({
                where: { id: automation.id },
                data: {
                    runsThisHour: 0,
                    lastResetHour: now
                }
            })
            automation.runsThisHour = 0
        }

        // Reset daily counter if needed
        if (automation.lastResetDay < dayAgo) {
            await db.automation.update({
                where: { id: automation.id },
                data: {
                    runsToday: 0,
                    lastResetDay: now
                }
            })
            automation.runsToday = 0
        }

        // Check limits
        if (automation.runsThisHour >= automation.runsPerHour) {
            return false
        }
        if (automation.runsToday >= automation.runsPerDay) {
            return false
        }

        return true
    }

    /**
     * Check cooldown for the specific entity
     */
    private async checkCooldown(automation: Automation, event: TriggerEvent): Promise<boolean> {
        // If runOnce is enabled, check if we've already triggered for this entity
        if (automation.runOnce) {
            const existing = await db.automationCooldown.findUnique({
                where: {
                    automationId_entityType_entityId: {
                        automationId: automation.id,
                        entityType: event.entityType,
                        entityId: event.entityId
                    }
                }
            })
            if (existing) {
                return false
            }
        }

        // Check cooldown period
        if (automation.cooldownMin) {
            const cooldownThreshold = new Date(Date.now() - automation.cooldownMin * 60 * 1000)
            const recentTrigger = await db.automationCooldown.findUnique({
                where: {
                    automationId_entityType_entityId: {
                        automationId: automation.id,
                        entityType: event.entityType,
                        entityId: event.entityId
                    }
                }
            })
            if (recentTrigger && recentTrigger.lastTriggeredAt > cooldownThreshold) {
                return false
            }
        }

        return true
    }

    /**
     * Check if event matches the trigger configuration
     */
    private matchesTriggerConfig(automation: Automation, event: TriggerEvent): boolean {
        const config = automation.triggerConfig as Record<string, unknown>
        if (!config || Object.keys(config).length === 0) {
            return true // No specific config means match all
        }

        // Check campaign filter
        if (config.campaignIds && Array.isArray(config.campaignIds)) {
            const eventCampaignId = (event.data as Record<string, unknown>).campaignId
            if (!config.campaignIds.includes(eventCampaignId)) {
                return false
            }
        }

        // Check sequence filter
        if (config.sequenceIds && Array.isArray(config.sequenceIds)) {
            const eventSequenceId = (event.data as Record<string, unknown>).sequenceId
            if (!config.sequenceIds.includes(eventSequenceId)) {
                return false
            }
        }

        // Check webhook platform filter
        if (config.platform && event.type === 'WEBHOOK_RECEIVED') {
            const eventPlatform = (event.data as Record<string, unknown>).platform
            if (config.platform !== eventPlatform) {
                return false
            }
        }

        return true
    }

    /**
     * Evaluate automation conditions
     */
    private async evaluateConditions(automation: Automation, event: TriggerEvent): Promise<boolean> {
        const conditions = automation.conditions as ConditionGroup[] | null
        if (!conditions || conditions.length === 0) {
            return true // No conditions means always pass
        }

        // Build context data for condition evaluation
        const context = await this.buildContextData(automation.userId, event)

        // Evaluate each condition group (they are AND-ed together at the top level)
        for (const group of conditions) {
            if (!this.evaluateConditionGroup(group, context)) {
                return false
            }
        }

        return true
    }

    /**
     * Evaluate a condition group recursively
     */
    private evaluateConditionGroup(group: ConditionGroup, context: Record<string, unknown>): boolean {
        const results = group.conditions.map(item => {
            if ('operator' in item && ('conditions' in item)) {
                // Nested group
                return this.evaluateConditionGroup(item as ConditionGroup, context)
            } else {
                // Single condition
                return this.evaluateCondition(item as Condition, context)
            }
        })

        if (group.operator === 'AND') {
            return results.every(r => r)
        } else {
            return results.some(r => r)
        }
    }

    /**
     * Evaluate a single condition
     */
    private evaluateCondition(condition: Condition, context: Record<string, unknown>): boolean {
        const fieldValue = this.getNestedValue(context, condition.field)
        const targetValue = condition.value

        switch (condition.operator) {
            case 'equals':
                return fieldValue === targetValue
            case 'notEquals':
                return fieldValue !== targetValue
            case 'contains':
                if (typeof fieldValue === 'string') {
                    return fieldValue.includes(String(targetValue))
                }
                if (Array.isArray(fieldValue)) {
                    return fieldValue.includes(targetValue)
                }
                return false
            case 'notContains':
                if (typeof fieldValue === 'string') {
                    return !fieldValue.includes(String(targetValue))
                }
                if (Array.isArray(fieldValue)) {
                    return !fieldValue.includes(targetValue)
                }
                return true
            case 'startsWith':
                return typeof fieldValue === 'string' && fieldValue.startsWith(String(targetValue))
            case 'endsWith':
                return typeof fieldValue === 'string' && fieldValue.endsWith(String(targetValue))
            case 'greaterThan':
                return typeof fieldValue === 'number' && fieldValue > Number(targetValue)
            case 'lessThan':
                return typeof fieldValue === 'number' && fieldValue < Number(targetValue)
            case 'greaterOrEqual':
                return typeof fieldValue === 'number' && fieldValue >= Number(targetValue)
            case 'lessOrEqual':
                return typeof fieldValue === 'number' && fieldValue <= Number(targetValue)
            case 'isEmpty':
                return fieldValue === null || fieldValue === undefined || fieldValue === '' ||
                    (Array.isArray(fieldValue) && fieldValue.length === 0)
            case 'isNotEmpty':
                return fieldValue !== null && fieldValue !== undefined && fieldValue !== '' &&
                    !(Array.isArray(fieldValue) && fieldValue.length === 0)
            case 'in':
                return Array.isArray(targetValue) && (targetValue as unknown[]).includes(fieldValue)
            case 'notIn':
                return Array.isArray(targetValue) && !(targetValue as unknown[]).includes(fieldValue)
            default:
                return false
        }
    }

    /**
     * Get nested value from object using dot notation
     */
    private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
        return path.split('.').reduce((current, key) => {
            return current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined
        }, obj as unknown)
    }

    /**
     * Build context data for condition evaluation
     */
    private async buildContextData(userId: string, event: TriggerEvent): Promise<Record<string, unknown>> {
        const context: Record<string, unknown> = {
            trigger: event.data,
            timestamp: event.timestamp
        }

        // Load prospect data if available
        const prospectId = (event.data as Record<string, string>).prospectId
        if (prospectId) {
            const prospect = await db.prospect.findUnique({
                where: { id: prospectId }
            })
            if (prospect) {
                context.prospect = prospect
            }
        }

        // Load email data if available
        const emailLogId = (event.data as Record<string, string>).emailLogId
        if (emailLogId) {
            const email = await db.emailLog.findUnique({
                where: { id: emailLogId }
            })
            if (email) {
                context.email = email
            }
        }

        return context
    }

    /**
     * Queue automation execution via Inngest
     */
    private async queueExecution(automation: Automation, event: TriggerEvent): Promise<void> {
        // Create execution record
        const actions = automation.actions as unknown as AutomationAction[]
        const execution = await db.automationExecution.create({
            data: {
                automationId: automation.id,
                triggerEntityType: event.entityType,
                triggerEntityId: event.entityId,
                triggerData: event.data as Prisma.InputJsonValue,
                status: 'PENDING',
                totalActions: actions.length
            }
        })

        // Update automation stats
        await db.automation.update({
            where: { id: automation.id },
            data: {
                totalRuns: { increment: 1 },
                runsThisHour: { increment: 1 },
                runsToday: { increment: 1 },
                lastTriggeredAt: new Date()
            }
        })

        // Record cooldown
        await db.automationCooldown.upsert({
            where: {
                automationId_entityType_entityId: {
                    automationId: automation.id,
                    entityType: event.entityType,
                    entityId: event.entityId
                }
            },
            create: {
                automationId: automation.id,
                entityType: event.entityType,
                entityId: event.entityId,
                lastTriggeredAt: new Date(),
                runCount: 1
            },
            update: {
                lastTriggeredAt: new Date(),
                runCount: { increment: 1 }
            }
        })

        // Send to Inngest for async execution
        await inngest.send({
            name: 'automation/execute',
            data: {
                executionId: execution.id,
                automationId: automation.id,
                userId: event.userId,
                triggerType: event.type,
                entityType: event.entityType,
                entityId: event.entityId
            }
        })

        logger.info(`[AutomationEngine] Queued execution ${execution.id} for automation ${automation.id}`)
    }

    /**
     * Log an error for an automation
     */
    private async logError(
        automationId: string,
        executionId: string | null,
        message: string,
        error: unknown
    ): Promise<void> {
        await db.automationLog.create({
            data: {
                automationId,
                executionId,
                level: 'ERROR',
                message,
                details: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : { error: String(error) }
            }
        })
    }
}

// Export singleton instance
export const automationEngine = new AutomationEngine()

// ============================================================
// HELPER FUNCTIONS FOR TRIGGERING FROM VARIOUS PLACES
// ============================================================

/**
 * Trigger email-related automations
 */
export async function triggerEmailAutomation(
    type: 'EMAIL_SENT' | 'EMAIL_OPENED' | 'EMAIL_CLICKED' | 'EMAIL_REPLIED' | 'EMAIL_BOUNCED',
    userId: string,
    emailLogId: string,
    data: {
        prospectId: string
        campaignId?: string
        sequenceId?: string
        subject: string
        openCount?: number
        clickedUrl?: string
        replySentiment?: string
    }
): Promise<void> {
    await automationEngine.trigger({
        type,
        userId,
        entityType: 'email',
        entityId: emailLogId,
        timestamp: new Date(),
        data: {
            emailLogId,
            ...data
        }
    })
}

/**
 * Trigger sequence-related automations
 */
export async function triggerSequenceAutomation(
    type: 'SEQUENCE_ENROLLED' | 'SEQUENCE_COMPLETED' | 'SEQUENCE_EXITED' | 'SEQUENCE_STEP_COMPLETED',
    userId: string,
    enrollmentId: string,
    data: {
        sequenceId: string
        prospectId: string
        stepNumber?: number
        exitReason?: string
    }
): Promise<void> {
    await automationEngine.trigger({
        type,
        userId,
        entityType: 'sequence_enrollment',
        entityId: enrollmentId,
        timestamp: new Date(),
        data: {
            enrollmentId,
            ...data
        }
    })
}

/**
 * Trigger prospect-related automations
 */
export async function triggerProspectAutomation(
    type: 'PROSPECT_CREATED' | 'PROSPECT_UPDATED' | 'PROSPECT_TAG_ADDED' | 'PROSPECT_STATUS_CHANGED',
    userId: string,
    prospectId: string,
    data: {
        changedFields?: string[]
        oldValues?: Record<string, unknown>
        newValues?: Record<string, unknown>
        addedTags?: string[]
        oldStatus?: string
        newStatus?: string
    }
): Promise<void> {
    await automationEngine.trigger({
        type,
        userId,
        entityType: 'prospect',
        entityId: prospectId,
        timestamp: new Date(),
        data: {
            prospectId,
            ...data
        }
    })
}

/**
 * Trigger webhook-received automations
 */
export async function triggerWebhookAutomation(
    userId: string,
    webhookId: string,
    platform: string,
    payload: Record<string, unknown>
): Promise<void> {
    await automationEngine.trigger({
        type: 'WEBHOOK_RECEIVED',
        userId,
        entityType: 'webhook',
        entityId: webhookId,
        timestamp: new Date(),
        data: {
            webhookId,
            platform,
            payload
        }
    })
}
