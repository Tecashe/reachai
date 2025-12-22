import { NextResponse } from "next/server"
import { withApiAuth } from "@/lib/middleware/api-wrapper"
import { db } from "@/lib/db"
import { nanoid } from "nanoid"
import crypto from "crypto"

export const POST = withApiAuth("api-keys:write")(async (request, context) => {
  const id = request.url.split("/").slice(-3)[0]

  try {
    const existingKey = await db.apiKey.findUnique({
      where: { id, userId: context.user.id },
    })

    if (!existingKey) {
      return NextResponse.json({ success: false, error: "API key not found" }, { status: 404 })
    }

    const keyPrefix = `sk_${context.user.subscriptionTier === "FREE" ? "test" : "live"}_${nanoid(8)}`
    const keySecret = nanoid(32)
    const fullKey = `${keyPrefix}_${keySecret}`

    const hashedKey = crypto.createHash("sha256").update(fullKey).digest("hex")

    const rotatedKey = await db.apiKey.update({
      where: { id },
      data: {
        key: hashedKey,
        keyPrefix,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: rotatedKey.id,
        name: rotatedKey.name,
        key: fullKey,
        keyPrefix: rotatedKey.keyPrefix,
        scopes: rotatedKey.scopes,
      },
      message: "API key rotated successfully. Save the new key - it will not be shown again.",
    })
  } catch (error: any) {
    console.error("[v0] Error rotating API key:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to rotate API key",
      },
      { status: 500 },
    )
  }
})
