/**
 * OAuth Configuration for All Integrations
 * Production-ready with proper environment variables and types
 */

// Match the Prisma enum exactly
export type OAuthProviderKey =
  | 'AIRTABLE'
  | 'AMPLITUDE'
  | 'ASANA'
  | 'CLICKUP'
  | 'CODA'
  | 'GMAIL'
  | 'GOOGLE_DOCS'
  | 'GOOGLE_SHEETS'
  | 'HUBSPOT'
  | 'INTERCOM'
  | 'KLAVIYO'
  | 'MAILCHIMP'
  | 'MIXPANEL'
  | 'NOTION'
  | 'OPENAI'
  | 'OUTLOOK'
  | 'PIPEDRIVE'
  | 'RESEND'
  | 'SALESFORCE'
  | 'SEGMENT'
  | 'SERVICENOW'
  | 'STRIPE'
  | 'TRELLO'
  | 'ZENDESK'
  | 'ZOHO_CRM'
  | 'SLACK'
  | 'APOLLO'
  | 'LEMLIST'
  | 'HIGHLEVEL'

export interface OAuthConfig {
  name: string
  clientId: string
  clientSecret: string
  authorizationUrl: string
  tokenUrl: string
  redirectUri: string
  scope: string | readonly string[]
  userInfoUrl?: string
}

const getAppUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const OAUTH_PROVIDERS: Record<OAuthProviderKey, OAuthConfig> = {
  HUBSPOT: {
    name: 'HubSpot',
    clientId: process.env.HUBSPOT_CLIENT_ID || '',
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.hubspot.com/oauth/authorize',
    tokenUrl: 'https://api.hubapi.com/oauth/v1/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/hubspot`,
    scope: ['crm.objects.contacts.read', 'crm.objects.contacts.write'],
    userInfoUrl: 'https://api.hubapi.com/oauth/v1/access-tokens',
  },

  SALESFORCE: {
    name: 'Salesforce',
    clientId: process.env.SALESFORCE_CLIENT_ID || '',
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET || '',
    authorizationUrl: 'https://login.salesforce.com/services/oauth2/authorize',
    tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/salesforce`,
    scope: 'api refresh_token',
    userInfoUrl: 'https://login.salesforce.com/services/oauth2/userinfo',
  },

  PIPEDRIVE: {
    name: 'Pipedrive',
    clientId: process.env.PIPEDRIVE_CLIENT_ID || '',
    clientSecret: process.env.PIPEDRIVE_CLIENT_SECRET || '',
    authorizationUrl: 'https://oauth.pipedrive.com/oauth/authorize',
    tokenUrl: 'https://oauth.pipedrive.com/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/pipedrive`,
    scope: 'users:read',
    userInfoUrl: 'https://api.pipedrive.com/v1/users/me',
  },

  ZOHO_CRM: {
    name: 'Zoho CRM',
    clientId: process.env.ZOHO_CLIENT_ID || '',
    clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.zoho.com/oauth/v2/auth',
    tokenUrl: 'https://accounts.zoho.com/oauth/v2/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/zoho-crm`,
    scope: 'ZohoCRM.users.READ',
  },

  MAILCHIMP: {
    name: 'Mailchimp',
    clientId: process.env.MAILCHIMP_CLIENT_ID || '',
    clientSecret: process.env.MAILCHIMP_CLIENT_SECRET || '',
    authorizationUrl: 'https://login.mailchimp.com/oauth2/authorize',
    tokenUrl: 'https://login.mailchimp.com/oauth2/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/mailchimp`,
    scope: '',
    userInfoUrl: 'https://login.mailchimp.com/oauth2/metadata',
  },

  KLAVIYO: {
    name: 'Klaviyo',
    clientId: process.env.KLAVIYO_CLIENT_ID || '',
    clientSecret: process.env.KLAVIYO_CLIENT_SECRET || '',
    authorizationUrl: 'https://www.klaviyo.com/oauth/authorize',
    tokenUrl: 'https://a.klaviyo.com/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/klaviyo`,
    scope: 'lists:read campaigns:read',
  },

  ZENDESK: {
    name: 'Zendesk',
    clientId: process.env.ZENDESK_CLIENT_ID || '',
    clientSecret: process.env.ZENDESK_CLIENT_SECRET || '',
    authorizationUrl: `https://${process.env.ZENDESK_SUBDOMAIN || 'yoursubdomain'}.zendesk.com/oauth/authorizations/new`,
    tokenUrl: `https://${process.env.ZENDESK_SUBDOMAIN || 'yoursubdomain'}.zendesk.com/oauth/tokens`,
    redirectUri: `${getAppUrl()}/api/integrations/callback/zendesk`,
    scope: 'read write',
    userInfoUrl: `https://${process.env.ZENDESK_SUBDOMAIN || 'yoursubdomain'}.zendesk.com/api/v2/users/me.json`,
  },

  INTERCOM: {
    name: 'Intercom',
    clientId: process.env.INTERCOM_CLIENT_ID || '',
    clientSecret: process.env.INTERCOM_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.intercom.com/oauth',
    tokenUrl: 'https://api.intercom.io/auth/eagle/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/intercom`,
    scope: '',
    userInfoUrl: 'https://api.intercom.io/me',
  },

  SEGMENT: {
    name: 'Segment',
    clientId: process.env.SEGMENT_CLIENT_ID || '',
    clientSecret: process.env.SEGMENT_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.segment.com/oauth2/authorize',
    tokenUrl: 'https://api.segment.io/oauth2/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/segment`,
    scope: 'workspace:read',
  },

  AIRTABLE: {
    name: 'Airtable',
    clientId: process.env.AIRTABLE_CLIENT_ID || '',
    clientSecret: process.env.AIRTABLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://airtable.com/oauth2/v1/authorize',
    tokenUrl: 'https://airtable.com/oauth2/v1/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/airtable`,
    scope: 'data.records:read data.records:write schema.bases:read',
    userInfoUrl: 'https://api.airtable.com/v0/meta/whoami',
  },

  NOTION: {
    name: 'Notion',
    clientId: process.env.NOTION_CLIENT_ID || '',
    clientSecret: process.env.NOTION_CLIENT_SECRET || '',
    authorizationUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/notion`,
    scope: '',
    userInfoUrl: 'https://api.notion.com/v1/users/me',
  },

  ASANA: {
    name: 'Asana',
    clientId: process.env.ASANA_CLIENT_ID || '',
    clientSecret: process.env.ASANA_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.asana.com/-/oauth_authorize',
    tokenUrl: 'https://app.asana.com/-/oauth_token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/asana`,
    scope: '',
    userInfoUrl: 'https://app.asana.com/api/1.0/users/me',
  },

  CLICKUP: {
    name: 'ClickUp',
    clientId: process.env.CLICKUP_CLIENT_ID || '',
    clientSecret: process.env.CLICKUP_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.clickup.com/api',
    tokenUrl: 'https://api.clickup.com/api/v2/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/clickup`,
    scope: '',
    userInfoUrl: 'https://api.clickup.com/api/v2/user',
  },

  TRELLO: {
    name: 'Trello',
    clientId: process.env.TRELLO_CLIENT_ID || '',
    clientSecret: process.env.TRELLO_CLIENT_SECRET || '',
    authorizationUrl: 'https://trello.com/1/authorize',
    tokenUrl: 'https://trello.com/1/OAuthGetAccessToken',
    redirectUri: `${getAppUrl()}/api/integrations/callback/trello`,
    scope: 'read,write',
    userInfoUrl: 'https://api.trello.com/1/members/me',
  },

  GOOGLE_SHEETS: {
    name: 'Google Sheets',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/google-sheets`,
    scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },

  GOOGLE_DOCS: {
    name: 'Google Docs',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/google-docs`,
    scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/userinfo.email',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },

  AMPLITUDE: {
    name: 'Amplitude',
    clientId: process.env.AMPLITUDE_CLIENT_ID || '',
    clientSecret: process.env.AMPLITUDE_CLIENT_SECRET || '',
    authorizationUrl: 'https://analytics.amplitude.com/oauth/authorize',
    tokenUrl: 'https://analytics.amplitude.com/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/amplitude`,
    scope: 'read:events read:users',
  },

  MIXPANEL: {
    name: 'Mixpanel',
    clientId: process.env.MIXPANEL_CLIENT_ID || '',
    clientSecret: process.env.MIXPANEL_CLIENT_SECRET || '',
    authorizationUrl: 'https://mixpanel.com/oauth/authorize',
    tokenUrl: 'https://mixpanel.com/oauth/access_token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/mixpanel`,
    scope: 'read',
  },

  CODA: {
    name: 'Coda',
    clientId: process.env.CODA_CLIENT_ID || '',
    clientSecret: process.env.CODA_CLIENT_SECRET || '',
    authorizationUrl: 'https://coda.io/oauth/authorize',
    tokenUrl: 'https://coda.io/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/coda`,
    scope: 'doc:read doc:write',
    userInfoUrl: 'https://coda.io/apis/v1/whoami',
  },

  SERVICENOW: {
    name: 'ServiceNow',
    clientId: process.env.SERVICENOW_CLIENT_ID || '',
    clientSecret: process.env.SERVICENOW_CLIENT_SECRET || '',
    authorizationUrl: `https://${process.env.SERVICENOW_INSTANCE || 'dev123456'}.service-now.com/oauth_auth.do`,
    tokenUrl: `https://${process.env.SERVICENOW_INSTANCE || 'dev123456'}.service-now.com/oauth_token.do`,
    redirectUri: `${getAppUrl()}/api/integrations/callback/servicenow`,
    scope: 'useraccount',
  },

  // Non-OAuth integrations (placeholders for your enum)
  GMAIL: {
    name: 'Gmail',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/gmail`,
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },

  OUTLOOK: {
    name: 'Outlook',
    clientId: process.env.OUTLOOK_CLIENT_ID || '',
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET || '',
    authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/outlook`,
    scope: 'https://graph.microsoft.com/Mail.Read offline_access',
  },

  RESEND: {
    name: 'Resend',
    clientId: process.env.RESEND_CLIENT_ID || '',
    clientSecret: process.env.RESEND_CLIENT_SECRET || '',
    authorizationUrl: 'https://resend.com/oauth/authorize',
    tokenUrl: 'https://resend.com/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/resend`,
    scope: 'emails:send',
  },

  OPENAI: {
    name: 'OpenAI',
    clientId: process.env.OPENAI_CLIENT_ID || '',
    clientSecret: process.env.OPENAI_CLIENT_SECRET || '',
    authorizationUrl: 'https://api.openai.com/oauth/authorize',
    tokenUrl: 'https://api.openai.com/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/openai`,
    scope: 'api',
  },

  STRIPE: {
    name: 'Stripe',
    clientId: process.env.STRIPE_CLIENT_ID || '',
    clientSecret: process.env.STRIPE_CLIENT_SECRET || '',
    authorizationUrl: 'https://connect.stripe.com/oauth/authorize',
    tokenUrl: 'https://connect.stripe.com/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/stripe`,
    scope: 'read_write',
  },

  SLACK: {
    name: 'Slack',
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    authorizationUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    redirectUri: `${getAppUrl()}/api/integrations/callback/slack`,
    scope: ['incoming-webhook', 'commands', 'chat:write'],
    userInfoUrl: 'https://slack.com/api/users.identity',
  },

  APOLLO: {
    name: 'Apollo',
    clientId: process.env.APOLLO_CLIENT_ID || '',
    clientSecret: process.env.APOLLO_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.apollo.io/oauth/authorize',
    tokenUrl: 'https://app.apollo.io/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/apollo`,
    scope: 'read write',
  },

  LEMLIST: {
    name: 'Lemlist',
    clientId: process.env.LEMLIST_CLIENT_ID || '',
    clientSecret: process.env.LEMLIST_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.lemlist.com/oauth/authorize',
    tokenUrl: 'https://app.lemlist.com/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/lemlist`,
    scope: 'all',
  },

  HIGHLEVEL: {
    name: 'GoHighLevel',
    clientId: process.env.GOHIGHLEVEL_CLIENT_ID || '',
    clientSecret: process.env.GOHIGHLEVEL_CLIENT_SECRET || '',
    authorizationUrl: 'https://app.gohighlevel.com/oauth/authorize',
    tokenUrl: 'https://app.gohighlevel.com/oauth/token',
    redirectUri: `${getAppUrl()}/api/integrations/callback/highlevel`,
    scope: 'opportunities.readonly opportunities.write contacts.readonly contacts.write',
  },
}