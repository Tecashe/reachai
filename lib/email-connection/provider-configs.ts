/**
 * Pre-configured SMTP/IMAP settings for common email providers
 */

export const PROVIDER_CONFIGS: Record<
  string,
  {
    smtp: { host: string; port: number; secure: boolean }
    imap: { host: string; port: number; tls: boolean }
  }
> = {
  gmail: {
    smtp: { host: "smtp.gmail.com", port: 587, secure: false },
    imap: { host: "imap.gmail.com", port: 993, tls: true },
  },
  outlook: {
    smtp: { host: "smtp-mail.outlook.com", port: 587, secure: false },
    imap: { host: "outlook.office365.com", port: 993, tls: true },
  },
  office365: {
    smtp: { host: "smtp.office365.com", port: 587, secure: false },
    imap: { host: "outlook.office365.com", port: 993, tls: true },
  },
  yahoo: {
    smtp: { host: "smtp.mail.yahoo.com", port: 465, secure: true },
    imap: { host: "imap.mail.yahoo.com", port: 993, tls: true },
  },
  aol: {
    smtp: { host: "smtp.aol.com", port: 465, secure: true },
    imap: { host: "imap.aol.com", port: 993, tls: true },
  },
}

/**
 * Detect email provider from email address
 */
export function detectProvider(email: string): string {
  const domain = email.split("@")[1]?.toLowerCase() || ""

  const providerMap: Record<string, string> = {
    "gmail.com": "gmail",
    "googlemail.com": "gmail",
    "outlook.com": "outlook",
    "outlook.fr": "outlook",
    "outlook.es": "outlook",
    "hotmail.com": "outlook",
    "hotmail.fr": "outlook",
    "live.com": "outlook",
    "yahoo.com": "yahoo",
    "yahoo.fr": "yahoo",
    "yahoo.es": "yahoo",
    "aol.com": "aol",
    "aol.fr": "aol",
  }

  return providerMap[domain] || "custom"
}

/**
 * Get provider config by provider name
 */
export function getProviderConfig(provider: string) {
  return PROVIDER_CONFIGS[provider.toLowerCase()] || null
}

/**
 * Auto-detect SMTP/IMAP settings based on email
 */
export function getAutoConfigForEmail(email: string) {
  const provider = detectProvider(email)
  const config = getProviderConfig(provider)

  if (config) {
    return {
      provider,
      ...config,
      username: email,
    }
  }

  // Return null for custom domain - user must provide settings
  return null
}
