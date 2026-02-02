/**
 * Single Automation API
 * GET /api/automations/[id] - Get automation details
 * PATCH /api/automations/[id] - Update automation
 * DELETE /api/automations/[id] - Delete automation
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import type { UpdateAutomationRequest } from '@/lib/types/automation-types'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        const automation = await db.automation.findFirst({
            where: { id, userId: user.id },
            include: {
                executions: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                _count: {
                    select: {
                        executions: true,
                        logs: true
                    }
                }
            }
        })

        if (!automation) {
            return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
        }

        return NextResponse.json({ automation })

    } catch (error) {
        console.error('Error fetching automation:', error)
        return NextResponse.json(
            { error: 'Failed to fetch automation' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params
        const body: UpdateAutomationRequest = await request.json()

        // Check ownership
        const existing = await db.automation.findFirst({
            where: { id, userId: user.id }
        })
        if (!existing) {
            return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
        }

        // Build update data
        const updateData: any = {}
        if (body.name !== undefined) updateData.name = body.name.trim()
        if (body.description !== undefined) updateData.description = body.description
        if (body.triggerType !== undefined) updateData.triggerType = body.triggerType
        if (body.triggerConfig !== undefined) updateData.triggerConfig = body.triggerConfig
        if (body.conditions !== undefined) updateData.conditions = body.conditions
        if (body.actions !== undefined) updateData.actions = body.actions
        if (body.runOnce !== undefined) updateData.runOnce = body.runOnce
        if (body.cooldownMin !== undefined) updateData.cooldownMin = body.cooldownMin
        if (body.maxRuns !== undefined) updateData.maxRuns = body.maxRuns
        if (body.runsPerHour !== undefined) updateData.runsPerHour = body.runsPerHour
        if (body.runsPerDay !== undefined) updateData.runsPerDay = body.runsPerDay
        if (body.tags !== undefined) updateData.tags = body.tags
        if (body.status !== undefined) updateData.status = body.status

        const automation = await db.automation.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json({ automation })

    } catch (error) {
        console.error('Error updating automation:', error)
        return NextResponse.json(
            { error: 'Failed to update automation' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params

        // Check ownership
        const existing = await db.automation.findFirst({
            where: { id, userId: user.id }
        })
        if (!existing) {
            return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
        }

        await db.automation.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error deleting automation:', error)
        return NextResponse.json(
            { error: 'Failed to delete automation' },
            { status: 500 }
        )
    }
}
