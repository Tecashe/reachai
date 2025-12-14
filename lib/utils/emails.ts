// /**
//  * Strips HTML tags and converts HTML to plain text
//  * @param html - HTML string to convert
//  * @returns Clean plain text without HTML tags
//  */
// export function stripHtml(html: string): string {
//   if (!html) return ""

//   // Remove HTML tags
//   let text = html.replace(/<[^>]*>/g, " ")

//   // Decode common HTML entities
//   text = text
//     .replace(/&nbsp;/g, " ")
//     .replace(/&amp;/g, "&")
//     .replace(/&lt;/g, "<")
//     .replace(/&gt;/g, ">")
//     .replace(/&quot;/g, '"')
//     .replace(/&#39;/g, "'")
//     .replace(/&apos;/g, "'")

//   // Remove extra whitespace and normalize
//   text = text.replace(/\s+/g, " ").trim()

//   return text
// }

// /**
//  * Truncates text to a specified length with ellipsis
//  * @param text - Text to truncate
//  * @param maxLength - Maximum length before truncation
//  * @returns Truncated text with ellipsis if needed
//  */
// export function truncateText(text: string, maxLength: number): string {
//   if (!text || text.length <= maxLength) return text
//   return text.slice(0, maxLength).trim() + "..."
// }

/**
 * Strips HTML tags and converts HTML to plain text
 * @param html - HTML string to convert
 * @param preserveImages - Whether to keep img tags (default: false)
 * @returns Clean plain text without HTML tags (except images if preserveImages is true)
 */
export function stripHtml(html: string, preserveImages = false): string {
  if (!html) return ""

  let text = html

  if (preserveImages) {
    // Extract and temporarily replace img tags with placeholders
    const imgTags: string[] = []
    text = text.replace(/<img[^>]*>/gi, (match) => {
      imgTags.push(match)
      return `___IMG_PLACEHOLDER_${imgTags.length - 1}___`
    })

    // Remove all other HTML tags
    text = text.replace(/<[^>]*>/g, " ")

    // Restore img tags
    imgTags.forEach((img, index) => {
      text = text.replace(`___IMG_PLACEHOLDER_${index}___`, img)
    })
  } else {
    // Remove all HTML tags
    text = text.replace(/<[^>]*>/g, " ")
  }

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
