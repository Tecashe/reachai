/**
 * Automation Logs
 * GET /api/automations/[id]/logs - Get automation execution logs
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

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
        const { searchParams } = new URL(request.url)
        const level = searchParams.get('level')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '50')

        // Check ownership
        const existing = await db.automation.findFirst({
            where: { id, userId: user.id }
        })
        if (!existing) {
            return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
        }

        // Build where clause
        const where: any = { automationId: id }
        if (level) {
            where.level = level
        }

        const [logs, total] = await Promise.all([
            db.automationLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            }),
            db.automationLog.count({ where })
        ])

        return NextResponse.json({
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Error fetching automation logs:', error)
        return NextResponse.json(
            { error: 'Failed to fetch logs' },
            { status: 500 }
        )
    }
}
