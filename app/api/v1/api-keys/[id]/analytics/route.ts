import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"

export const GET = withApiAuth("api-keys:read")(async (request, context) => {
  const id = request.url.split("/").slice(-2)[0]

  try {
    const apiKey = await db.apiKey.findUnique({
      where: { id, userId: context.user.id },
    })

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API key not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const [totalRequests, requestsByEndpoint, requestsByStatus, requestsByDay, avgResponseTime] = await Promise.all([
      db.apiRequestLog.count({
        where: { apiKeyId: id, createdAt: { gte: startDate } },
      }),

      db.apiRequestLog.groupBy({
        by: ["endpoint"],
        where: { apiKeyId: id, createdAt: { gte: startDate } },
        _count: true,
        orderBy: { _count: { endpoint: "desc" } },
        take: 10,
      }),

      db.apiRequestLog.groupBy({
        by: ["statusCode"],
        where: { apiKeyId: id, createdAt: { gte: startDate } },
        _count: true,
      }),

      db.$queryRaw`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as requests,
          AVG(response_time) as avg_response_time
        FROM "ApiRequestLog"
        WHERE api_key_id = ${id}
        AND created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,

      db.apiRequestLog.aggregate({
        where: { apiKeyId: id, createdAt: { gte: startDate } },
        _avg: { responseTime: true },
      }),
    ])

    const successRate =
      totalRequests > 0
        ? ((requestsByStatus.find((s: any) => s.statusCode >= 200 && s.statusCode < 300)?._count || 0) /
            totalRequests) *
          100
        : 0

    return NextResponse.json({
      success: true,
      data: {
        totalRequests,
        successRate: successRate.toFixed(2),
        avgResponseTime: avgResponseTime._avg.responseTime || 0,
        requestsByEndpoint: requestsByEndpoint.map((r: any) => ({
          endpoint: r.endpoint,
          count: r._count,
        })),
        requestsByStatus: requestsByStatus.map((r: any) => ({
          statusCode: r.statusCode,
          count: r._count,
        })),
        requestsByDay,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error fetching API key analytics:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch analytics",
      },
      { status: 500 },
    )
  }
})
