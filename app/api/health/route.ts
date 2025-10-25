import { NextResponse } from "next/server"
import { monitoring } from "@/lib/monitoring"

export async function GET() {
  const health = await monitoring.healthCheck()

  const statusCode = health.status === "healthy" ? 200 : health.status === "degraded" ? 207 : 503

  return NextResponse.json(
    {
      status: health.status,
      timestamp: new Date().toISOString(),
      checks: health.checks,
    },
    { status: statusCode },
  )
}
