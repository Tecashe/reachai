import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { clerkId: userId },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const { id } = await params

        const sequence = await db.sequence.findFirst({
            where: {
                id,
                userId: user.id,
            },
            include: {
                steps: {
                    orderBy: { order: "asc" },
                },
                _count: {
                    select: {
                        enrollments: true,
                    },
                },
            },
        })

        if (!sequence) {
            return NextResponse.json({ error: "Sequence not found" }, { status: 404 })
        }

        // Count email steps specifically
        const emailStepsCount = sequence.steps.filter(
            (step) => step.stepType === "EMAIL"
        ).length

        return NextResponse.json({
            success: true,
            sequence: {
                ...sequence,
                totalEnrolled: sequence._count.enrollments,
                totalSteps: sequence.steps.length,
                emailStepsCount,
            },
        })
    } catch (error) {
        console.error("[Sequences] Fetch sequence by ID error:", error)
        return NextResponse.json(
            { error: "Failed to fetch sequence" },
            { status: 500 }
        )
    }
}
