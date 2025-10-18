export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

export function validateProspectData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Valid email is required")
  }

  if (data.linkedinUrl && !isValidUrl(data.linkedinUrl)) {
    errors.push("Invalid LinkedIn URL")
  }

  if (data.websiteUrl && !isValidUrl(data.websiteUrl)) {
    errors.push("Invalid website URL")
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
