// Service for intelligently mapping imported fields to prospect fields

export interface FieldMapping {
  sourceField: string
  targetField: string
  confidence: number
  isCustomField: boolean
}

export interface ImportColumn {
  name: string
  sampleValues: string[]
  detectedType: "email" | "name" | "company" | "phone" | "url" | "text" | "unknown"
}

export interface MappingResult {
  columns: ImportColumn[]
  suggestedMappings: FieldMapping[]
  unmappedColumns: string[]
  customFields: string[]
  confidence: number // Overall confidence score (0-1)
}

// Standard prospect fields that we want to map to
export const STANDARD_FIELDS = [
  {
    key: "email",
    label: "Email",
    required: true,
    aliases: [
      "email",
      "e-mail",
      "email_address",
      "emailaddress",
      "mail",
      "contact_email",
      "work_email",
      "primary_email",
    ],
  },
  {
    key: "firstName",
    label: "First Name",
    required: false,
    aliases: ["firstname", "first_name", "first", "given_name", "givenname", "fname"],
  },
  {
    key: "lastName",
    label: "Last Name",
    required: false,
    aliases: ["lastname", "last_name", "last", "surname", "family_name", "familyname", "lname"],
  },
  {
    key: "fullName",
    label: "Full Name",
    required: false,
    aliases: ["fullname", "full_name", "name", "contact_name", "person_name"],
  },
  {
    key: "company",
    label: "Company",
    required: false,
    aliases: [
      "company",
      "company_name",
      "companyname",
      "organization",
      "organisation",
      "org",
      "employer",
      "business",
      "account_name",
      "account",
    ],
  },
  {
    key: "jobTitle",
    label: "Job Title",
    required: false,
    aliases: ["jobtitle", "job_title", "title", "position", "role", "designation", "job"],
  },
  {
    key: "phone",
    label: "Phone",
    required: false,
    aliases: [
      "phone",
      "phone_number",
      "phonenumber",
      "telephone",
      "tel",
      "mobile",
      "cell",
      "contact_number",
      "work_phone",
      "direct_phone",
    ],
  },
  {
    key: "linkedinUrl",
    label: "LinkedIn URL",
    required: false,
    aliases: ["linkedinurl", "linkedin_url", "linkedin", "linkedin_profile", "li_url"],
  },
  {
    key: "websiteUrl",
    label: "Website URL",
    required: false,
    aliases: ["websiteurl", "website_url", "website", "url", "web", "company_website", "site"],
  },
  {
    key: "location",
    label: "Location",
    required: false,
    aliases: ["location", "city", "address", "region", "country", "state", "geography"],
  },
  { key: "industry", label: "Industry", required: false, aliases: ["industry", "sector", "vertical", "business_type"] },
  {
    key: "companySize",
    label: "Company Size",
    required: false,
    aliases: ["companysize", "company_size", "employees", "employee_count", "headcount", "size"],
  },
  {
    key: "revenue",
    label: "Revenue",
    required: false,
    aliases: ["revenue", "annual_revenue", "arr", "mrr", "company_revenue"],
  },
  {
    key: "notes",
    label: "Notes",
    required: false,
    aliases: ["notes", "note", "comments", "description", "remarks", "additional_info"],
  },
]

// Detect field type based on sample values
function detectFieldType(values: string[]): ImportColumn["detectedType"] {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  const phoneRegex = /^[\d\s\-+()]{7,}$/

  const nonEmptyValues = values.filter((v) => v && v.trim())
  if (nonEmptyValues.length === 0) return "unknown"

  // Check if mostly emails
  const emailCount = nonEmptyValues.filter((v) => emailRegex.test(v)).length
  if (emailCount / nonEmptyValues.length > 0.7) return "email"

  // Check if mostly URLs
  const urlCount = nonEmptyValues.filter((v) => urlRegex.test(v.toLowerCase())).length
  if (urlCount / nonEmptyValues.length > 0.7) return "url"

  // Check if mostly phones
  const phoneCount = nonEmptyValues.filter((v) => phoneRegex.test(v)).length
  if (phoneCount / nonEmptyValues.length > 0.7) return "phone"

  // Check if likely names (short strings, no numbers, often capitalized)
  const namePattern = nonEmptyValues.filter((v) => v.length < 30 && !/\d/.test(v) && /^[A-Z]/.test(v)).length
  if (namePattern / nonEmptyValues.length > 0.6) return "name"

  // Check if likely company names
  const companyIndicators = ["inc", "llc", "ltd", "corp", "co", "company", "group", "technologies", "solutions"]
  const companyCount = nonEmptyValues.filter((v) =>
    companyIndicators.some((ind) => v.toLowerCase().includes(ind)),
  ).length
  if (companyCount / nonEmptyValues.length > 0.3) return "company"

  return "text"
}

// Calculate confidence score for a field mapping
function calculateConfidence(
  sourceName: string,
  targetField: (typeof STANDARD_FIELDS)[0],
  detectedType: ImportColumn["detectedType"],
): number {
  const normalizedSource = sourceName.toLowerCase().replace(/[^a-z0-9]/g, "")

  // Check for exact alias match
  if (targetField.aliases.includes(normalizedSource)) {
    return 1.0
  }

  // Check for partial match
  const partialMatch = targetField.aliases.some(
    (alias) => normalizedSource.includes(alias) || alias.includes(normalizedSource),
  )
  if (partialMatch) {
    return 0.8
  }

  // Check if detected type matches expected type
  const typeMatches: Record<string, ImportColumn["detectedType"][]> = {
    email: ["email"],
    firstName: ["name"],
    lastName: ["name"],
    fullName: ["name"],
    company: ["company", "text"],
    jobTitle: ["text"],
    phone: ["phone"],
    linkedinUrl: ["url"],
    websiteUrl: ["url"],
    location: ["text"],
    industry: ["text"],
    companySize: ["text"],
    revenue: ["text"],
    notes: ["text"],
  }

  if (typeMatches[targetField.key]?.includes(detectedType)) {
    return 0.5
  }

  return 0
}

// Main function to analyze and suggest field mappings
export function analyzeImportData(headers: string[], rows: string[][]): MappingResult {
  const columns: ImportColumn[] = headers.map((header, index) => {
    const sampleValues = rows.slice(0, 10).map((row) => row[index] || "")
    return {
      name: header,
      sampleValues,
      detectedType: detectFieldType(sampleValues),
    }
  })

  const suggestedMappings: FieldMapping[] = []
  const mappedTargets = new Set<string>()
  const mappedSources = new Set<string>()

  // First pass: high confidence mappings
  for (const column of columns) {
    let bestMatch: FieldMapping | null = null
    let bestConfidence = 0

    for (const field of STANDARD_FIELDS) {
      if (mappedTargets.has(field.key)) continue

      const confidence = calculateConfidence(column.name, field, column.detectedType)
      if (confidence > bestConfidence && confidence >= 0.5) {
        bestConfidence = confidence
        bestMatch = {
          sourceField: column.name,
          targetField: field.key,
          confidence,
          isCustomField: false,
        }
      }
    }

    if (bestMatch && bestConfidence >= 0.5) {
      suggestedMappings.push(bestMatch)
      mappedTargets.add(bestMatch.targetField)
      mappedSources.add(bestMatch.sourceField)
    }
  }

  // Identify unmapped columns (potential custom fields)
  const unmappedColumns = columns.filter((col) => !mappedSources.has(col.name)).map((col) => col.name)

  // Suggest custom fields for unmapped columns
  const customFields = unmappedColumns.map((col) => {
    // Create a sanitized field key
    return col
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
  })

  // Calculate overall confidence
  const totalConfidence = suggestedMappings.reduce((sum, m) => sum + m.confidence, 0)
  const avgConfidence = suggestedMappings.length > 0 ? totalConfidence / suggestedMappings.length : 0

  return {
    columns,
    suggestedMappings,
    unmappedColumns,
    customFields,
    confidence: avgConfidence,
  }
}

export function detectFieldMappings(
  headers: string[],
): MappingResult & { mappings: FieldMapping[]; confidence: number } {
  // Get sample rows (empty for now, we'll use header-based detection)
  const emptyRows: string[][] = []
  const result = analyzeImportData(headers, emptyRows)

  // Calculate overall confidence
  const totalConfidence = result.suggestedMappings.reduce((sum, m) => sum + m.confidence, 0)
  const avgConfidence = result.suggestedMappings.length > 0 ? totalConfidence / result.suggestedMappings.length : 0

  return {
    ...result,
    mappings: result.suggestedMappings,
    confidence: avgConfidence,
  }
}

// Parse full name into first and last name
export function parseFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 0) return { firstName: "", lastName: "" }
  if (parts.length === 1) return { firstName: parts[0], lastName: "" }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

// Apply field mappings to transform imported data
export function applyFieldMappings(
  headers: string[],
  rows: string[][],
  mappings: FieldMapping[],
): Array<Record<string, string>> {
  const mappingLookup = new Map(mappings.map((m) => [m.sourceField, m]))

  return rows.map((row) => {
    const record: Record<string, string> = {}

    headers.forEach((header, index) => {
      const value = row[index] || ""
      const mapping = mappingLookup.get(header)

      if (mapping) {
        // Handle special case: fullName should split into firstName/lastName
        if (mapping.targetField === "fullName") {
          const { firstName, lastName } = parseFullName(value)
          if (!record.firstName) record.firstName = firstName
          if (!record.lastName) record.lastName = lastName
        } else {
          record[mapping.targetField] = value
        }
      } else {
        // Store as custom field with the original header as key
        const customKey = `custom_${header.toLowerCase().replace(/[^a-z0-9]/g, "_")}`
        record[customKey] = value
      }
    })

    return record
  })
}
