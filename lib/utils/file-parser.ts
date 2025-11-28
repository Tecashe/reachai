// Utility for parsing CSV and Excel files

export interface ParsedFile {
  headers: string[]
  rows: string[][]
  totalRows: number
  errors: string[]
}

// Parse CSV file
export async function parseCSV(file: File): Promise<ParsedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const lines = text.split(/\r?\n/).filter((line) => line.trim())

        if (lines.length === 0) {
          resolve({ headers: [], rows: [], totalRows: 0, errors: ["File is empty"] })
          return
        }

        // Detect delimiter (comma, semicolon, tab)
        const firstLine = lines[0]
        let delimiter = ","
        if (firstLine.includes(";") && !firstLine.includes(",")) {
          delimiter = ";"
        } else if (firstLine.includes("\t") && !firstLine.includes(",")) {
          delimiter = "\t"
        }

        // Parse headers
        const headers = parseCSVLine(firstLine, delimiter)

        // Parse rows
        const rows: string[][] = []
        const errors: string[] = []

        for (let i = 1; i < lines.length; i++) {
          try {
            const row = parseCSVLine(lines[i], delimiter)
            // Pad row with empty strings if it has fewer columns than headers
            while (row.length < headers.length) {
              row.push("")
            }
            // Trim row if it has more columns than headers
            rows.push(row.slice(0, headers.length))
          } catch (e) {
            errors.push(`Error parsing row ${i + 1}: ${e}`)
          }
        }

        resolve({
          headers,
          rows,
          totalRows: rows.length,
          errors,
        })
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsText(file)
  })
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i++
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  // Don't forget the last field
  result.push(current.trim())

  return result
}

// Parse Excel file - simplified version without xlsx dependency
export async function parseExcel(file: File): Promise<ParsedFile> {
  // For now, we'll treat Excel files as CSV if they're small
  // In production, you'd use the xlsx library
  console.warn("Excel parsing is limited - consider converting to CSV")
  return parseCSV(file)
}

// Detect file type and parse accordingly
export async function parseFile(file: File): Promise<ParsedFile> {
  const extension = file.name.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "csv":
    case "txt":
      return parseCSV(file)
    case "xlsx":
    case "xls":
      // For xlsx files, we'd need the xlsx library
      // For now, show a helpful message
      throw new Error("Excel files (.xlsx, .xls) require additional setup. Please export as CSV for now.")
    default:
      throw new Error(`Unsupported file type: .${extension}. Please upload a CSV file.`)
  }
}

// Get supported file extensions
export function getSupportedExtensions(): string[] {
  return [".csv", ".txt"]
}

// Validate file before parsing
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const supportedExtensions = [".csv", ".txt", ".xlsx", ".xls"]
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`

  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 10MB limit" }
  }

  if (!supportedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file type. Please upload: ${supportedExtensions.join(", ")}`,
    }
  }

  return { valid: true }
}
