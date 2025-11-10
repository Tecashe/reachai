// Utility functions for prospect scoring (not server actions)

export function selectBestProspect(prospects: any[]): any {
  // Score each prospect based on data completeness
  const scored = prospects.map((p) => {
    let score = 0
    if (p.firstName) score += 10
    if (p.lastName) score += 10
    if (p.company) score += 15
    if (p.jobTitle) score += 15
    if (p.linkedinUrl) score += 20
    if (p.websiteUrl) score += 10
    if (p.qualityScore > 70) score += 20

    // Prefer prospects with engagement
    if (p.emailsOpened > 0) score += 30
    if (p.emailsReplied > 0) score += 50

    return { prospect: p, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored[0].prospect
}
