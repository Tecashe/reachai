// import { NextRequest, NextResponse } from 'next/server'
// import { OAUTH_PROVIDERS, type OAuthProviderKey } from '@/lib/integrations/oauth-config'
// import crypto from 'crypto'

// export async function POST(request: NextRequest) {
//   try {
//     const { provider } = await request.json()

//     if (!provider || !OAUTH_PROVIDERS[provider as OAuthProviderKey]) {
//       return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
//     }

//     const providerKey = provider as OAuthProviderKey
//     const config = OAUTH_PROVIDERS[providerKey]

//     if (!config.clientId) {
//       return NextResponse.json(
//         { error: `${config.name} integration not configured. Please set environment variables.` },
//         { status: 500 }
//       )
//     }

//     // Generate state for CSRF protection
//     const state = crypto.randomBytes(32).toString('hex')

//     // Store state in a session cookie (client will need to verify on callback)
//     const response = NextResponse.json(
//       { authUrl: generateAuthUrl(providerKey, config, state) },
//       { status: 200 }
//     )

//     // Set secure cookie with state
//     response.cookies.set({
//       name: `oauth_state_${providerKey}`,
//       value: state,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 600, // 10 minutes
//     })

//     return response
//   } catch (error) {
//     console.error('[v0] OAuth connect error:', error)
//     return NextResponse.json(
//       { error: 'Failed to initiate OAuth flow' },
//       { status: 500 }
//     )
//   }
// }
// //
// function generateAuthUrl(
//   provider: OAuthProviderKey,
//   config: typeof OAUTH_PROVIDERS[OAuthProviderKey],
//   state: string
// ): string {
//   const params = new URLSearchParams({
//     client_id: config.clientId,
//     redirect_uri: config.redirectUri,
//     response_type: 'code',
//     scope: Array.isArray(config.scope) ? config.scope.join(' ') : config.scope,
//     state,
//   })

//   // Add provider-specific parameters
//   if (provider === 'AIRTABLE') {
//     params.set('code_challenge_method', 'plain')
//   }

//   if (provider === 'GOOGLE_SHEETS' || provider === 'GOOGLE_DOCS') {
//     params.set('access_type', 'offline')
//     params.set('prompt', 'consent')
//   }

//   return `${config.authorizationUrl}?${params.toString()}`
// }
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { OAUTH_PROVIDERS, type OAuthProviderKey } from '@/lib/integrations/oauth-config'
import { generateAuthorizationUrl } from '@/lib/integrations/oauth-service'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { provider } = await request.json()

    if (!provider || !OAUTH_PROVIDERS[provider as OAuthProviderKey]) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    const providerKey = provider as OAuthProviderKey
    const config = OAUTH_PROVIDERS[providerKey]

    if (!config.clientId) {
      return NextResponse.json(
        { error: `${config.name} integration not configured. Please set environment variables.` },
        { status: 500 }
      )
    }

    // Generate OAuth authorization URL with state stored in Redis
    const authUrl = await generateAuthorizationUrl(providerKey, userId)

    return NextResponse.json({ authUrl }, { status: 200 })
  } catch (error) {
    console.error('[OAuth] Connect error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}