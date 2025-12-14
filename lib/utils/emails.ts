/**
 * Strips HTML tags and converts HTML to plain text
 * @param html - HTML string to convert
 * @returns Clean plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (!html) return ""

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, " ")

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")

  // Remove extra whitespace and normalize
  text = text.replace(/\s+/g, " ").trim()

  return text
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}
