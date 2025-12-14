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
//  * @param html - HTML string to convert
//  * @param preserveImages - Whether to keep img tags (default: false)
//  * @returns Clean plain text without HTML tags (except images if preserveImages is true)
//  */
// export function stripHtml(html: string, preserveImages = false): string {
//   if (!html) return ""

//   let text = html

//   if (preserveImages) {
//     text = text.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, (match, src, alt) => {
//       const filename = src.split("/").pop() || "image"
//       return `[Image: ${alt || filename} - ${src}]`
//     })
//     text = text.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, (match, src) => {
//       const filename = src.split("/").pop() || "image"
//       return `[Image: ${filename} - ${src}]`
//     })
//   }

//   // Remove all HTML tags
//   text = text.replace(/<[^>]*>/g, " ")

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

// /**
//  * Checks if HTML content contains images
//  * @param html - HTML string to check
//  * @returns True if HTML contains img tags
//  */
// export function hasImages(html: string): boolean {
//   return /<img[^>]*>/i.test(html)
// }

// /**
//  * Extract images from HTML
//  * @param html - HTML string to extract images from
//  * @returns Array of image objects with src and alt
//  */
// export function extractImages(html: string): Array<{ src: string; alt: string }> {
//   const images: Array<{ src: string; alt: string }> = []
//   const imgRegex = /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi
//   let match: RegExpExecArray | null

//   while ((match = imgRegex.exec(html)) !== null) {
//     images.push({ src: match[1], alt: match[2] || "" })
//   }

//   // Also check for images without alt
//   const simpleImgRegex = /<img[^>]*src=["']([^"']*)["'][^>]*>/gi
//   while ((match = simpleImgRegex.exec(html)) !== null) {
//     const src = match[1]
//     if (!images.find((img) => img.src === src)) {
//       images.push({ src, alt: "" })
//     }
//   }

//   return images
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
    text = text.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, (match, src, alt) => {
      const filename = src.split("/").pop() || "image"
      return `[Image: ${alt || filename} - ${src}]`
    })
    text = text.replace(/<img[^>]*src=["']([^"']*)["'][^>]*>/gi, (match, src) => {
      const filename = src.split("/").pop() || "image"
      return `[Image: ${filename} - ${src}]`
    })
  }
  // Remove all HTML tags
  text = text.replace(/<[^>]*>/g, " ")
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

/**
 * Checks if HTML content contains images
 * @param html - HTML string to check
 * @returns True if HTML contains img tags
 */
export function hasImages(html: string): boolean {
  return /<img[^>]*>/i.test(html)
}

/**
 * Extract images from HTML
 * @param html - HTML string to extract images from
 * @returns Array of image objects with src and alt
 */
export function extractImages(html: string): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = []
  const imgRegex = /<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi
  let match: RegExpExecArray | null

  while ((match = imgRegex.exec(html)) !== null) {
    images.push({ src: match[1], alt: match[2] || "" })
  }

  // Also check for images without alt
  const simpleImgRegex = /<img[^>]*src=["']([^"']*)["'][^>]*>/gi
  while ((match = simpleImgRegex.exec(html)) !== null) {
    const src = match[1]
    if (!images.find((img) => img.src === src)) {
      images.push({ src, alt: "" })
    }
  }

  return images
}

/**
 * Checks if HTML content contains CTA buttons
 * @param html - HTML string to check
 * @returns True if HTML contains button-styled links
 */
export function hasButtons(html: string): boolean {
  return /<a[^>]*style=[^>]*padding[^>]*>/i.test(html) || /<button[^>]*>/i.test(html)
}

/**
 * Extract buttons from HTML
 * @param html - HTML string to extract buttons from
 * @returns Array of button objects with text and href
 */
export function extractButtons(html: string): Array<{ text: string; href: string }> {
  const buttons: Array<{ text: string; href: string }> = []
  const buttonRegex = /<a[^>]*href=["']([^"']*)["'][^>]*style=[^>]*padding[^>]*>([^<]*)<\/a>/gi
  let match: RegExpExecArray | null

  while ((match = buttonRegex.exec(html)) !== null) {
    buttons.push({ href: match[1], text: match[2].trim() })
  }

  return buttons
}

/**
 * Checks if HTML content has rich formatting (images or buttons)
 * @param html - HTML string to check
 * @returns True if HTML contains images or CTA buttons
 */
export function hasRichFormatting(html: string): boolean {
  return hasImages(html) || hasButtons(html)
}