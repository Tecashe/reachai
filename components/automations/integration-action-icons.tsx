'use client'

import Image from 'next/image'
import {
    Webhook,
    Bell,
    Briefcase,
} from 'lucide-react'

/**
 * Integration action type to provider mapping
 * Maps automation action types to their corresponding integration providers
 */
const ACTION_TO_PROVIDER: Record<string, string> = {
    // CRM Actions
    'SYNC_TO_HUBSPOT': 'HUBSPOT',
    'SYNC_TO_SALESFORCE': 'SALESFORCE',
    'SYNC_TO_PIPEDRIVE': 'PIPEDRIVE',
    'SYNC_TO_ZOHO': 'ZOHO_CRM',
    'SYNC_TO_CRM': 'HUBSPOT', // Default to HubSpot for generic CRM sync

    // Communication
    'SEND_SLACK_MESSAGE': 'SLACK',
    'SEND_SLACK': 'SLACK',

    // Productivity
    'ADD_TO_NOTION': 'NOTION',
    'ADD_TO_AIRTABLE': 'AIRTABLE',
    'CREATE_TRELLO_CARD': 'TRELLO',
    'CREATE_ASANA_TASK': 'ASANA',
    'CREATE_CLICKUP_TASK': 'CLICKUP',

    // Analytics
    'TRACK_IN_AMPLITUDE': 'AMPLITUDE',
    'ADD_TO_SHEETS': 'GOOGLE_SHEETS',

    // Email Outreach
    'SYNC_TO_MAILCHIMP': 'MAILCHIMP',
    'SYNC_TO_KLAVIYO': 'KLAVIYO',
}

/**
 * Provider icon file mapping
 */
const PROVIDER_ICON_MAP: Record<string, string> = {
    'AIRTABLE': 'airtable',
    'AMPLITUDE': 'amplitude',
    'ASANA': 'asana',
    'CLICKUP': 'clickup',
    'GOOGLE_SHEETS': 'google_sheets',
    'HUBSPOT': 'hubspot',
    'INTERCOM': 'intercom',
    'KLAVIYO': 'klaviyo',
    'MAILCHIMP': 'mailchimp',
    'MIXPANEL': 'mixpanel',
    'NOTION': 'notion',
    'PIPEDRIVE': 'pipedrive',
    'SALESFORCE': 'salesforce',
    'SEGMENT': 'segment',
    'SLACK': 'slack',
    'TRELLO': 'trello',
    'ZENDESK': 'zendesk',
    'ZOHO_CRM': 'zoho_crm',
}

/**
 * Check if an action type is an integration action
 */
export function isIntegrationAction(actionType: string): boolean {
    return actionType in ACTION_TO_PROVIDER
}

/**
 * Get the provider key for an integration action
 */
export function getProviderForAction(actionType: string): string | null {
    return ACTION_TO_PROVIDER[actionType] || null
}

/**
 * Get the icon component for an integration action
 * Returns the provider's SVG icon if it's an integration action,
 * otherwise returns a fallback Lucide icon
 */
export function getIntegrationActionIcon(
    actionType: string,
    size: 'sm' | 'md' | 'lg' = 'sm'
): React.ReactNode {
    const sizeMap = {
        sm: 16,
        md: 20,
        lg: 24,
    }
    const pixelSize = sizeMap[size]

    const provider = ACTION_TO_PROVIDER[actionType]

    if (provider && PROVIDER_ICON_MAP[provider]) {
        const iconFileName = PROVIDER_ICON_MAP[provider]
        return (
            <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: pixelSize, height: pixelSize }}
            >
                <Image
                    src={`/icons/${iconFileName}.svg`}
                    alt={`${provider} icon`}
                    width={pixelSize}
                    height={pixelSize}
                    className="object-contain"
                />
            </div>
        )
    }

    // Fallback icons for non-integration actions
    switch (actionType) {
        case 'SEND_WEBHOOK':
            return <Webhook className="flex-shrink-0" style={{ width: pixelSize, height: pixelSize }} />
        case 'SEND_NOTIFICATION':
            return <Bell className="flex-shrink-0" style={{ width: pixelSize, height: pixelSize }} />
        default:
            return <Briefcase className="flex-shrink-0" style={{ width: pixelSize, height: pixelSize }} />
    }
}

/**
 * Integration action definitions for the workflow sidebar
 * Each action includes its type, label, provider, and category
 */
export const INTEGRATION_ACTIONS = [
    // CRM
    { type: 'SYNC_TO_HUBSPOT', label: 'Sync to HubSpot', provider: 'HUBSPOT', category: 'CRM' },
    { type: 'SYNC_TO_SALESFORCE', label: 'Sync to Salesforce', provider: 'SALESFORCE', category: 'CRM' },
    { type: 'SYNC_TO_PIPEDRIVE', label: 'Sync to Pipedrive', provider: 'PIPEDRIVE', category: 'CRM' },

    // Communication
    { type: 'SEND_SLACK_MESSAGE', label: 'Send Slack Message', provider: 'SLACK', category: 'Communication' },

    // Productivity
    { type: 'ADD_TO_NOTION', label: 'Add to Notion', provider: 'NOTION', category: 'Productivity' },
    { type: 'ADD_TO_AIRTABLE', label: 'Add to Airtable', provider: 'AIRTABLE', category: 'Productivity' },
    { type: 'CREATE_TRELLO_CARD', label: 'Create Trello Card', provider: 'TRELLO', category: 'Productivity' },
    { type: 'CREATE_ASANA_TASK', label: 'Create Asana Task', provider: 'ASANA', category: 'Productivity' },

    // Other
    { type: 'SEND_WEBHOOK', label: 'Send Webhook', provider: null, category: 'Other' },
] as const

export type IntegrationActionType = typeof INTEGRATION_ACTIONS[number]['type']
