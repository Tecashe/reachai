import Papa from "papaparse"
import { z } from "zod"

const prospectSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  location: z.string().optional(),
  industry: z.string().optional(),
})

export type ProspectCSVRow = z.infer<typeof prospectSchema>

interface ParseResult {
  success: boolean
  data?: ProspectCSVRow[]
  errors?: string[]
  stats?: {
    total: number
    valid: number
    invalid: number
    duplicates: number
  }
}

export async function parseProspectCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const errors: string[] = []
    const validRows: ProspectCSVRow[] = []
    const seenEmails = new Set<string>()
    let totalRows = 0
    let invalidRows = 0
    let duplicateRows = 0

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names
        const normalized = header.toLowerCase().trim().replace(/\s+/g, "")
        const mapping: Record<string, string> = {
          email: "email",
          emailaddress: "email",
          firstname: "firstName",
          first_name: "firstName",
          lastname: "lastName",
          last_name: "lastName",
          company: "company",
          companyname: "company",
          jobtitle: "jobTitle",
          job_title: "jobTitle",
          title: "jobTitle",
          linkedin: "linkedinUrl",
          linkedinurl: "linkedinUrl",
          website: "websiteUrl",
          websiteurl: "websiteUrl",
          companywebsite: "websiteUrl",
          phone: "phoneNumber",
          phonenumber: "phoneNumber",
          location: "location",
          city: "location",
          industry: "industry",
        }
        return mapping[normalized] || header
      },
      complete: (results) => {
        totalRows = results.data.length

        results.data.forEach((row: any, index) => {
          try {
            // Validate row
            const validated = prospectSchema.parse(row)

            // Check for duplicates
            if (seenEmails.has(validated.email.toLowerCase())) {
              duplicateRows++
              errors.push(`Row ${index + 2}: Duplicate email ${validated.email}`)
              return
            }

            seenEmails.add(validated.email.toLowerCase())
            validRows.push(validated)
          } catch (error) {
            invalidRows++
            if (error instanceof z.ZodError) {
              const issues = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
              errors.push(`Row ${index + 2}: ${issues}`)
            } else {
              errors.push(`Row ${index + 2}: Invalid data`)
            }
          }
        })

        resolve({
          success: validRows.length > 0,
          data: validRows,
          errors: errors.length > 0 ? errors : undefined,
          stats: {
            total: totalRows,
            valid: validRows.length,
            invalid: invalidRows,
            duplicates: duplicateRows,
          },
        })
      },
      error: (error) => {
        resolve({
          success: false,
          errors: [error.message],
        })
      },
    })
  })
}

export function generateCSVTemplate(): string {
  const headers = [
    "email",
    "firstName",
    "lastName",
    "company",
    "jobTitle",
    "linkedinUrl",
    "websiteUrl",
    "phoneNumber",
    "location",
    "industry",
  ]

  const sampleRow = [
    "john.doe@example.com",
    "John",
    "Doe",
    "Acme Corp",
    "VP of Sales",
    "https://linkedin.com/in/johndoe",
    "https://acmecorp.com",
    "+1-555-0123",
    "San Francisco, CA",
    "Technology",
  ]

  return `${headers.join(",")}\n${sampleRow.join(",")}`
}

export function downloadCSVTemplate() {
  const csv = generateCSVTemplate()
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "prospect-template.csv"
  link.click()
  URL.revokeObjectURL(url)
}
