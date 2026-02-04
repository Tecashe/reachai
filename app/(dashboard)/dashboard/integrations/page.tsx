
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Check } from "lucide-react"
// import { getUserIntegrations } from "@/lib/actions/integrations"
// import { IntegrationCard } from "@/components/integrations/integration-card"

// const availableIntegrations = [
//   {
//     type: "GMAIL",
//     name: "Gmail",
//     description: "Send emails directly from your Gmail account with OAuth authentication",
//     category: "Email",
//     icon: "📧",
//     features: ["OAuth 2.0 Authentication", "Send emails", "Track delivery", "Auto-sync"],
//   },
//   {
//     type: "OUTLOOK",
//     name: "Outlook",
//     description: "Connect your Microsoft Outlook account for email sending",
//     category: "Email",
//     icon: "📨",
//     features: ["Microsoft OAuth", "Send emails", "Calendar integration", "Contact sync"],
//   },
//   {
//     type: "RESEND",
//     name: "Resend",
//     description: "Use Resend API for reliable email delivery and tracking",
//     category: "Email",
//     icon: "✉️",
//     features: ["API Key Authentication", "High deliverability", "Email analytics", "Webhooks"],
//   },
//   {
//     type: "OPENAI",
//     name: "OpenAI",
//     description: "Power AI features with your own OpenAI API key for email generation",
//     category: "AI",
//     icon: "🤖",
//     features: ["GPT-4 Access", "Custom prompts", "Email generation", "Research insights"],
//   },
// ]

// export default async function IntegrationsPage() {
//   const userIntegrations = await getUserIntegrations()
//   const connectedTypes = new Set(userIntegrations.map((i) => i.type))

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
//         <p className="text-muted-foreground">Connect mailfra with your email providers and AI services</p>
//       </div>

//       <Card className="border-primary/20 bg-primary/5">
//         <CardHeader>
//           <CardTitle>All-in-One Platform</CardTitle>
//           <CardDescription>
//             mailfra includes built-in email warmup, deliverability optimization, A/B testing, advanced analytics, and
//             AI-powered email generation. No need for external tools like Lemlist or Instantly.
//           </CardDescription>
//         </CardHeader>
//       </Card>

//       {/* Connected Integrations Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Connected Services</CardTitle>
//           <CardDescription>
//             You have {userIntegrations.length} integration{userIntegrations.length !== 1 ? "s" : ""} connected
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-wrap gap-2">
//             {userIntegrations.length === 0 ? (
//               <p className="text-sm text-muted-foreground">No integrations connected yet</p>
//             ) : (
//               userIntegrations.map((integration) => (
//                 <Badge key={integration.id} variant="secondary" className="flex items-center gap-1">
//                   <Check className="h-3 w-3" />
//                   {integration.name}
//                 </Badge>
//               ))
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Available Integrations */}
//       <div>
//         <h2 className="text-2xl font-bold mb-4">Available Integrations</h2>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {availableIntegrations.map((integration) => {
//             const isConnected = connectedTypes.has(integration.type as any)
//             const connectedIntegration = userIntegrations.find((i) => i.type === integration.type)
//             return (
//               <IntegrationCard
//                 key={integration.type}
//                 integration={integration}
//                 isConnected={isConnected}
//                 connectedIntegration={connectedIntegration}
//               />
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import { useState, Suspense, useEffect } from 'react'
import { IntegrationCard } from '@/components/integrations/integration-card'
import type { OAuthProviderKey } from '@/lib/integrations/oauth-config'
import { PROVIDER_NAMES } from '@/lib/integrations/integration-utils'
import { Card } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export default function IntegrationsPage() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  // Fetch connected integrations on mount
  useEffect(() => {
    const loadConnectedIntegrations = async () => {
      try {
        const response = await fetch('/api/integrations/list')
        if (response.ok) {
          const data = await response.json()
          setConnectedIntegrations(new Set(data.connectedProviders || []))
        }
      } catch (error) {
        console.error('[v0] Failed to load integrations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConnectedIntegrations()
  }, [])

  // Check URL params for OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const provider = params.get('provider')

    if (success === 'true' && provider) {
      setConnectedIntegrations(prev => new Set([...prev, provider]))
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    if (params.get('error')) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleConnect = async (provider: OAuthProviderKey) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/integrations/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })

      if (!response.ok) {
        throw new Error('Failed to initiate OAuth flow')
      }

      const { authUrl } = await response.json()
      window.location.href = authUrl
    } catch (error) {
      console.error('[v0] Error connecting:', error)
      setIsLoading(false)
    }
  }

  const handleDisconnect = async (provider: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/integrations/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect')
      }

      setConnectedIntegrations(prev => {
        const next = new Set(prev)
        next.delete(provider)
        return next
      })
    } catch (error) {
      console.error('[v0] Error disconnecting:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const connected = connectedIntegrations.size
  const total = 20

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='space-y-16 px-8 py-12'>
        {/* Master Header */}
        <div className='space-y-8'>
          <div className='space-y-4'>
            {/* <div className='flex items-end justify-between'>
              <div className='flex-1'>
                <h1 className='text-5xl tracking-tight font-light leading-tight text-foreground'>
                  Connect your tools.
                  <br />
                  <span className='font-semibold'>Power your workflow.</span>
                </h1>
              </div>
            </div> */}
            <p className='text-base text-muted-foreground leading-relaxed max-w-2xl font-light'>
              Integrate with over 20 platforms to sync data, automate campaigns, and keep your team aligned across every tool you use.
            </p>
          </div>

          {/* Stats Strip */}
          {/* <div className='flex items-center gap-12 pt-4 border-t border-border'>
            <div>
              <div className='text-2xl font-semibold text-foreground'>{connected}</div>
              <p className='text-xs text-muted-foreground uppercase tracking-wide mt-2'>Connected</p>
            </div>
            <div className='w-px h-8 bg-border' />
            <div>
              <div className='text-2xl font-semibold text-foreground'>{total}</div>
              <p className='text-xs text-muted-foreground uppercase tracking-wide mt-2'>Available</p>
            </div>
            <div className='w-px h-8 bg-border' />
            <div>
              <div className='text-2xl font-semibold text-foreground'>{Math.round((connected / total) * 100)}%</div>
              <p className='text-xs text-muted-foreground uppercase tracking-wide mt-2'>Coverage</p>
            </div>
          </div> */}
        </div>

        {/* All Integrations Grid */}
        <div className='space-y-12'>
          {/* CRM & Lead Management */}
          <section className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-sm font-semibold uppercase tracking-widest text-muted-foreground'>CRM & Lead Management</h2>
              <p className='text-foreground text-lg'>
                Sync leads, contacts, and campaigns across your sales infrastructure.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
              {['HUBSPOT', 'SALESFORCE', 'PIPEDRIVE', 'ZOHO_CRM'].map(provider => {
                const key = provider as OAuthProviderKey
                return (
                  <IntegrationCard
                    key={key}
                    provider={key}
                    providerName={PROVIDER_NAMES[key]}
                    isConnected={connectedIntegrations.has(key)}
                    onConnect={() => handleConnect(key)}
                    onDisconnect={() => handleDisconnect(key)}
                    isLoading={isLoading}
                  />
                )
              })}
            </div>
          </section>

          {/* Email & Outreach */}
          <section className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-sm font-semibold uppercase tracking-widest text-muted-foreground'>Email & Outreach</h2>
              <p className='text-foreground text-lg'>
                Connect cold email and outreach platforms to amplify your campaigns.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
              {['LEMLIST', 'APOLLO', 'MAILCHIMP', 'KLAVIYO'].map(provider => {
                const key = provider as OAuthProviderKey
                return (
                  <IntegrationCard
                    key={key}
                    provider={key}
                    providerName={PROVIDER_NAMES[key]}
                    isConnected={connectedIntegrations.has(key)}
                    onConnect={() => handleConnect(key)}
                    onDisconnect={() => handleDisconnect(key)}
                    isLoading={isLoading}
                  />
                )
              })}
            </div>
          </section>

          {/* Communication */}
          <section className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-sm font-semibold uppercase tracking-widest text-muted-foreground'>Communication</h2>
              <p className='text-foreground text-lg'>
                Notify your team and collaborate across messaging platforms.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
              {['SLACK', 'ZENDESK', 'INTERCOM', 'SEGMENT'].map(provider => {
                const key = provider as OAuthProviderKey
                return (
                  <IntegrationCard
                    key={key}
                    provider={key}
                    providerName={PROVIDER_NAMES[key]}
                    isConnected={connectedIntegrations.has(key)}
                    onConnect={() => handleConnect(key)}
                    onDisconnect={() => handleDisconnect(key)}
                    isLoading={isLoading}
                  />
                )
              })}
            </div>
          </section>

          {/* Productivity */}
          <section className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-sm font-semibold uppercase tracking-widest text-muted-foreground'>Productivity</h2>
              <p className='text-foreground text-lg'>
                Organize data and automate workflows with task and database tools.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
              {['AIRTABLE', 'NOTION', 'ASANA', 'CLICKUP'].map(provider => {
                const key = provider as OAuthProviderKey
                return (
                  <IntegrationCard
                    key={key}
                    provider={key}
                    providerName={PROVIDER_NAMES[key]}
                    isConnected={connectedIntegrations.has(key)}
                    onConnect={() => handleConnect(key)}
                    onDisconnect={() => handleDisconnect(key)}
                    isLoading={isLoading}
                  />
                )
              })}
            </div>
          </section>

          {/* Advanced */}
          <section className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-sm font-semibold uppercase tracking-widest text-muted-foreground'>Advanced & Analytics</h2>
              <p className='text-foreground text-lg'>
                Advanced integrations for enterprise teams and analytics.
              </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
              {['HIGHLEVEL', 'TRELLO', 'GOOGLE_SHEETS', 'AMPLITUDE'].map(provider => {
                const key = provider as OAuthProviderKey
                return (
                  <IntegrationCard
                    key={key}
                    provider={key}
                    providerName={PROVIDER_NAMES[key]}
                    isConnected={connectedIntegrations.has(key)}
                    onConnect={() => handleConnect(key)}
                    onDisconnect={() => handleDisconnect(key)}
                    isLoading={isLoading}
                  />
                )
              })}
            </div>
          </section>
        </div>

        {/* Trust Section */}
        <div className='border-t border-border pt-12 space-y-8'>
          <div className='grid grid-cols-3 gap-8'>
            <div>
              <p className='text-xs uppercase tracking-widest text-muted-foreground mb-2'>Security</p>
              <p className='text-foreground text-sm leading-relaxed'>
                OAuth 2.0 standard with industry-grade encryption and security protocols.
              </p>
            </div>
            <div>
              <p className='text-xs uppercase tracking-widest text-muted-foreground mb-2'>Privacy</p>
              <p className='text-foreground text-sm leading-relaxed'>
                Your tokens and data are encrypted and never exposed to third parties.
              </p>
            </div>
            <div>
              <p className='text-xs uppercase tracking-widest text-muted-foreground mb-2'>Support</p>
              <p className='text-foreground text-sm leading-relaxed'>
                Need help? Our team is ready to assist with any integration questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
