import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"

export const GET = withApiAuth()(async (request, context) => {
  const isSandbox = context.user.subscriptionTier === "FREE" || context.apiKey.keyPrefix.includes("test")

  return NextResponse.json({
    success: true,
    data: {
      sandbox: isSandbox,
      tier: context.user.subscriptionTier,
      limits: {
        campaigns: isSandbox ? 3 : 100,
        prospects: isSandbox ? 100 : 50000,
        emailsPerDay: isSandbox ? 20 : 1000,
      },
    },
  })
})
