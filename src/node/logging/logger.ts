import { hostname } from 'node:os'

/**
 * Log levels supported by the native logger, ordered from least to most severe.
 */
const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const

type LogLevel = typeof logLevels[number]

// Read log level from environment, default to 'info'
const configuredLevel = process.env.LOG_LEVEL?.toLowerCase()

const logLevel: LogLevel = logLevels.includes(configuredLevel as LogLevel)
  ? configuredLevel as LogLevel
  : 'info'

// Compute the numeric threshold index for filtering
const logLevelThreshold = logLevels.indexOf(logLevel)

// Map each log level to the corresponding console method
const consoleMethods: Record<Exclude<LogLevel, 'silent'>, (...data: any[]) => void> = {
  trace: console.debug,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
  fatal: console.error,
}

/**
 * Serialize a log entry object to JSON, handling bigints and circular references.
 */
const serialize = (entry: Record<string, any>): string => {
  const ancestors: object[] = []

  return JSON.stringify(entry, function (_key, value) {
    // Convert bigint to number for JSON compatibility
    if (typeof value === 'bigint') return Number(value)

    // Detect and mark circular references
    if (typeof value === 'object' && value !== null) {
      while (ancestors.length > 0 && ancestors.at(-1) !== this) ancestors.pop()

      if (ancestors.includes(value)) return '[Circular]'
      ancestors.push(value)
    }

    return value
  })
}

/**
 * Emit a single newline-delimited JSON record through the native console.
 * Skips emission if the entry's level is below the configured threshold.
 */
const log = (
  level: Exclude<LogLevel, 'silent'>,
  label: string,
  message: string,
  options: Record<string, any>,
): void => {
  // Skip if this level is below the configured threshold
  if (logLevels.indexOf(level) < logLevelThreshold) return

  // Build the structured log entry
  const entry = serialize({
    level,
    time: new Date().toISOString(),
    pid: process.pid,
    hostname: hostname(),
    ...options,
    label,
    message,
  })

  consoleMethods[level](entry)
}


/**
 * Log an informational message.
 *
 * @param label - Short label or category for the log entry.
 * @param message - Human-readable log message.
 * @param options - Additional metadata to include.
 */
export const loggyInfo = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('info', label, message, options)
}


/**
 * Log a debug-level message.
 *
 * @param label - Short label or category for the log entry.
 * @param message - Human-readable debug message.
 * @param options - Additional metadata to include.
 */
export const loggyDebug = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('debug', label, message, options)
}


/**
 * Log a warning-level message.
 *
 * @param label - Short label or category for the log entry.
 * @param message - Human-readable warning message.
 * @param options - Additional metadata to include.
 */
export const loggyWarn = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('warn', label, message, options)
}


/**
 * Log a trace-level message.
 *
 * @param label - Short label or category for the log entry.
 * @param message - Human-readable trace message.
 * @param options - Additional metadata to include.
 */
export const loggyTrace = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('trace', label, message, options)
}


/**
 * Log a fatal message.
 * Use for unrecoverable errors that will abort the process.
 *
 * @param label - Short label or category for the log entry.
 * @param message - Human-readable fatal message.
 * @param options - Additional metadata to include.
 */
export const loggyFatal = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('fatal', label, message, options)
}


/**
 * Log an error. When an Error instance is provided, its stack trace is included.
 *
 * @param label - Short label or category for the log entry.
 * @param err - The error object or an error message string.
 * @param options - Additional metadata to include.
 */
export const loggyError = (label: string, err: Error | string, options: Record<string, any> = {}): void => {
  const message = typeof err === 'string' ? err : err.message

  // Include stack trace if an Error object is provided
  const extra = typeof err === 'string' ? options : { ...options, stack: err.stack }
  log('error', label, message, extra)
}


/**
 * Convenience logger for application start information.
 *
 * @param host - Hostname or IP the app is bound to.
 * @param port - Port number the app is listening on.
 * @param options - Additional metadata to include.
 */
export const loggyAppStart = (
  host: string,
  port: number,
  options: Record<string, any> = {}) => {
  loggyInfo("Application started", `Running on ${host}:${port}`, options)
}


/**
 * Log that an HTTP request was received.
 *
 * @param route - The route or URL path requested.
 * @param method - HTTP method (GET, POST, etc.).
 * @param options - Additional metadata to include.
 */
export const loggyRequestReceived = (
  route: string,
  method: string,
  options: Record<string, any> = {}) => {
  loggyInfo("Request Received", `${method}: ${route}`, options)
}


/**
 * Log that an HTTP response was sent.
 *
 * @param route - The route or URL path the response corresponds to.
 * @param method - HTTP method.
 * @param status - HTTP status code returned.
 * @param options - Additional metadata to include.
 */
export const loggyResponseSent = (
  route: string,
  method: string,
  status: number,
  options: Record<string, any> = {}) => {
  loggyInfo("Response Sent", `${status}: ${route}`, { ...options, method })
}
