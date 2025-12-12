/**
 * Variable Validator Utility
 *
 * Ensures that personalization variables in email content are validated
 * against prospect data and handled gracefully when missing.
 */

// Define all available variables with their corresponding prospect field paths and fallbacks
export const VARIABLE_CONFIG: Record<
  string,
  {
    field: string
    fallback: string
    required?: boolean
  }
> = {
  // Prospect variables
  firstName: { field: "firstName", fallback: "there" },
  lastName: { field: "lastName", fallback: "" },
  fullName: { field: "fullName", fallback: "there" },
  email: { field: "email", fallback: "", required: true },
  phoneNumber: { field: "phoneNumber", fallback: "" },

  // Company variables
  company: { field: "company", fallback: "your company" },
  industry: { field: "industry", fallback: "" },
  companySize: { field: "companySize", fallback: "" },
  websiteUrl: { field: "websiteUrl", fallback: "" },

  // Job variables
  jobTitle: { field: "jobTitle", fallback: "" },
  department: { field: "department", fallback: "" },

  // Custom fields
  customField1: { field: "customField1", fallback: "" },
  customField2: { field: "customField2", fallback: "" },
}

// Sender variables (these come from user settings, not prospect)
export const SENDER_VARIABLES = ["senderName", "senderCompany", "senderTitle", "senderEmail"]

/**
 * Extract all variables from a text string
 */
export function extractVariables(text: string): string[] {
  const regex = /\{\{([^}]+)\}\}/g
  const matches: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1].trim())
  }

  return [...new Set(matches)] // Remove duplicates
}

/**
 * Validate variables in content against prospect data
 * Returns missing variables and warnings
 */
export function validateVariables(
  content: string,
  prospect: Record<string, any>,
  sender?: Record<string, any>,
): {
  isValid: boolean
  missingVariables: string[]
  warnings: string[]
  requiredMissing: string[]
} {
  const variables = extractVariables(content)
  const missingVariables: string[] = []
  const warnings: string[] = []
  const requiredMissing: string[] = []

  for (const variable of variables) {
    // Check if it's a sender variable
    if (SENDER_VARIABLES.includes(variable)) {
      if (!sender || !sender[variable]) {
        missingVariables.push(variable)
        warnings.push(`Sender variable {{${variable}}} is not configured`)
      }
      continue
    }

    // Check prospect variables
    const config = VARIABLE_CONFIG[variable]
    if (!config) {
      warnings.push(`Unknown variable {{${variable}}} - will be left as-is`)
      continue
    }

    const value = getNestedValue(prospect, config.field)
    if (!value || value === "") {
      missingVariables.push(variable)

      if (config.required) {
        requiredMissing.push(variable)
      } else if (!config.fallback) {
        warnings.push(`{{${variable}}} has no value and no fallback - will be removed`)
      }
    }
  }

  return {
    isValid: requiredMissing.length === 0,
    missingVariables,
    warnings,
    requiredMissing,
  }
}

/**
 * Replace variables in content with actual values
 * Handles missing values gracefully with fallbacks
 */
export function replaceVariables(
  content: string,
  prospect: Record<string, any>,
  sender?: Record<string, any>,
  options?: {
    removeMissing?: boolean // Remove variables with no value and no fallback
    highlightMissing?: boolean // Wrap missing vars in a visible marker
  },
): string {
  const { removeMissing = true, highlightMissing = false } = options || {}

  let result = content

  // Replace all variables
  result = result.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim()

    // Handle sender variables
    if (SENDER_VARIABLES.includes(trimmedName)) {
      const value = sender?.[trimmedName]
      if (value) return value

      if (highlightMissing) return `[MISSING: ${trimmedName}]`
      if (removeMissing) return ""
      return match
    }

    // Handle prospect variables
    const config = VARIABLE_CONFIG[trimmedName]
    if (!config) {
      // Unknown variable - leave as-is or remove
      if (removeMissing) return ""
      return match
    }

    const value = getNestedValue(prospect, config.field)
    if (value && value !== "") {
      return value
    }

    // Use fallback
    if (config.fallback) {
      return config.fallback
    }

    // No value and no fallback
    if (highlightMissing) return `[MISSING: ${trimmedName}]`
    if (removeMissing) return ""
    return match
  })

  // Clean up any double spaces created by removed variables
  result = result.replace(/ {2,}/g, " ")

  // Clean up lines that are now empty except for punctuation
  result = result.replace(/^\s*[,.:;]\s*$/gm, "")

  return result.trim()
}

/**
 * Get a preview of the email with sample data
 */
export function getPreviewContent(content: string, sampleData?: Record<string, string>): string {
  const defaultSampleData: Record<string, string> = {
    firstName: "John",
    lastName: "Smith",
    fullName: "John Smith",
    email: "john@example.com",
    phoneNumber: "+1 (555) 123-4567",
    company: "Acme Inc",
    industry: "Technology",
    companySize: "50-100 employees",
    websiteUrl: "www.acme.com",
    jobTitle: "VP of Sales",
    department: "Sales",
    senderName: "Your Name",
    senderCompany: "Your Company",
    senderTitle: "Account Executive",
    senderEmail: "you@yourcompany.com",
  }

  const data = { ...defaultSampleData, ...sampleData }

  return content.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const trimmedName = variableName.trim()
    return data[trimmedName] || match
  })
}

/**
 * Check if email content is safe to send
 * Returns false if required variables are missing
 */
export function isSafeToSend(
  content: string,
  prospect: Record<string, any>,
  sender?: Record<string, any>,
): { safe: boolean; reason?: string } {
  const validation = validateVariables(content, prospect, sender)

  if (!validation.isValid) {
    return {
      safe: false,
      reason: `Required variables missing: ${validation.requiredMissing.join(", ")}`,
    }
  }

  // Additional checks
  const processedContent = replaceVariables(content, prospect, sender)

  // Check for leftover unprocessed variables (unknown ones)
  if (/\{\{[^}]+\}\}/.test(processedContent)) {
    return {
      safe: false,
      reason: "Content contains unresolved variables",
    }
  }

  // Check for [MISSING: ...] markers if highlight mode was used
  if (/\[MISSING:[^\]]+\]/.test(processedContent)) {
    return {
      safe: false,
      reason: "Content contains missing variable markers",
    }
  }

  return { safe: true }
}

/**
 * Helper function to get nested object values using dot notation
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

/**
 * Generate a summary of variables used in content
 */
export function getVariableSummary(content: string): {
  total: number
  byCategory: Record<string, string[]>
  unknown: string[]
} {
  const variables = extractVariables(content)
  const byCategory: Record<string, string[]> = {
    prospect: [],
    company: [],
    job: [],
    sender: [],
    custom: [],
  }
  const unknown: string[] = []

  for (const variable of variables) {
    if (SENDER_VARIABLES.includes(variable)) {
      byCategory.sender.push(variable)
    } else if (["firstName", "lastName", "fullName", "email", "phoneNumber"].includes(variable)) {
      byCategory.prospect.push(variable)
    } else if (["company", "industry", "companySize", "websiteUrl"].includes(variable)) {
      byCategory.company.push(variable)
    } else if (["jobTitle", "department"].includes(variable)) {
      byCategory.job.push(variable)
    } else if (variable.startsWith("customField")) {
      byCategory.custom.push(variable)
    } else {
      unknown.push(variable)
    }
  }

  return {
    total: variables.length,
    byCategory,
    unknown,
  }
}
