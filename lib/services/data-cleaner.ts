// Service for cleaning and validating imported prospect data

export interface ValidationIssue {
  row: number
  field: string
  value: string
  issue: "invalid_email" | "duplicate_email" | "missing_required" | "invalid_url" | "invalid_phone" | "suspicious_data"
  severity: "error" | "warning"
  suggestion?: string
}

export interface CleaningResult {
  validRecords: Array<Record<string, string>>
  invalidRecords: Array<{ record: Record<string, string>; issues: ValidationIssue[] }>
  duplicates: Array<{ email: string; rows: number[] }>
  summary: {
    total: number
    valid: number
    invalid: number
    duplicatesRemoved: number
    emailsFixed: number
    warnings: number
  }
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.trim())
}

// Check for disposable email domains
const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "throwaway.com",
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "trashmail.com",
]

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase()
  return DISPOSABLE_DOMAINS.some((d) => domain?.includes(d))
}

// Check for role-based emails
const ROLE_BASED_PREFIXES = [
  "info@",
  "support@",
  "sales@",
  "contact@",
  "admin@",
  "help@",
  "noreply@",
  "no-reply@",
  "marketing@",
  "team@",
  "hello@",
  "office@",
]

function isRoleBasedEmail(email: string): boolean {
  const lowerEmail = email.toLowerCase()
  return ROLE_BASED_PREFIXES.some((prefix) => lowerEmail.startsWith(prefix))
}

// Try to fix common email issues
function tryFixEmail(email: string): { fixed: string; wasFixed: boolean } {
  let fixed = email.trim().toLowerCase()
  let wasFixed = false

  // Remove leading/trailing spaces
  if (fixed !== email) wasFixed = true

  // Fix common typos in domains
  const domainFixes: Record<string, string> = {
    "gmial.com": "gmail.com",
    "gmal.com": "gmail.com",
    "gmail.co": "gmail.com",
    "gamil.com": "gmail.com",
    "hotmal.com": "hotmail.com",
    "hotmai.com": "hotmail.com",
    "yahooo.com": "yahoo.com",
    "yaho.com": "yahoo.com",
    "outloo.com": "outlook.com",
    "outlok.com": "outlook.com",
  }

  for (const [typo, correct] of Object.entries(domainFixes)) {
    if (fixed.endsWith(typo)) {
      fixed = fixed.replace(typo, correct)
      wasFixed = true
      break
    }
  }

  // Remove common prefixes accidentally included
  if (fixed.startsWith("mailto:")) {
    fixed = fixed.replace("mailto:", "")
    wasFixed = true
  }

  return { fixed, wasFixed }
}

// Validate URL format
function isValidUrl(url: string): boolean {
  if (!url.trim()) return true // Empty is valid (optional field)
  try {
    const urlToTest = url.startsWith("http") ? url : `https://${url}`
    new URL(urlToTest)
    return true
  } catch {
    return false
  }
}

// Try to fix URL
function tryFixUrl(url: string): string {
  if (!url.trim()) return ""

  let fixed = url.trim()

  // Add https:// if missing protocol
  if (!fixed.match(/^https?:\/\//i)) {
    fixed = `https://${fixed}`
  }

  // Fix linkedin URLs
  if (
    fixed.includes("linkedin.com") &&
    !fixed.includes("linkedin.com/in/") &&
    !fixed.includes("linkedin.com/company/")
  ) {
    // Try to extract the profile part
    const match = fixed.match(/linkedin\.com\/?([\w-]+)$/i)
    if (match) {
      fixed = `https://linkedin.com/in/${match[1]}`
    }
  }

  return fixed
}

// Validate phone format (basic)
function isValidPhone(phone: string): boolean {
  if (!phone.trim()) return true // Empty is valid (optional field)
  const cleaned = phone.replace(/[^0-9+]/g, "")
  return cleaned.length >= 7 && cleaned.length <= 15
}

// Normalize phone number
function normalizePhone(phone: string): string {
  if (!phone.trim()) return ""
  // Remove everything except digits and leading +
  return phone.replace(/[^0-9+]/g, "").replace(/^\+?/, "+")
}

// Main data cleaning function
export function cleanAndValidateData(
  records: Array<Record<string, string>>,
  options: {
    removeDuplicates: boolean
    fixEmails: boolean
    fixUrls: boolean
    removeInvalidEmails: boolean
    removeRoleBasedEmails: boolean
    removeDisposableEmails: boolean
  } = {
    removeDuplicates: true,
    fixEmails: true,
    fixUrls: true,
    removeInvalidEmails: true,
    removeRoleBasedEmails: false,
    removeDisposableEmails: false,
  },
): CleaningResult {
  const validRecords: Array<Record<string, string>> = []
  const invalidRecords: Array<{ record: Record<string, string>; issues: ValidationIssue[] }> = []
  const emailsSeen = new Map<string, number[]>()
  const duplicates: Array<{ email: string; rows: number[] }> = []

  let emailsFixed = 0
  let duplicatesRemoved = 0
  let warningsCount = 0

  records.forEach((record, rowIndex) => {
    const issues: ValidationIssue[] = []
    const cleanedRecord = { ...record }

    // Validate and clean email
    let email = record.email?.trim() || ""

    if (!email) {
      issues.push({
        row: rowIndex + 1,
        field: "email",
        value: email,
        issue: "missing_required",
        severity: "error",
        suggestion: "Email is required for each prospect",
      })
    } else {
      // Try to fix email if option enabled
      if (options.fixEmails) {
        const { fixed, wasFixed } = tryFixEmail(email)
        if (wasFixed) {
          email = fixed
          cleanedRecord.email = fixed
          emailsFixed++
        }
      }

      // Validate email format
      if (!isValidEmail(email)) {
        issues.push({
          row: rowIndex + 1,
          field: "email",
          value: email,
          issue: "invalid_email",
          severity: "error",
          suggestion: "Please provide a valid email address",
        })
      } else {
        // Check for duplicates
        const normalizedEmail = email.toLowerCase()
        if (emailsSeen.has(normalizedEmail)) {
          emailsSeen.get(normalizedEmail)!.push(rowIndex + 1)
        } else {
          emailsSeen.set(normalizedEmail, [rowIndex + 1])
        }

        // Check for disposable emails
        if (options.removeDisposableEmails && isDisposableEmail(email)) {
          issues.push({
            row: rowIndex + 1,
            field: "email",
            value: email,
            issue: "suspicious_data",
            severity: "warning",
            suggestion: "This appears to be a disposable email address",
          })
          warningsCount++
        }

        // Check for role-based emails
        if (options.removeRoleBasedEmails && isRoleBasedEmail(email)) {
          issues.push({
            row: rowIndex + 1,
            field: "email",
            value: email,
            issue: "suspicious_data",
            severity: "warning",
            suggestion: "This appears to be a role-based email (e.g., info@, support@)",
          })
          warningsCount++
        }
      }
    }

    // Validate and fix LinkedIn URL
    if (record.linkedinUrl && options.fixUrls) {
      const fixedUrl = tryFixUrl(record.linkedinUrl)
      if (fixedUrl !== record.linkedinUrl) {
        cleanedRecord.linkedinUrl = fixedUrl
      }
      if (!isValidUrl(fixedUrl)) {
        issues.push({
          row: rowIndex + 1,
          field: "linkedinUrl",
          value: record.linkedinUrl,
          issue: "invalid_url",
          severity: "warning",
          suggestion: "Please provide a valid LinkedIn URL",
        })
        warningsCount++
      }
    }

    // Validate and fix website URL
    if (record.websiteUrl && options.fixUrls) {
      const fixedUrl = tryFixUrl(record.websiteUrl)
      if (fixedUrl !== record.websiteUrl) {
        cleanedRecord.websiteUrl = fixedUrl
      }
      if (!isValidUrl(fixedUrl)) {
        issues.push({
          row: rowIndex + 1,
          field: "websiteUrl",
          value: record.websiteUrl,
          issue: "invalid_url",
          severity: "warning",
          suggestion: "Please provide a valid website URL",
        })
        warningsCount++
      }
    }

    // Validate phone
    if (record.phone) {
      cleanedRecord.phone = normalizePhone(record.phone)
      if (!isValidPhone(record.phone)) {
        issues.push({
          row: rowIndex + 1,
          field: "phone",
          value: record.phone,
          issue: "invalid_phone",
          severity: "warning",
          suggestion: "Phone number format may be invalid",
        })
        warningsCount++
      }
    }

    // Determine if record is valid or invalid
    const hasErrors = issues.some((i) => i.severity === "error")

    if (hasErrors && options.removeInvalidEmails) {
      invalidRecords.push({ record: cleanedRecord, issues })
    } else {
      // Mark for potential duplicate removal later
      cleanedRecord._rowIndex = String(rowIndex)
      validRecords.push(cleanedRecord)
      if (issues.length > 0) {
        // Still track issues even for valid records
        invalidRecords.push({ record: cleanedRecord, issues: issues.filter((i) => i.severity === "warning") })
      }
    }
  })

  // Process duplicates
  for (const [email, rows] of emailsSeen) {
    if (rows.length > 1) {
      duplicates.push({ email, rows })
    }
  }

  // Remove duplicates if option enabled
  let finalValidRecords = validRecords
  if (options.removeDuplicates) {
    const seenEmails = new Set<string>()
    finalValidRecords = validRecords.filter((record) => {
      const email = record.email?.toLowerCase()
      if (seenEmails.has(email)) {
        duplicatesRemoved++
        return false
      }
      seenEmails.add(email)
      return true
    })
  }

  // Clean up internal tracking fields
  finalValidRecords.forEach((record) => {
    delete record._rowIndex
  })

  return {
    validRecords: finalValidRecords,
    invalidRecords: invalidRecords.filter((r) => r.issues.length > 0),
    duplicates,
    summary: {
      total: records.length,
      valid: finalValidRecords.length,
      invalid: records.length - finalValidRecords.length,
      duplicatesRemoved,
      emailsFixed,
      warnings: warningsCount,
    },
  }
}

// Find duplicates against existing prospects in database
export async function findDuplicatesAgainstExisting(emails: string[], existingEmails: string[]): Promise<string[]> {
  const existingSet = new Set(existingEmails.map((e) => e.toLowerCase()))
  return emails.filter((email) => existingSet.has(email.toLowerCase()))
}
