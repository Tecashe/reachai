// Image optimization utilities for cold email images

interface ImageOptimizationResult {
  file: File
  originalSize: number
  compressedSize: number
  dimensions: { width: number; height: number }
  compressionRatio: number
}

/**
 * Get image dimensions from a file
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }

    img.src = url
  })
}

/**
 * Compress image to target size and dimensions
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
    targetSizeKB?: number
  } = {},
): Promise<ImageOptimizationResult> {
  const { maxWidth = 600, maxHeight = 800, quality = 0.8, targetSizeKB = 100 } = options

  const originalSize = file.size
  const dimensions = await getImageDimensions(file)

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = async () => {
      URL.revokeObjectURL(url)

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      // Create canvas for compression
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        return
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)

      // Try multiple quality levels to hit target size
      let currentQuality = quality
      let compressedBlob: Blob | null = null

      for (let i = 0; i < 5; i++) {
        compressedBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, file.type, currentQuality)
        })

        if (!compressedBlob) break

        // If we're under target size or quality is too low, stop
        if (compressedBlob.size <= targetSizeKB * 1024 || currentQuality <= 0.3) {
          break
        }

        // Reduce quality for next iteration
        currentQuality -= 0.15
      }

      if (!compressedBlob) {
        reject(new Error("Failed to compress image"))
        return
      }

      const compressedFile = new File([compressedBlob], file.name, { type: file.type })

      resolve({
        file: compressedFile,
        originalSize,
        compressedSize: compressedFile.size,
        dimensions: { width, height },
        compressionRatio: ((originalSize - compressedFile.size) / originalSize) * 100,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }

    img.src = url
  })
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B"

  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`
}

/**
 * Calculate deliverability impact score based on image properties
 */
export function calculateDeliverabilityImpact(
  size: number,
  dimensions: { width: number; height: number },
): {
  score: number // 0-100, lower is better
  level: "low" | "medium" | "high" | "critical"
  issues: string[]
} {
  const issues: string[] = []
  let score = 0

  // Size checks
  if (size > 200 * 1024) {
    score += 40
    issues.push("Image size over 200KB severely impacts deliverability")
  } else if (size > 100 * 1024) {
    score += 25
    issues.push("Image size over 100KB may trigger spam filters")
  } else if (size > 50 * 1024) {
    score += 10
    issues.push("Consider optimizing further for best deliverability")
  }

  // Dimension checks
  if (dimensions.width > 800 || dimensions.height > 1000) {
    score += 15
    issues.push("Large dimensions may slow email loading")
  } else if (dimensions.width > 600) {
    score += 5
    issues.push("Width over 600px may not display well on mobile")
  }

  // Determine level
  let level: "low" | "medium" | "high" | "critical"
  if (score >= 50) level = "critical"
  else if (score >= 30) level = "high"
  else if (score >= 15) level = "medium"
  else level = "low"

  return { score, level, issues }
}
