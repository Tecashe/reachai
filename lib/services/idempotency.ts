import { db } from "@/lib/db"

const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function checkIdempotency(apiKeyId: string, key: string) {
  try {
    const cached = await db.$queryRaw<any[]>`
      SELECT response, status 
      FROM "IdempotencyCache" 
      WHERE "apiKeyId" = ${apiKeyId} 
      AND "key" = ${key} 
      AND "expiresAt" > NOW()
      LIMIT 1
    `

    return cached[0] || null
  } catch (error) {
    console.error("[IDEMPOTENCY] Check failed:", error)
    return null
  }
}

export async function storeIdempotency(apiKeyId: string, key: string, response: any, status: number) {
  try {
    const expiresAt = new Date(Date.now() + IDEMPOTENCY_TTL)

    await db.$executeRaw`
      INSERT INTO "IdempotencyCache" ("id", "apiKeyId", "key", "response", "status", "expiresAt", "createdAt")
      VALUES (
        gen_random_uuid()::text,
        ${apiKeyId},
        ${key},
        ${JSON.stringify(response)}::jsonb,
        ${status},
        ${expiresAt},
        NOW()
      )
      ON CONFLICT ("apiKeyId", "key") DO UPDATE SET
        "response" = ${JSON.stringify(response)}::jsonb,
        "status" = ${status},
        "expiresAt" = ${expiresAt}
    `
  } catch (error) {
    console.error("[IDEMPOTENCY] Store failed:", error)
  }
}
