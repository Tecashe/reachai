import { db } from '@/lib/db'
import { OAUTH_PROVIDERS, type OAuthProviderKey } from './oauth-config'
import { encrypt, decrypt } from '@/lib/encryption'
import { Redis } from '@upstash/redis'
import crypto from 'crypto'
import type { IntegrationType } from '@prisma/client'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface OAuthTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
  scope?: string
}

const STATE_EXPIRY = 600 // 10 minutes in seconds

/**
 * Generate OAuth authorization URL with secure state management
 */
export async function generateAuthorizationUrl(
  provider: OAuthProviderKey,
  userId: string,
): Promise<string> {
  const config = OAUTH_PROVIDERS[provider]
  const state = crypto.randomBytes(32).toString('hex')

  // Store state in Redis with user association
  const stateKey = `oauth:state:${provider}:${state}`
  await redis.setex(stateKey, STATE_EXPIRY, userId)

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: typeof config.scope === 'string' ? config.scope : config.scope.join(' '),
    state,
  })

  // Add provider-specific parameters
  if (provider === 'GOOGLE_SHEETS' || provider === 'GOOGLE_DOCS' || provider === 'GMAIL') {
    params.set('access_type', 'offline')
    params.set('prompt', 'consent')
  }

  if (provider === 'AIRTABLE') {
    params.set('code_challenge_method', 'S256')
    const codeVerifier = crypto.randomBytes(32).toString('base64url')
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url')
    params.set('code_challenge', codeChallenge)
    await redis.setex(`oauth:verifier:${provider}:${state}`, STATE_EXPIRY, codeVerifier)
  }

  return `${config.authorizationUrl}?${params.toString()}`
}

/**
 * Verify OAuth state and get associated user ID
 */
export async function verifyOAuthState(
  provider: OAuthProviderKey,
  state: string,
): Promise<string | null> {
  const stateKey = `oauth:state:${provider}:${state}`
  const userId = await redis.get<string>(stateKey)

  if (userId) {
    await redis.del(stateKey)
  }

  return userId
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForToken(
  provider: OAuthProviderKey,
  code: string,
  state?: string,
): Promise<OAuthTokenResponse> {
  const config = OAUTH_PROVIDERS[provider]

  if (state) {
    const userId = await verifyOAuthState(provider, state)
    if (!userId) {
      throw new Error('Invalid or expired state parameter')
    }
  }

  const body: Record<string, string> = {
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
  }

  if (provider === 'AIRTABLE' && state) {
    const verifierKey = `oauth:verifier:${provider}:${state}`
    const codeVerifier = await redis.get<string>(verifierKey)
    if (codeVerifier) {
      body.code_verifier = codeVerifier
      await redis.del(verifierKey)
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  if (provider === 'NOTION') {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')
    headers['Authorization'] = `Basic ${credentials}`
    delete body.client_id
    delete body.client_secret
  }

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers,
    body: new URLSearchParams(body).toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`[OAuth] Token exchange failed for ${provider}:`, error)
    throw new Error(`OAuth token exchange failed: ${error}`)
  }

  const tokenData: OAuthTokenResponse = await response.json()
  return tokenData
}

/**
 * Store OAuth token in database with encryption
 */
export async function storeOAuthToken(
  userId: string,
  provider: OAuthProviderKey,
  tokenData: OAuthTokenResponse,
  accountInfo?: { name?: string; email?: string },
): Promise<void> {
  try {
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null

    // Encrypt sensitive tokens
    const encryptedAccessToken = encrypt(tokenData.access_token)
    const encryptedRefreshToken = tokenData.refresh_token
      ? encrypt(tokenData.refresh_token)
      : null

    // First, upsert the Integration
    const integration = await db.integration.upsert({
      where: {
        userId_type: {
          userId,
          type: provider as IntegrationType,
        },
      },
      update: {
        isActive: true,
        provider: provider,
        accountEmail: accountInfo?.email ?? null,
        accountName: accountInfo?.name ?? null,
        lastSyncedAt: new Date(),
        lastError: null,
        name: OAUTH_PROVIDERS[provider].name,
        credentials: {},
      },
      create: {
        userId,
        type: provider as IntegrationType,
        provider: provider,
        isActive: true,
        accountEmail: accountInfo?.email ?? null,
        accountName: accountInfo?.name ?? null,
        name: OAUTH_PROVIDERS[provider].name,
        credentials: {},
      },
    })

    // Then, upsert the OAuth token with the integration ID
    await db.oAuthToken.upsert({
      where: {
        integrationId: integration.id,
      },
      update: {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt,
        scope: tokenData.scope ?? null,
        tokenType: tokenData.token_type ?? null,
        provider: provider,
        updatedAt: new Date(),
      },
      create: {
        integrationId: integration.id,
        provider: provider,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt,
        scope: tokenData.scope ?? null,
        tokenType: tokenData.token_type ?? null,
        userId: userId,
      },
    })

    console.log(`[OAuth] Successfully stored token for ${provider}`)
  } catch (error) {
    console.error(`[OAuth] Failed to store token for ${provider}:`, error)
    throw error
  }
}

/**
 * Get decrypted OAuth token for a user
 */
export async function getOAuthToken(
  userId: string,
  provider: OAuthProviderKey,
): Promise<{ accessToken: string; refreshToken?: string; expiresAt?: Date } | null> {
  try {
    const integration = await db.integration.findUnique({
      where: {
        userId_type: {
          userId,
          type: provider as IntegrationType,
        },
      },
      include: {
        oauthToken: true,
      },
    })

    if (!integration?.oauthToken) {
      return null
    }

    const token = integration.oauthToken

    // Decrypt tokens
    const accessToken = decrypt(token.accessToken)
    const refreshToken = token.refreshToken ? decrypt(token.refreshToken) : undefined

    return {
      accessToken,
      refreshToken,
      expiresAt: token.expiresAt ?? undefined,
    }
  } catch (error) {
    console.error(`[OAuth] Failed to get token for ${provider}:`, error)
    return null
  }
}

/**
 * Refresh OAuth token
 */
export async function refreshOAuthToken(
  userId: string,
  provider: OAuthProviderKey,
): Promise<OAuthTokenResponse> {
  const config = OAUTH_PROVIDERS[provider]

  const currentToken = await getOAuthToken(userId, provider)
  if (!currentToken?.refreshToken) {
    throw new Error('No refresh token available')
  }

  const body: Record<string, string> = {
    refresh_token: currentToken.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  if (provider === 'NOTION') {
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')
    headers['Authorization'] = `Basic ${credentials}`
    delete body.client_id
    delete body.client_secret
  }

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers,
    body: new URLSearchParams(body).toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`[OAuth] Token refresh failed for ${provider}:`, error)
    throw new Error(`Token refresh failed: ${error}`)
  }

  const tokenData: OAuthTokenResponse = await response.json()

  await storeOAuthToken(userId, provider, tokenData)

  return tokenData
}

/**
 * Disconnect integration and revoke tokens
 */
export async function disconnectIntegration(
  userId: string,
  provider: OAuthProviderKey,
): Promise<void> {
  try {
    await db.integration.update({
      where: {
        userId_type: {
          userId,
          type: provider as IntegrationType,
        },
      },
      data: {
        isActive: false,
        disconnectReason: 'User requested disconnect',
      },
    })

    console.log(`[OAuth] Disconnected ${provider} for user ${userId}`)
  } catch (error) {
    console.error(`[OAuth] Failed to disconnect ${provider}:`, error)
    throw error
  }
}

/**
 * Get user integrations
 */
export async function getUserIntegrations(userId: string) {
  return db.integration.findMany({
    where: { userId },
    include: {
      oauthToken: true,
    },
  })
}

/**
 * Check if user has integration connected
 */
export async function isIntegrationConnected(
  userId: string,
  provider: OAuthProviderKey,
): Promise<boolean> {
  const integration = await db.integration.findUnique({
    where: {
      userId_type: {
        userId,
        type: provider as IntegrationType,
      },
    },
  })

  return integration?.isActive === true
}

/**
 * Get all active integrations for a user
 */
export async function getActiveIntegrations(userId: string) {
  return db.integration.findMany({
    where: {
      userId,
      isActive: true,
    },
    include: {
      oauthToken: true,
    },
  })
}

/**
 * Update integration error status
 */
export async function updateIntegrationError(
  userId: string,
  provider: OAuthProviderKey,
  error: string | null,
): Promise<void> {
  await db.integration.update({
    where: {
      userId_type: {
        userId,
        type: provider as IntegrationType,
      },
    },
    data: {
      lastError: error,
    },
  })
}