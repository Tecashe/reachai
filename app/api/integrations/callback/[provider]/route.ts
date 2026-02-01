import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { exchangeCodeForToken, storeOAuthToken, verifyOAuthState } from '@/lib/integrations/oauth-service'
import { OAUTH_PROVIDERS, type OAuthProviderKey } from '@/lib/integrations/oauth-config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider: providerParam } = await params
  const provider = providerParam.toUpperCase().replace(/-/g, '_') as OAuthProviderKey

  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  try {
    // Get authenticated user
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Handle OAuth errors
    if (error) {
      console.error(`[OAuth] Error from ${provider}:`, error, errorDescription)
      return NextResponse.redirect(
        new URL(
          `/dashboard/integrations?error=${encodeURIComponent(
            errorDescription || error,
          )}&provider=${provider}`,
          request.url,
        ),
      )
    }

    // Validate authorization code
    if (!code) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/integrations?error=missing_code&provider=${provider}`,
          request.url,
        ),
      )
    }

    // Validate provider
    if (!OAUTH_PROVIDERS[provider]) {
      return NextResponse.redirect(
        new URL(
          `/dashboard/integrations?error=invalid_provider&provider=${provider}`,
          request.url,
        ),
      )
    }

    // Verify state matches the user
    if (state) {
      const stateUserId = await verifyOAuthState(provider, state)
      if (stateUserId !== userId) {
        return NextResponse.redirect(
          new URL(
            `/dashboard/integrations?error=invalid_state&provider=${provider}`,
            request.url,
          ),
        )
      }
    }

    // Exchange code for token
    const tokenData = await exchangeCodeForToken(provider, code, state ?? undefined)

    // Fetch user account info from provider
    let accountInfo: { name?: string; email?: string } | undefined
    try {
      accountInfo = await fetchProviderAccountInfo(provider, tokenData.access_token)
    } catch (e) {
      console.error(`[OAuth] Failed to fetch account info from ${provider}:`, e)
      // Continue without account info
    }

    // Store token in database
    await storeOAuthToken(userId, provider, tokenData, accountInfo)

    // Redirect to success page
    return NextResponse.redirect(
      new URL(
        `/dashboard/integrations?success=true&provider=${provider}`,
        request.url,
      ),
    )
  } catch (error) {
    console.error(`[OAuth] Callback error for ${provider}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.redirect(
      new URL(
        `/dashboard/integrations?error=${encodeURIComponent(
          errorMessage,
        )}&provider=${provider}`,
        request.url,
      ),
    )
  }
}

/**
 * Fetch account information from OAuth provider
 */
async function fetchProviderAccountInfo(
  provider: OAuthProviderKey,
  accessToken: string,
): Promise<{ name?: string; email?: string }> {
  switch (provider) {
    case 'HUBSPOT':
      return fetchHubSpotAccountInfo(accessToken)
    case 'SALESFORCE':
      return fetchSalesforceAccountInfo(accessToken)
    case 'NOTION':
      return fetchNotionAccountInfo(accessToken)
    case 'ASANA':
      return fetchAsanaAccountInfo(accessToken)
    case 'PIPEDRIVE':
      return fetchPipedriveAccountInfo(accessToken)
    case 'ZENDESK':
      return fetchZendeskAccountInfo(accessToken)
    case 'INTERCOM':
      return fetchIntercomAccountInfo(accessToken)
    case 'AIRTABLE':
      return fetchAirtableAccountInfo(accessToken)
    case 'SLACK':
      return fetchSlackAccountInfo(accessToken)
    case 'APOLLO':
      return fetchApolloAccountInfo(accessToken)
    case 'LEMLIST':
      return fetchLemlistAccountInfo(accessToken)
    case 'HIGHLEVEL':
      return fetchHighLevelAccountInfo(accessToken)
    case 'MAILCHIMP':
      return fetchMailchimpAccountInfo(accessToken)
    case 'GOOGLE_SHEETS':
    case 'GOOGLE_DOCS':
      return fetchGoogleAccountInfo(accessToken)
    case 'TRELLO':
      return fetchTrelloAccountInfo(accessToken)
    case 'CLICKUP':
      return fetchClickUpAccountInfo(accessToken)
    case 'CODA':
      return fetchCodaAccountInfo(accessToken)
    default:
      return { name: OAUTH_PROVIDERS[provider].name, email: '' }
  }
}

async function fetchHubSpotAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + accessToken)
    const data = await res.json()
    return { email: data.user || '', name: data.hub_domain || '' }
  } catch {
    return {}
  }
}

async function fetchSalesforceAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://login.salesforce.com/services/oauth2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return { name: data.name, email: data.email }
  } catch {
    return {}
  }
}

async function fetchNotionAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Notion-Version': '2022-06-28',
      },
    })
    const data = await res.json()
    return {
      name: data.name || '',
      email: data.person?.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchAsanaAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://app.asana.com/api/1.0/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      name: data.data?.name || '',
      email: data.data?.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchPipedriveAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://api.pipedrive.com/v1/users/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      name: data.success ? data.data?.name : '',
      email: data.success ? data.data?.email : '',
    }
  } catch {
    return {}
  }
}

async function fetchZendeskAccountInfo(accessToken: string) {
  try {
    const subdomain = process.env.ZENDESK_SUBDOMAIN || 'yoursubdomain'
    const res = await fetch(`https://${subdomain}.zendesk.com/api/v2/users/me.json`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      name: data.user?.name || '',
      email: data.user?.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchIntercomAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://api.intercom.io/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      name: data.name || '',
      email: data.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchAirtableAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://api.airtable.com/v0/meta/whoami', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      email: data.email || '',
      name: data.id || '',
    }
  } catch {
    return {}
  }
}

async function fetchSlackAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://slack.com/api/users.identity', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      name: data.user?.name || '',
      email: data.user?.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchMailchimpAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://login.mailchimp.com/oauth2/metadata', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      name: data.accountname || '',
      email: data.login?.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchGoogleAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      name: data.name || '',
      email: data.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchTrelloAccountInfo(accessToken: string) {
  try {
    const res = await fetch(`https://api.trello.com/1/members/me?key=${process.env.TRELLO_CLIENT_ID}&token=${accessToken}`)
    const data = await res.json()
    return {
      name: data.fullName || '',
      email: data.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchClickUpAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://api.clickup.com/api/v2/user', {
      headers: { Authorization: accessToken },
    })
    const data = await res.json()
    return {
      name: data.user?.username || '',
      email: data.user?.email || '',
    }
  } catch {
    return {}
  }
}

async function fetchCodaAccountInfo(accessToken: string) {
  try {
    const res = await fetch('https://coda.io/apis/v1/whoami', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await res.json()
    return {
      name: data.name || '',
      email: data.loginId || '',
    }
  } catch {
    return {}
  }
}

async function fetchApolloAccountInfo(accessToken: string) {
  return { name: 'Apollo Account' }
}

async function fetchLemlistAccountInfo(accessToken: string) {
  return { name: 'Lemlist Account' }
}

async function fetchHighLevelAccountInfo(accessToken: string) {
  return { name: 'GoHighLevel Account' }
}