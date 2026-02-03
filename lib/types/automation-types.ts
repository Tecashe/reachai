/**
 * Automation System Types
 * TypeScript interfaces for the workflow automation system
 */

import type { AutomationTriggerType, AutomationWebhookPlatform } from '@prisma/client'

// ============================================================
// TRIGGER CONFIGURATIONS
// ============================================================

export interface EmailTriggerConfig {
    campaignIds?: string[]      // Filter by specific campaigns
    sequenceIds?: string[]      // Filter by specific sequences
    linkUrl?: string            // For EMAIL_CLICKED - specific link
    sentimentFilter?: 'positive' | 'negative' | 'neutral' | 'any'  // For EMAIL_REPLIED
}

export interface SequenceTriggerConfig {
    sequenceIds?: string[]      // Filter by specific sequences
    stepNumber?: number         // For SEQUENCE_STEP_COMPLETED
    exitReasons?: string[]      // For SEQUENCE_EXITED
}

export interface ProspectTriggerConfig {
    folderIds?: string[]        // Filter by folders
    tags?: string[]             // Filter by tags
    statuses?: string[]         // Filter by statuses
    fields?: string[]           // For PROSPECT_UPDATED - which fields changed
}

export interface CampaignTriggerConfig {
    campaignIds?: string[]      // Filter by specific campaigns
}

export interface CRMTriggerConfig {
    provider?: 'hubspot' | 'salesforce' | 'pipedrive'
    dealStages?: string[]       // Filter by deal stages
    eventTypes?: string[]       // Specific CRM event types
}

export interface WebhookTriggerConfig {
    webhookId: string           // Reference to AutomationWebhook
    platform: AutomationWebhookPlatform
    payloadFilters?: PayloadFilter[]  // Filter incoming payloads
}

export interface ScheduleTriggerConfig {
    cron: string                // Cron expression (e.g., "0 9 * * 1" = 9 AM every Monday)
    timezone: string            // Timezone for the schedule
}

export interface PayloadFilter {
    path: string                // JSON path (e.g., "data.event_type")
    operator: 'equals' | 'contains' | 'startsWith' | 'exists' | 'notEquals'
    value?: string | number | boolean
}

// Union type for all trigger configs
export type TriggerConfig =
    | { type: 'email'; config: EmailTriggerConfig }
    | { type: 'sequence'; config: SequenceTriggerConfig }
    | { type: 'prospect'; config: ProspectTriggerConfig }
    | { type: 'campaign'; config: CampaignTriggerConfig }
    | { type: 'crm'; config: CRMTriggerConfig }
    | { type: 'webhook'; config: WebhookTriggerConfig }
    | { type: 'schedule'; config: ScheduleTriggerConfig }

// ============================================================
// ACTION TYPES
// ============================================================

export type AutomationActionType =
    // Email Actions
    | 'SEND_EMAIL'
    | 'SCHEDULE_EMAIL'
    | 'PAUSE_SEQUENCE'
    | 'RESUME_SEQUENCE'
    | 'REMOVE_FROM_SEQUENCE'
    | 'MOVE_TO_SEQUENCE'
    // Prospect Actions
    | 'UPDATE_PROSPECT'
    | 'ADD_TAG'
    | 'REMOVE_TAG'
    | 'MOVE_TO_FOLDER'
    | 'CHANGE_STATUS'
    // CRM Actions
    | 'SYNC_TO_CRM'
    | 'CREATE_CRM_DEAL'
    | 'UPDATE_CRM_DEAL'
    | 'CREATE_CRM_CONTACT'
    // Communication Actions
    | 'SEND_SLACK_MESSAGE'
    | 'SEND_WEBHOOK'
    | 'SEND_NOTIFICATION'
    // Task Actions
    | 'CREATE_TASK'
    // Logic Actions
    | 'DELAY'
    | 'CONDITION_BRANCH'
    | 'SPLIT_TEST'

// ============================================================
// ACTION CONFIGURATIONS
// ============================================================

export interface SendEmailActionConfig {
    templateId?: string         // Use existing template
    subject?: string            // Custom subject (supports variables)
    body?: string               // Custom body (supports variables)
    fromAccountId?: string      // Specific sending account
    useAI?: boolean             // AI-generate personalization
}

export interface ScheduleEmailActionConfig extends SendEmailActionConfig {
    delayMinutes?: number       // Delay from trigger
    scheduledTime?: string      // Specific time (HH:MM)
    sendInBusinessHours?: boolean
    timezone?: string
}

export interface SequenceActionConfig {
    sequenceId: string          // Target sequence
    stepNumber?: number         // Start from specific step
}

export interface ProspectUpdateConfig {
    fields: Record<string, string | number | boolean>  // Field updates
}

export interface TagActionConfig {
    tags: string[]              // Tags to add/remove
}

export interface FolderActionConfig {
    folderId: string            // Target folder
}

export interface StatusActionConfig {
    status: string              // New status
}

export interface CRMSyncConfig {
    provider: 'hubspot' | 'salesforce' | 'pipedrive'
    createIfNotExists?: boolean
    fieldMapping?: Record<string, string>  // Our field -> CRM field
}

export interface CRMDealConfig {
    provider: 'hubspot' | 'salesforce' | 'pipedrive'
    dealName?: string           // Supports variables like {{prospect.company}}
    stage?: string
    amount?: number
    properties?: Record<string, string>
}

export interface SlackMessageConfig {
    channel?: string            // Channel ID or name
    message: string             // Supports variables
    mentionUsers?: string[]     // User IDs to mention
    includeProspectDetails?: boolean
}

export interface WebhookActionConfig {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'PATCH'
    headers?: Record<string, string>
    body?: Record<string, unknown>  // Supports variables
    authentication?: {
        type: 'none' | 'bearer' | 'basic' | 'apikey'
        token?: string
        username?: string
        password?: string
        apiKeyHeader?: string
        apiKeyValue?: string
    }
}

export interface NotificationConfig {
    type: 'email' | 'in_app' | 'both'
    recipients?: string[]       // User IDs or 'owner' for automation owner
    subject?: string
    message: string             // Supports variables
    priority?: 'low' | 'medium' | 'high'
}

export interface TaskConfig {
    title: string               // Supports variables
    description?: string
    assignee?: string           // User ID or 'owner'
    dueInMinutes?: number       // Due date as offset from now
    priority?: 'low' | 'medium' | 'high' | 'urgent'
}

export interface DelayConfig {
    minutes?: number
    hours?: number
    days?: number
    until?: string              // Specific time (HH:MM)
    untilBusinessHours?: boolean
    timezone?: string
}

export interface ConditionBranchConfig {
    conditions: ConditionGroup[]
    trueBranchActions: string[] // Action IDs to execute if true
    falseBranchActions: string[] // Action IDs to execute if false
}

export interface SplitTestConfig {
    variants: {
        weight: number            // Percentage (all must sum to 100)
        actionIds: string[]       // Actions for this variant
    }[]
}

// ============================================================
// CONDITION TYPES
// ============================================================

export interface Condition {
    field: string               // Field path (e.g., "prospect.tags", "email.openCount")
    operator: ConditionOperator
    value: string | number | boolean | string[]
}

export type ConditionOperator =
    | 'equals'
    | 'notEquals'
    | 'contains'
    | 'notContains'
    | 'startsWith'
    | 'endsWith'
    | 'greaterThan'
    | 'lessThan'
    | 'greaterOrEqual'
    | 'lessOrEqual'
    | 'isEmpty'
    | 'isNotEmpty'
    | 'in'
    | 'notIn'

export interface ConditionGroup {
    operator: 'AND' | 'OR'
    conditions: (Condition | ConditionGroup)[]
}

// ============================================================
// AUTOMATION ACTION (stored in actions JSON)
// ============================================================

export interface AutomationAction {
    id: string                  // Unique ID for this action
    type: AutomationActionType
    order: number               // Execution order
    name?: string               // Display name
    config: ActionConfig        // Type-specific configuration
    delayMinutes?: number       // Delay before executing
    continueOnError?: boolean   // Continue automation if this action fails
}

export type ActionConfig =
    | SendEmailActionConfig
    | ScheduleEmailActionConfig
    | SequenceActionConfig
    | ProspectUpdateConfig
    | TagActionConfig
    | FolderActionConfig
    | StatusActionConfig
    | CRMSyncConfig
    | CRMDealConfig
    | SlackMessageConfig
    | WebhookActionConfig
    | NotificationConfig
    | TaskConfig
    | DelayConfig
    | ConditionBranchConfig
    | SplitTestConfig

// ============================================================
// EXECUTION CONTEXT
// ============================================================

export interface AutomationContext {
    userId: string
    automationId: string
    executionId: string

    // Trigger entity
    triggerType: AutomationTriggerType
    entityType: string
    entityId: string

    // Available data for variable substitution
    data: {
        prospect?: ProspectData
        email?: EmailData
        sequence?: SequenceData
        campaign?: CampaignData
        webhook?: WebhookData
        crm?: CRMData
        user?: UserData
    }
}

export interface ProspectData {
    id: string
    email: string
    firstName?: string
    lastName?: string
    company?: string
    jobTitle?: string
    tags?: string[]
    status?: string
    phoneNumber?: string
    linkedinUrl?: string
    websiteUrl?: string
    customFields?: Record<string, unknown>
}

export interface EmailData {
    id: string
    subject: string
    body?: string
    fromEmail: string
    toEmail: string
    sentAt?: Date
    openedAt?: Date
    clickedAt?: Date
    repliedAt?: Date
    openCount?: number
    clickCount?: number
}

export interface SequenceData {
    id: string
    name: string
    currentStep?: number
    enrolledAt?: Date
    completedAt?: Date
    exitReason?: string
}

export interface CampaignData {
    id: string
    name: string
    status: string
}

export interface WebhookData {
    platform: AutomationWebhookPlatform
    payload: Record<string, unknown>
    receivedAt: Date
}

export interface CRMData {
    provider: string
    dealId?: string
    contactId?: string
    event?: string
}

export interface UserData {
    id: string
    email: string
    name?: string
    timezone: string
}

// ============================================================
// API REQUEST/RESPONSE TYPES
// ============================================================

export interface CreateAutomationRequest {
    name: string
    description?: string
    triggerType: AutomationTriggerType
    triggerConfig: Record<string, unknown>
    conditions?: ConditionGroup[]
    actions: AutomationAction[]
    runOnce?: boolean
    cooldownMin?: number
    maxRuns?: number
    runsPerHour?: number
    runsPerDay?: number
    tags?: string[]
}

export interface UpdateAutomationRequest extends Partial<CreateAutomationRequest> {
    status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
}

export interface AutomationListFilter {
    status?: string[]
    triggerType?: AutomationTriggerType[]
    tags?: string[]
    search?: string
}

export interface AutomationStats {
    totalRuns: number
    successfulRuns: number
    failedRuns: number
    successRate: number
    averageExecutionTime?: number
    lastTriggeredAt?: Date
    runsThisHour: number
    runsToday: number
}

// ============================================================
// TRIGGER EVENT PAYLOADS
// ============================================================

export interface TriggerEvent {
    type: AutomationTriggerType
    userId: string
    entityType: string
    entityId: string
    timestamp: Date
    data: Record<string, unknown>
}

export interface EmailTriggerEvent extends TriggerEvent {
    type: 'EMAIL_SENT' | 'EMAIL_OPENED' | 'EMAIL_CLICKED' | 'EMAIL_REPLIED' | 'EMAIL_BOUNCED'
    data: {
        emailLogId: string
        prospectId: string
        campaignId?: string
        sequenceId?: string
        subject: string
        openCount?: number
        clickedUrl?: string
        replySentiment?: string
    }
}

export interface SequenceTriggerEvent extends TriggerEvent {
    type: 'SEQUENCE_ENROLLED' | 'SEQUENCE_COMPLETED' | 'SEQUENCE_EXITED' | 'SEQUENCE_STEP_COMPLETED'
    data: {
        sequenceId: string
        enrollmentId: string
        prospectId: string
        stepNumber?: number
        exitReason?: string
    }
}

export interface ProspectTriggerEvent extends TriggerEvent {
    type: 'PROSPECT_CREATED' | 'PROSPECT_UPDATED' | 'PROSPECT_TAG_ADDED' | 'PROSPECT_STATUS_CHANGED'
    data: {
        prospectId: string
        changedFields?: string[]
        oldValues?: Record<string, unknown>
        newValues?: Record<string, unknown>
        addedTags?: string[]
        oldStatus?: string
        newStatus?: string
    }
}

export interface WebhookTriggerEvent extends TriggerEvent {
    type: 'WEBHOOK_RECEIVED'
    data: {
        webhookId: string
        platform: AutomationWebhookPlatform
        payload: Record<string, unknown>
    }
}
