import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUserFromDb()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const format = searchParams.get("format") || "csv"

    const sessions = await prisma.warmupSession.findMany({
      where: {
        sendingAccount: {
          userId: user.id,
        },
      },
      include: {
        sendingAccount: {
          select: {
            email: true,
            name: true,
            provider: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    })

    if (format === "csv") {
      const headers = [
        "Account Email",
        "Account Name",
        "Provider",
        "Status",
        "Emails Sent",
        "Emails Opened",
        "Emails Replied",
        "Inbox Rate (%)",
        "Open Rate (%)",
        "Reply Rate (%)",
        "Started At",
      ]

      const rows = sessions.map((session) => [
        session.sendingAccount.email,
        session.sendingAccount.name || "",
        session.sendingAccount.provider,
        session.status,
        session.emailsSent.toString(),
        session.emailsOpened.toString(),
        session.emailsReplied.toString(),
        session.inboxPlacementRate.toFixed(2),
        ((session.emailsOpened / Math.max(session.emailsSent, 1)) * 100).toFixed(2),
        ((session.emailsReplied / Math.max(session.emailsSent, 1)) * 100).toFixed(2),
        session.startedAt.toISOString(),
      ])

      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="warmup-report-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("[v0] Error exporting warmup data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
