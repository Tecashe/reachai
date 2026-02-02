/**
 * Automations API - List and Create
 * GET /api/automations - List user's automations
 * POST /api/automations - Create new automation
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import type { CreateAutomationRequest } from '@/lib/types/automation-types'

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

        // Parse query params
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')?.split(',')
        const triggerType = searchParams.get('triggerType')?.split(',')
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        // Build where clause
        const where: any = { userId: user.id }
        if (status?.length) {
            where.status = { in: status }
        }
        if (triggerType?.length) {
            where.triggerType = { in: triggerType }
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Get automations with counts
        const [automations, total] = await Promise.all([
            db.automation.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    _count: {
                        select: {
                            executions: true,
                            logs: true
                        }
                    }
                }
            }),
            db.automation.count({ where })
        ])

        return NextResponse.json({
            automations,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Error fetching automations:', error)
        return NextResponse.json(
            { error: 'Failed to fetch automations' },
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

        const body: CreateAutomationRequest = await request.json()

        // Validate required fields
        if (!body.name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }
        if (!body.triggerType) {
            return NextResponse.json({ error: 'Trigger type is required' }, { status: 400 })
        }
        if (!body.actions?.length) {
            return NextResponse.json({ error: 'At least one action is required' }, { status: 400 })
        }

        // Create automation
        const automation = await db.automation.create({
            data: {
                userId: user.id,
                name: body.name.trim(),
                description: body.description,
                triggerType: body.triggerType,
                triggerConfig: body.triggerConfig || {},
                conditions: body.conditions || [],
                actions: body.actions,
                runOnce: body.runOnce ?? false,
                cooldownMin: body.cooldownMin,
                maxRuns: body.maxRuns,
                runsPerHour: body.runsPerHour ?? 100,
                runsPerDay: body.runsPerDay ?? 1000,
                tags: body.tags || [],
                status: 'DRAFT'
            }
        })

        return NextResponse.json({ automation }, { status: 201 })

    } catch (error) {
        console.error('Error creating automation:', error)
        return NextResponse.json(
            { error: 'Failed to create automation' },
            { status: 500 }
        )
    }
}
