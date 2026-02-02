/**
 * Webhook Management API
 * GET /api/automations/webhooks - List user's webhooks
 * POST /api/automations/webhooks - Create new webhook
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { clerkId }
        })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const webhooks = await db.automationWebhook.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        })

        // Build URLs for each webhook
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const webhooksWithUrls = webhooks.map(webhook => ({
            ...webhook,
            webhookUrl: `${baseUrl}/api/automations/webhooks/${webhook.webhookKey}`
        }))

        return NextResponse.json({ webhooks: webhooksWithUrls })

    } catch (error) {
        console.error('Error fetching webhooks:', error)
        return NextResponse.json(
            { error: 'Failed to fetch webhooks' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { clerkId }
        })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await request.json()

        if (!body.name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        // Generate unique webhook key
        const webhookKey = crypto.randomBytes(16).toString('hex')

        // Generate secret for signature verification
        const secret = body.generateSecret !== false
            ? crypto.randomBytes(32).toString('hex')
            : null

        const webhook = await db.automationWebhook.create({
            data: {
                userId: user.id,
                webhookKey,
                name: body.name.trim(),
                description: body.description,
                platform: body.platform || 'GENERIC',
                automationId: body.automationId,
                secret,
                allowedIps: body.allowedIps || [],
                isActive: true
            }
        })

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        return NextResponse.json({
            webhook: {
                ...webhook,
                webhookUrl: `${baseUrl}/api/automations/webhooks/${webhook.webhookKey}`
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Error creating webhook:', error)
        return NextResponse.json(
            { error: 'Failed to create webhook' },
            { status: 500 }
        )
    }
}
