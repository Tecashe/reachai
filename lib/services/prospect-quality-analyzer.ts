// "use server"

// interface QualityIssue {
//   field: string
//   issue: string
//   severity: "error" | "warning" | "info"
// }

// export interface ProspectQuality {
//   score: number
//   grade: "Excellent" | "Good" | "Fair" | "Poor"
//   issues: QualityIssue[]
//   completeness: number
// }

// export function analyzeProspectQuality(prospect: any): ProspectQuality {
//   const issues: QualityIssue[] = []
//   let score = 100
//   let completenessFields = 0
//   const totalFields = 8

//   // Email validation
//   if (!prospect.email) {
//     issues.push({ field: "email", issue: "Email is required", severity: "error" })
//     score -= 30
//   } else {
//     completenessFields++
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//     if (!emailRegex.test(prospect.email)) {
//       issues.push({ field: "email", issue: "Invalid email format", severity: "error" })
//       score -= 20
//     }
//   }

//   // Name validation
//   if (!prospect.firstName) {
//     issues.push({ field: "firstName", issue: "First name is missing", severity: "warning" })
//     score -= 10
//   } else {
//     completenessFields++
//   }

//   if (!prospect.lastName) {
//     issues.push({ field: "lastName", issue: "Last name is missing", severity: "warning" })
//     score -= 10
//   } else {
//     completenessFields++
//   }

//   // Company validation
//   if (!prospect.company) {
//     issues.push({ field: "company", issue: "Company name is missing", severity: "warning" })
//     score -= 15
//   } else {
//     completenessFields++
//   }

//   // Job title validation
//   if (!prospect.jobTitle) {
//     issues.push({ field: "jobTitle", issue: "Job title is missing", severity: "info" })
//     score -= 5
//   } else {
//     completenessFields++
//   }

//   // LinkedIn validation
//   if (!prospect.linkedinUrl) {
//     issues.push({ field: "linkedinUrl", issue: "LinkedIn profile is missing", severity: "info" })
//     score -= 5
//   } else {
//     completenessFields++
//   }

//   // Website validation
//   if (!prospect.websiteUrl) {
//     issues.push({ field: "websiteUrl", issue: "Company website is missing", severity: "info" })
//     score -= 5
//   } else {
//     completenessFields++
//   }

//   // Phone validation
//   if (prospect.phoneNumber) {
//     completenessFields++
//   }

//   const completeness = Math.round((completenessFields / totalFields) * 100)

//   // Determine grade
//   let grade: "Excellent" | "Good" | "Fair" | "Poor"
//   if (score >= 90) grade = "Excellent"
//   else if (score >= 75) grade = "Good"
//   else if (score >= 60) grade = "Fair"
//   else grade = "Poor"

//   return {
//     score: Math.max(0, score),
//     grade,
//     issues,
//     completeness,
//   }
// }

interface QualityIssue {
  field: string
  issue: string
  severity: "error" | "warning" | "info"
}

export interface ProspectQuality {
  score: number
  grade: "Excellent" | "Good" | "Fair" | "Poor"
  issues: QualityIssue[]
  completeness: number
}

export function analyzeProspectQuality(prospect: any): ProspectQuality {
  const issues: QualityIssue[] = []
  let score = 100
  let completenessFields = 0
  const totalFields = 8

  // Email validation
  if (!prospect.email) {
    issues.push({ field: "email", issue: "Email is required", severity: "error" })
    score -= 30
  } else {
    completenessFields++
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(prospect.email)) {
      issues.push({ field: "email", issue: "Invalid email format", severity: "error" })
      score -= 20
    }
  }

  // Name validation
  if (!prospect.firstName) {
    issues.push({ field: "firstName", issue: "First name is missing", severity: "warning" })
    score -= 10
  } else {
    completenessFields++
  }

  if (!prospect.lastName) {
    issues.push({ field: "lastName", issue: "Last name is missing", severity: "warning" })
    score -= 10
  } else {
    completenessFields++
  }

  // Company validation
  if (!prospect.company) {
    issues.push({ field: "company", issue: "Company name is missing", severity: "warning" })
    score -= 15
  } else {
    completenessFields++
  }

  // Job title validation
  if (!prospect.jobTitle) {
    issues.push({ field: "jobTitle", issue: "Job title is missing", severity: "info" })
    score -= 5
  } else {
    completenessFields++
  }

  // LinkedIn validation
  if (!prospect.linkedinUrl) {
    issues.push({ field: "linkedinUrl", issue: "LinkedIn profile is missing", severity: "info" })
    score -= 5
  } else {
    completenessFields++
  }

  // Website validation
  if (!prospect.websiteUrl) {
    issues.push({ field: "websiteUrl", issue: "Company website is missing", severity: "info" })
    score -= 5
  } else {
    completenessFields++
  }

  // Phone validation
  if (prospect.phoneNumber) {
    completenessFields++
  }

  const completeness = Math.round((completenessFields / totalFields) * 100)

  // Determine grade
  let grade: "Excellent" | "Good" | "Fair" | "Poor"
  if (score >= 90) grade = "Excellent"
  else if (score >= 75) grade = "Good"
  else if (score >= 60) grade = "Fair"
  else grade = "Poor"

  return {
    score: Math.max(0, score),
    grade,
    issues,
    completeness,
  }
}