
import { z } from "zod"

const envSchema = z.object({
  // Db
  DATABASE_URL: z.string().url(),

  // Clerk Auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1),

  // Resend
  RESEND_API_KEY: z.string().min(1),
  // RESEND_FROM_EMAIL: z.string().email(),
  RESEND_FROM_EMAIL: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // Web Scraping Services (Optional but recommended for production)
  FIRECRAWL_API_KEY: z.string().optional(),
  APIFY_API_KEY: z.string().optional(),
  BRIGHT_DATA_API_KEY: z.string().optional(),
  NEWS_API_KEY: z.string().optional(),
  BUILTWITH_API_KEY: z.string().optional(),

  PYTHON_SCRAPER_URL: z.string().url().optional(),
  PYTHON_SCRAPER_API_KEY: z.string().optional(),

  // Email Provider OAuth (Optional)
  GMAIL_CLIENT_ID: z.string().optional(),
  GMAIL_CLIENT_SECRET: z.string().optional(),
  OUTLOOK_CLIENT_ID: z.string().optional(),
  OUTLOOK_CLIENT_SECRET: z.string().optional(),

  // CRM OAuth environment variables
  HUBSPOT_CLIENT_ID: z.string().optional(),
  HUBSPOT_CLIENT_SECRET: z.string().optional(),

  SALESFORCE_CLIENT_ID: z.string().optional(),
  SALESFORCE_CLIENT_SECRET: z.string().optional(),
  SALESFORCE_LOGIN_URL: z.string().url().optional().default("https://sign-in.salesforce.com"),

  PIPEDRIVE_CLIENT_ID: z.string().optional(),
  PIPEDRIVE_CLIENT_SECRET: z.string().optional(),

  ENCRYPTION_KEY: z.string().min(32).optional(),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map((e) => e.path.join(".")).join(", ")
      throw new Error(`Missing or invalid environment variables: ${missing}`)
    }
    throw error
  }
}

// Validate on module load in production
if (process.env.NODE_ENV === "production") {
  validateEnv()
}

export const env = process.env as unknown as Env
