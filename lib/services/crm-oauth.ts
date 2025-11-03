import { env } from "@/lib/env"
import crypto from "crypto"

const REDIRECT_BASE = process.env.NEXT_PUBLIC_APP_URL

export const CRM_OAUTH_FLOWS = {
  hubspot: {
    authUrl: "https://app.hubspot.com/oauth",
    tokenUrl: "https://api.hubapi.com/oauth/v1/token",
    apiUrl: "https://api.hubapi.com",
    clientId: env.HUBSPOT_CLIENT_ID,
    clientSecret: env.HUBSPOT_CLIENT_SECRET,
    redirectUri: `${REDIRECT_BASE}/api/integrations/crm/callback?provider=hubspot`,
    scopes: ["crm.objects.contacts.read", "crm.objects.deals.read", "crm.objects.companies.read"],
  },
  salesforce: {
    authUrl: env.SALESFORCE_LOGIN_URL + "/services/oauth2/authorize",
    tokenUrl: env.SALESFORCE_LOGIN_URL + "/services/oauth2/token",
    apiUrl: "https://api.salesforce.com",
    clientId: env.SALESFORCE_CLIENT_ID,
    clientSecret: env.SALESFORCE_CLIENT_SECRET,
    redirectUri: `${REDIRECT_BASE}/api/integrations/crm/callback?provider=salesforce`,
    scopes: ["id", "api", "refresh_token", "offline_access"],
  },
  pipedrive: {
    authUrl: "https://oauth.pipedrive.com/oauth/authorize",
    tokenUrl: "https://oauth.pipedrive.com/oauth/token",
    apiUrl: "https://api.pipedrive.com/v1",
    clientId: env.PIPEDRIVE_CLIENT_ID,
    clientSecret: env.PIPEDRIVE_CLIENT_SECRET,
    redirectUri: `${REDIRECT_BASE}/api/integrations/crm/callback?provider=pipedrive`,
    scopes: ["deals:read", "persons:read", "companies:read", "activities:read"],
  },
}

export function generateOAuthUrl(provider: "hubspot" | "salesforce" | "pipedrive", userId: string): string {
  const config = CRM_OAUTH_FLOWS[provider]

  if (!config.clientId || !config.clientSecret) {
    throw new Error(`CRM OAuth not configured for ${provider}`)
  }

  // Generate and store state for CSRF protection
  const state = encryptState({ userId, provider, timestamp: Date.now() })

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    state,
  })

  if (provider === "hubspot") {
    params.append("scope", config.scopes.join(" "))
  } else if (provider === "salesforce") {
    params.append("scope", config.scopes.join(" "))
  } else if (provider === "pipedrive") {
    params.append("scope", config.scopes.join(" "))
  }

  return `${config.authUrl}?${params.toString()}`
}

export function encryptState(data: Record<string, any>): string {
  if (!env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY not configured")
  }

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(env.ENCRYPTION_KEY, "hex"), iv)

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex")
  encrypted += cipher.final("hex")

  return `${iv.toString("hex")}:${encrypted}`
}

export function decryptState(encryptedState: string): Record<string, any> {
  if (!env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY not configured")
  }

  const [ivHex, encrypted] = encryptedState.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(env.ENCRYPTION_KEY, "hex"), iv)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return JSON.parse(decrypted)
}

export async function exchangeCodeForToken(
  provider: "hubspot" | "salesforce" | "pipedrive",
  code: string,
): Promise<{ accessToken: string; refreshToken?: string; expiresIn: number }> {
  const config = CRM_OAUTH_FLOWS[provider]

  const response = await fetch(config.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: config.clientId!,
      client_secret: config.clientSecret!,
      redirect_uri: config.redirectUri,
    }).toString(),
  })

  if (!response.ok) {
    throw new Error(`Failed to exchange code for token: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in || 3600,
  }
}
