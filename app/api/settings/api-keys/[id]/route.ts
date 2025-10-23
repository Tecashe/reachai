import { type NextRequest, NextResponse } from "next/server"
import { protectApiRoute } from "@/lib/api-protection"
import { db } from "@/lib/db"
import { logger } from "@/lib/logger"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    await db.apiKey.delete({
      where: {
        id: params.id,
        userId: user!.id,
      },
    })

    logger.info("API key deleted", { userId: user!.id, keyId: params.id })

    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error("Failed to delete API key", err as Error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = await protectApiRoute()
  if (error) return error

  try {
    const { name, scopes } = await request.json()

    const updateData: any = {}
    if (name) updateData.name = name
    if (scopes && Array.isArray(scopes)) updateData.scopes = scopes

    const apiKey = await db.apiKey.update({
      where: {
        id: params.id,
        userId: user!.id,
      },
      data: updateData,
    })

    logger.info("API key updated", { userId: user!.id, keyId: params.id })

    return NextResponse.json({
      id: apiKey.id,
      name: apiKey.name,
      scopes: apiKey.scopes,
    })
  } catch (err) {
    logger.error("Failed to update API key", err as Error)
    return NextResponse.json({ error: "Failed to update API key" }, { status: 500 })
  }
}
