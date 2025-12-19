
type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    // In production, you'd send this to a logging service like Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === "production") {
      // TODO: Send to logging service
      console[level === "error" ? "error" : "log"](JSON.stringify(entry))
    } else {
      // Development: pretty print
      const emoji = {
        info: "ℹ️",
        warn: "⚠️",
        error: "❌",
        debug: "🐛",
      }[level]

      console[level === "error" ? "error" : "log"](
        `${emoji} [${level.toUpperCase()}] ${message}`,
        context || "",
        error || "",
      )
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log("info", message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log("warn", message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log("error", message, context, error)
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, context)
    }
  }
}

export const logger = new Logger()
