/**
 * Webhook Receiver for Automations
 * POST /api/automations/webhooks/[key] - Receive external webhook triggers
 * 
 * Supports: Trigiffy, Make.com, Zapier, HubSpot, and generic webhooks
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { triggerWebhookAutomation } from '@/lib/services/automation-engine'
import crypto from 'crypto'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params

        // Find webhook by key
        const webhook = await db.automationWebhook.findUnique({
            where: { webhookKey: key }
        })

        if (!webhook) {
            return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
        }

        if (!webhook.isActive) {
            return NextResponse.json({ error: 'Webhook is inactive' }, { status: 403 })
        }

        // Get payload
        let payload: Record<string, unknown>
        try {
            payload = await request.json()
        } catch {
            payload = {}
        }

        // Verify signature if secret is set
        if (webhook.secret) {
            const signature = request.headers.get('x-webhook-signature') ||
                request.headers.get('x-hub-signature-256') ||
                request.headers.get('x-make-signature') ||
                request.headers.get('x-trigiffy-signature')

            if (signature) {
                const expectedSignature = crypto
                    .createHmac('sha256', webhook.secret)
                    .update(JSON.stringify(payload))
                    .digest('hex')

                const signatureValue = signature.replace('sha256=', '')
                if (signatureValue !== expectedSignature) {
                    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
                }
            }
        }

        // Check IP allowlist if configured
        if (webhook.allowedIps?.length > 0) {
            const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                request.headers.get('x-real-ip') ||
                'unknown'

            if (!webhook.allowedIps.includes(clientIp) && !webhook.allowedIps.includes('*')) {
                return NextResponse.json({ error: 'IP not allowed' }, { status: 403 })
            }
        }

        // Update webhook stats
        await db.automationWebhook.update({
            where: { id: webhook.id },
            data: {
                lastReceivedAt: new Date(),
                totalReceived: { increment: 1 },
                lastPayload: payload
            }
        })

        // Extract data based on platform
        const normalizedPayload = normalizePlatformPayload(webhook.platform, payload)

        // Trigger automations
        await triggerWebhookAutomation(
            webhook.userId,
            webhook.id,
            webhook.platform,
            normalizedPayload
        )

        return NextResponse.json({
            success: true,
            webhookId: webhook.id,
            received: true
        })

    } catch (error) {
        console.error('Error processing webhook:', error)
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        )
    }
}

// Also support GET for webhook verification (some services like HubSpot require this)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ key: string }> }
) {
    try {
        const { key } = await params
        const { searchParams } = new URL(request.url)

        // Check if this is a HubSpot verification request
        const hubspotChallenge = searchParams.get('challenge')
        if (hubspotChallenge) {
            return new NextResponse(hubspotChallenge, {
                status: 200,
                headers: { 'Content-Type': 'text/plain' }
            })
        }

        // For other services, just confirm the webhook exists
        const webhook = await db.automationWebhook.findUnique({
            where: { webhookKey: key }
        })

        if (!webhook) {
            return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
        }

        return NextResponse.json({
            status: 'active',
            platform: webhook.platform
        })

    } catch (error) {
        return NextResponse.json({ error: 'Error' }, { status: 500 })
    }
}

/**
 * Normalize payloads from different platforms to a consistent format
 */
function normalizePlatformPayload(
    platform: string,
    payload: Record<string, unknown>
): Record<string, unknown> {
    switch (platform) {
        case 'TRIGIFFY':
            // Trigiffy sends events in a specific format
            return {
                eventType: payload.event || payload.type,
                data: payload.data || payload,
                timestamp: payload.timestamp || new Date().toISOString(),
                source: 'trigiffy',
                originalPayload: payload
            }

        case 'MAKE':
            // Make.com (Integromat) format
            return {
                eventType: payload.scenario || 'make_event',
                data: payload,
                timestamp: new Date().toISOString(),
                source: 'make',
                scenarioId: payload.scenario_id,
                executionId: payload.execution_id,
                originalPayload: payload
            }

        case 'HUBSPOT':
            // HubSpot webhook format
            const hubspotEvents = Array.isArray(payload) ? payload : [payload]
            const firstEvent = hubspotEvents[0] || {}
            return {
                eventType: firstEvent.subscriptionType || 'hubspot_event',
                data: firstEvent,
                timestamp: firstEvent.occurredAt || new Date().toISOString(),
                source: 'hubspot',
                objectId: firstEvent.objectId,
                propertyName: firstEvent.propertyName,
                propertyValue: firstEvent.propertyValue,
                events: hubspotEvents,
                originalPayload: payload
            }

        case 'ZAPIER':
            // Zapier sends data directly
            return {
                eventType: 'zapier_trigger',
                data: payload,
                timestamp: new Date().toISOString(),
                source: 'zapier',
                originalPayload: payload
            }

        case 'GENERIC':
        default:
            // Generic webhook - pass through with metadata
            return {
                eventType: payload.event || payload.type || 'generic_webhook',
                data: payload,
                timestamp: payload.timestamp || new Date().toISOString(),
                source: 'generic',
                originalPayload: payload
            }
    }
}
