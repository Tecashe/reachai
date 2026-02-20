/**
 * Automation Executor Inngest Function
 * Handles async execution of automations triggered by events
 */

import { inngest } from '@/lib/inngest/client'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { automationActionExecutor } from '@/lib/services/automation-actions'
import type { AutomationAction, AutomationContext } from '@/lib/types/automation-types'
import type { AutomationTriggerType } from '@prisma/client'
import type { Prisma } from '@prisma/client'

/**
 * Main automation executor - processes automation actions
 */
export const automationExecutor = inngest.createFunction(
    {
        id: 'automation-executor',
        retries: 3,
        concurrency: {
            limit: 10, // Max 10 concurrent executions per user
            key: 'event.data.userId'
        }
    },
    { event: 'automation/execute' },
    async ({ event, step }) => {
        const { executionId, automationId, userId, triggerType, entityType, entityId } = event.data

        logger.info(`[AutomationExecutor] Starting execution ${executionId}`)

        // Load execution and automation
        const execution = await step.run('load-execution', async () => {
            return db.automationExecution.findUnique({
                where: { id: executionId },
                include: { automation: true }
            })
        })

        if (!execution) {
            logger.error(`[AutomationExecutor] Execution ${executionId} not found`)
            return { success: false, error: 'Execution not found' }
        }

        if (execution.status === 'CANCELLED') {
            logger.info(`[AutomationExecutor] Execution ${executionId} was cancelled`)
            return { success: false, error: 'Execution cancelled' }
        }

        // Update status to running
        await step.run('mark-running', async () => {
            return db.automationExecution.update({
                where: { id: executionId },
                data: {
                    status: 'RUNNING',
                    startedAt: new Date()
                }
            })
        })

        // Build context
        const rawContext = await step.run('build-context', async () => {
            return buildExecutionContext(
                userId,
                automationId,
                executionId,
                triggerType as AutomationTriggerType,
                entityType,
                entityId,
                execution.triggerData as Record<string, unknown>
            )
        })

        // Rehydrate Date fields — Inngest serializes step results to JSON,
        // which converts Date objects to strings. We restore them here.
        if (rawContext.data.email) {
            const e = rawContext.data.email as Record<string, unknown>
            if (e.sentAt) e.sentAt = new Date(e.sentAt as string)
            if (e.openedAt) e.openedAt = new Date(e.openedAt as string)
            if (e.clickedAt) e.clickedAt = new Date(e.clickedAt as string)
            if (e.repliedAt) e.repliedAt = new Date(e.repliedAt as string)
        }
        const context = rawContext as AutomationContext

        // Parse actions
        const actions = execution.automation.actions as unknown as AutomationAction[]
        let currentIndex = execution.currentActionIndex
        let failedActions = 0
        let successfulActions = 0

        // Execute actions in order
        for (let i = currentIndex; i < actions.length; i++) {
            const action = actions[i]

            // Check for delays
            if (action.delayMinutes && action.delayMinutes > 0) {
                // Schedule continuation after delay
                await step.run(`schedule-delay-${i}`, async () => {
                    const nextActionAt = new Date(Date.now() + action.delayMinutes! * 60 * 1000)
                    await db.automationExecution.update({
                        where: { id: executionId },
                        data: {
                            status: 'WAITING',
                            currentActionIndex: i,
                            nextActionAt
                        }
                    })
                })

                // Wait for the delay
                await step.sleep(`delay-${action.id}`, `${action.delayMinutes}m`)

                // Continue after delay
                await step.run(`continue-after-delay-${i}`, async () => {
                    await db.automationExecution.update({
                        where: { id: executionId },
                        data: { status: 'RUNNING' }
                    })
                })
            }

            // Execute the action
            const result = await step.run(`execute-action-${i}-${action.type}`, async () => {
                return automationActionExecutor.execute(action, context)
            })

            // Update progress
            await step.run(`update-progress-${i}`, async () => {
                if (result.success) {
                    successfulActions++
                } else {
                    failedActions++
                }

                return db.automationExecution.update({
                    where: { id: executionId },
                    data: {
                        currentActionIndex: i + 1,
                        actionsExecuted: successfulActions,
                        actionsFailed: failedActions,
                        resultData: {
                            ...((execution.resultData as Record<string, unknown>) || {}),
                            [action.id]: result
                        } as Prisma.InputJsonValue
                    }
                })
            })

            // Stop if action failed and continueOnError is false
            if (!result.success && !action.continueOnError) {
                await step.run('mark-failed', async () => {
                    await db.automationExecution.update({
                        where: { id: executionId },
                        data: {
                            status: 'FAILED',
                            completedAt: new Date(),
                            errorMessage: result.error
                        }
                    })

                    await db.automation.update({
                        where: { id: automationId },
                        data: { failedRuns: { increment: 1 } }
                    })
                })

                return { success: false, error: result.error }
            }
        }

        // All actions completed
        await step.run('mark-completed', async () => {
            await db.automationExecution.update({
                where: { id: executionId },
                data: {
                    status: 'COMPLETED',
                    completedAt: new Date()
                }
            })

            await db.automation.update({
                where: { id: automationId },
                data: { successfulRuns: { increment: 1 } }
            })
        })

        logger.info(`[AutomationExecutor] Completed execution ${executionId}`, {
            actionsExecuted: successfulActions,
            actionsFailed: failedActions
        })

        return {
            success: true,
            actionsExecuted: successfulActions,
            actionsFailed: failedActions
        }
    }
)

/**
 * Continue execution for delayed automations
 * Runs periodically to check for waiting executions
 */
export const automationContinuer = inngest.createFunction(
    {
        id: 'automation-continuer',
        retries: 2
    },
    { cron: '*/5 * * * *' }, // Every 5 minutes
    async ({ step }) => {
        logger.info('[AutomationContinuer] Checking for waiting executions')

        // Find executions waiting for delayed actions
        const waitingExecutions = await step.run('find-waiting', async () => {
            return db.automationExecution.findMany({
                where: {
                    status: 'WAITING',
                    nextActionAt: {
                        lte: new Date()
                    }
                },
                include: { automation: true },
                take: 50
            })
        })

        logger.info(`[AutomationContinuer] Found ${waitingExecutions.length} executions to continue`)

        // Trigger continuation for each
        for (const execution of waitingExecutions) {
            await step.run(`trigger-continue-${execution.id}`, async () => {
                await inngest.send({
                    name: 'automation/execute',
                    data: {
                        executionId: execution.id,
                        automationId: execution.automationId,
                        userId: execution.automation.userId,
                        triggerType: (execution.triggerData as Record<string, unknown>)?.triggerType || 'WEBHOOK_RECEIVED',
                        entityType: execution.triggerEntityType,
                        entityId: execution.triggerEntityId
                    }
                })
            })
        }

        return { continued: waitingExecutions.length }
    }
)

/**
 * Build execution context from trigger data
 */
async function buildExecutionContext(
    userId: string,
    automationId: string,
    executionId: string,
    triggerType: AutomationTriggerType,
    entityType: string,
    entityId: string,
    triggerData: Record<string, unknown>
): Promise<AutomationContext> {
    const context: AutomationContext = {
        userId,
        automationId,
        executionId,
        triggerType,
        entityType,
        entityId,
        data: {}
    }

    // Load prospect if available
    const prospectId = (triggerData?.prospectId as string) ||
        (entityType === 'prospect' ? entityId : undefined)

    if (prospectId) {
        const prospect = await db.prospect.findUnique({
            where: { id: prospectId }
        })
        if (prospect) {
            context.data.prospect = {
                id: prospect.id,
                email: prospect.email,
                firstName: prospect.firstName || undefined,
                lastName: prospect.lastName || undefined,
                company: prospect.company || undefined,
                jobTitle: prospect.jobTitle || undefined,
                status: prospect.status,
                customFields: (prospect.personalizationTokens as Record<string, unknown>) || {}
            }
        }
    }

    // Load email if available
    const emailLogId = triggerData?.emailLogId as string
    if (emailLogId) {
        const email = await db.emailLog.findUnique({
            where: { id: emailLogId }
        })
        if (email) {
            context.data.email = {
                id: email.id,
                subject: email.subject,
                body: email.body ?? undefined,
                fromEmail: email.fromEmail,
                toEmail: email.toEmail,
                sentAt: email.sentAt ? new Date(email.sentAt) : undefined,
                openedAt: email.openedAt ? new Date(email.openedAt) : undefined,
                clickedAt: email.clickedAt ? new Date(email.clickedAt) : undefined,
                repliedAt: email.repliedAt ? new Date(email.repliedAt) : undefined,
                openCount: email.opens,
                clickCount: email.clicks
            }
        }
    }

    // Load sequence data if available
    const sequenceId = triggerData?.sequenceId as string
    if (sequenceId) {
        const sequence = await db.sequence.findUnique({
            where: { id: sequenceId }
        })
        if (sequence) {
            context.data.sequence = {
                id: sequence.id,
                name: sequence.name
            }
        }
    }

    // Load campaign data if available
    const campaignId = triggerData?.campaignId as string
    if (campaignId) {
        const campaign = await db.campaign.findUnique({
            where: { id: campaignId }
        })
        if (campaign) {
            context.data.campaign = {
                id: campaign.id,
                name: campaign.name,
                status: campaign.status
            }
        }
    }

    // Load user data
    const user = await db.user.findUnique({
        where: { id: userId }
    })
    if (user) {
        context.data.user = {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            timezone: user.timezone
        }
    }

    // Include webhook payload if this is a webhook trigger
    if (triggerType === 'WEBHOOK_RECEIVED' && triggerData?.payload) {
        context.data.webhook = {
            platform: triggerData.platform as any,
            payload: triggerData.payload as Record<string, unknown>,
            receivedAt: new Date()
        }
    }

    return context
}
