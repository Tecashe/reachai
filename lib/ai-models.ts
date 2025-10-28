// AI Model Configuration and Pricing

export type AIModel = {
  id: string
  name: string
  provider: "openai" | "anthropic" | "google"
  category: "fast" | "balanced" | "quality"
  costPer1kTokens: number
  description: string
  bestFor: string[]
  maxTokens: number
}

export const AI_MODELS: Record<string, AIModel> = {
  "gpt-4o-mini": {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    category: "fast",
    costPer1kTokens: 0.00015,
    description: "Fast and cost-effective for most tasks",
    bestFor: ["Research", "Reply Detection", "Quick Analysis"],
    maxTokens: 128000,
  },
  "gpt-4o": {
    id: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    category: "quality",
    costPer1kTokens: 0.0025,
    description: "Best reasoning and complex analysis",
    bestFor: ["Email Optimization", "Advanced Analytics", "Complex Research"],
    maxTokens: 128000,
  },
  "claude-haiku-4": {
    id: "anthropic/claude-haiku-4",
    name: "Claude Haiku 4",
    provider: "anthropic",
    category: "fast",
    costPer1kTokens: 0.00025,
    description: "Lightning fast responses",
    bestFor: ["Quick Tasks", "Categorization", "Simple Analysis"],
    maxTokens: 200000,
  },
  "claude-sonnet-4": {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    category: "balanced",
    costPer1kTokens: 0.003,
    description: "Best for writing and content generation",
    bestFor: ["Email Writing", "Content Creation", "Copywriting"],
    maxTokens: 200000,
  },
  "claude-opus-4": {
    id: "anthropic/claude-opus-4",
    name: "Claude Opus 4",
    provider: "anthropic",
    category: "quality",
    costPer1kTokens: 0.015,
    description: "Highest quality, most capable model",
    bestFor: ["Complex Writing", "Deep Analysis", "Critical Tasks"],
    maxTokens: 200000,
  },
}

export type ModelPreset = "budget" | "balanced" | "quality" | "custom"

export type ModelPreferences = {
  preset: ModelPreset
  research: string
  emailGeneration: string
  emailOptimization: string
  replyDetection: string
  analytics: string
}

export const MODEL_PRESETS: Record<ModelPreset, Omit<ModelPreferences, "preset">> = {
  budget: {
    research: "gpt-4o-mini",
    emailGeneration: "claude-haiku-4",
    emailOptimization: "gpt-4o-mini",
    replyDetection: "gpt-4o-mini",
    analytics: "gpt-4o-mini",
  },
  balanced: {
    research: "gpt-4o-mini",
    emailGeneration: "claude-sonnet-4",
    emailOptimization: "gpt-4o",
    replyDetection: "gpt-4o-mini",
    analytics: "gpt-4o",
  },
  quality: {
    research: "gpt-4o",
    emailGeneration: "claude-opus-4",
    emailOptimization: "gpt-4o",
    replyDetection: "gpt-4o",
    analytics: "gpt-4o",
  },
  custom: {
    research: "gpt-4o-mini",
    emailGeneration: "claude-sonnet-4",
    emailOptimization: "gpt-4o",
    replyDetection: "gpt-4o-mini",
    analytics: "gpt-4o",
  },
}

export function getModelForTask(
  task: keyof Omit<ModelPreferences, "preset">,
  userPreferences?: ModelPreferences,
): string {
  if (!userPreferences) {
    return MODEL_PRESETS.balanced[task]
  }

  return userPreferences[task] || MODEL_PRESETS.balanced[task]
}

export function estimateAICost(tokens: number, modelId: string): number {
  const model = Object.values(AI_MODELS).find((m) => m.id === modelId)
  if (!model) return 0

  return (tokens / 1000) * model.costPer1kTokens
}

export function getModelsByCategory(category: AIModel["category"]): AIModel[] {
  return Object.values(AI_MODELS).filter((m) => m.category === category)
}
