import { NextResponse } from "next/server"
import { getCurrentUserFromDb } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUserFromDb()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      clerkId: user.clerkId,email: user.email,
  subscriptionTier: user.subscriptionTier,
})
 } catch (error) {
console.error("[API] Error fetching user:", error)
return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}
}