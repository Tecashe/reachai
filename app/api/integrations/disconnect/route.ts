// import { NextRequest, NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
// import { disconnectIntegration } from '@/lib/integrations/oauth-service'
// import { OAUTH_PROVIDERS, type OAuthProviderKey } from '@/lib/integrations/oauth-config'

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const body = await request.json()
//     const { provider } = body

//     // Validate provider
//     if (!provider || !OAUTH_PROVIDERS[provider as OAuthProviderKey]) {
//       return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
//     }

//     // Disconnect integration
//     await disconnectIntegration(userId, provider as OAuthProviderKey)

//     return NextResponse.json({
//       success: true,
//       message: `${provider} disconnected successfully`,
//     })
//   } catch (error) {
//     console.error('Disconnect error:', error)
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Unknown error' },
//       { status: 500 },
//     )
//   }
// }
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { disconnectIntegration } from '@/lib/integrations/oauth-service'
import { OAUTH_PROVIDERS, type OAuthProviderKey } from '@/lib/integrations/oauth-config'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { provider } = body

    // Validate provider
    if (!provider || !OAUTH_PROVIDERS[provider as OAuthProviderKey]) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 })
    }

    // Disconnect integration
    await disconnectIntegration(userId, provider as OAuthProviderKey)

    return NextResponse.json({
      success: true,
      message: `${provider} disconnected successfully`,
    })
  } catch (error) {
    console.error('[OAuth] Disconnect error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}