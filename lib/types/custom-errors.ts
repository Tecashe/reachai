export class WarmupError extends Error {
  warmupEmailId?: string
  emailLogId?: string
  accountId?: string

  constructor(message: string, details?: Partial<WarmupError>) {
    super(message)
    this.name = "WarmupError"
    if (details) {
      Object.assign(this, details)
    }
  }
}

export class RetryError extends Error {
  jobId?: string
  attemptCount?: number

  constructor(message: string, details?: Partial<RetryError>) {
    super(message)
    this.name = "RetryError"
    if (details) {
      Object.assign(this, details)
    }
  }
}

export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

export function isError(error: unknown): error is Error {
  return error instanceof Error
}
