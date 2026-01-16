
// type LogLevel = "info" | "warn" | "error" | "debug"

// interface LogEntry {
//   level: LogLevel
//   message: string
//   timestamp: string
//   context?: Record<string, any>
//   error?: Error
// }

// class Logger {
//   private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
//     const entry: LogEntry = {
//       level,
//       message,
//       timestamp: new Date().toISOString(),
//       context,
//       error,
//     }

//     // In production, you'd send this to a logging service like Sentry, LogRocket, etc.
//     if (process.env.NODE_ENV === "production") {
//       // TODO: Send to logging service
//       console[level === "error" ? "error" : "log"](JSON.stringify(entry))
//     } else {
//       // Development: pretty print
//       const emoji = {
//         info: "ℹ️",
//         warn: "⚠️",
//         error: "❌",
//         debug: "🐛",
//       }[level]

//       console[level === "error" ? "error" : "log"](
//         `${emoji} [${level.toUpperCase()}] ${message}`,
//         context || "",
//         error || "",
//       )
//     }
//   }

//   info(message: string, context?: Record<string, any>) {
//     this.log("info", message, context)
//   }

//   warn(message: string, context?: Record<string, any>) {
//     this.log("warn", message, context)
//   }

//   error(message: string, error?: Error, context?: Record<string, any>) {
//     this.log("error", message, context, error)
//   }

//   debug(message: string, context?: Record<string, any>) {
//     if (process.env.NODE_ENV === "development") {
//       this.log("debug", message, context)
//     }
//   }
// }

// export const logger = new Logger()


type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error | string
}

class Logger {
  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error | unknown) {
    // Normalize error to Error object or string
    let normalizedError: Error | string | undefined
    if (error instanceof Error) {
      normalizedError = error
    } else if (error) {
      normalizedError = String(error)
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: normalizedError,
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

  // Updated to accept error in context OR as second parameter
  error(message: string, contextOrError?: Record<string, any> | Error | unknown, context?: Record<string, any>) {
    // If second param is an Error or looks like an error, treat it as such
    if (contextOrError instanceof Error || (contextOrError && typeof contextOrError === 'object' && 'message' in contextOrError)) {
      this.log("error", message, context, contextOrError)
    } else {
      // Otherwise, treat it as context
      this.log("error", message, contextOrError as Record<string, any>)
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV === "development") {
      this.log("debug", message, context)
    }
  }
}

export const logger = new Logger()