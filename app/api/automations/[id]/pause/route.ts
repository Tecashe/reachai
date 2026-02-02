/**
 * Automation Pause
 * POST /api/automations/[id]/pause - Pause automation
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(
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

        const automation = await db.automation.update({
            where: { id },
            data: { status: 'PAUSED' }
        })

        // Log pause
        await db.automationLog.create({
            data: {
                automationId: id,
                level: 'INFO',
                message: 'Automation paused',
                details: { pausedBy: user.id }
            }
        })

        return NextResponse.json({ automation })

    } catch (error) {
        console.error('Error pausing automation:', error)
        return NextResponse.json(
            { error: 'Failed to pause automation' },
            { status: 500 }
        )
    }
}
