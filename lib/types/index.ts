// Re-export all sequence types
export * from "./sequence"

// Email template type for compatibility
export interface EnhancedEmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
