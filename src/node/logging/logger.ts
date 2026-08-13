import { hostname } from 'node:os'

/**
 * Log levels supported by the native logger, ordered from least to most severe.
 */
const logLevels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const

type LogLevel = typeof logLevels[number]

const configuredLevel = process.env.LOG_LEVEL?.toLowerCase()

const logLevel: LogLevel = logLevels.includes(configuredLevel as LogLevel)
  ? configuredLevel as LogLevel
  : 'info'

const logLevelThreshold = logLevels.indexOf(logLevel)

const consoleMethods: Record<Exclude<LogLevel, 'silent'>, (...data: any[]) => void> = {
  trace: console.debug,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
  fatal: console.error,
}

/**
 * Serialize metadata while safely handling values unsupported by JSON.stringify.
 */
const serialize = (entry: Record<string, any>): string => {
  const ancestors: object[] = []

  return JSON.stringify(entry, function (_key, value) {
    if (typeof value === 'bigint') return Number(value)

    if (typeof value === 'object' && value !== null) {
      while (ancestors.length > 0 && ancestors.at(-1) !== this) ancestors.pop()

      if (ancestors.includes(value)) return '[Circular]'
      ancestors.push(value)
    }

    return value
  })
}

/**
 * Emit one newline-delimited JSON record through the native console.
 */
const log = (
  level: Exclude<LogLevel, 'silent'>,
  label: string,
  message: string,
  options: Record<string, any>,
): void => {
  if (logLevels.indexOf(level) < logLevelThreshold) return

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
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable log message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyInfo = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('info', label, message, options)
}


/**
 * Log a debug-level message.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable debug message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyDebug = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('debug', label, message, options)
}


/**
 * Log a warning-level message.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable warning message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyWarn = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('warn', label, message, options)
}


/**
 * Log a trace-level message.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable trace message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyTrace = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('trace', label, message, options)
}


/**
 * Log a fatal message.
 *
 * Use for unrecoverable errors that will abort the process.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable fatal message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyFatal = (label: string, message: string, options: Record<string, any> = {}): void => {
  log('fatal', label, message, options)
}


/**
 * Log an error. When an `Error` instance is provided, its stack is included
 * in the logged metadata.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {Error|string} err - The error object or an error message string.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyError = (label: string, err: Error | string, options: Record<string, any> = {}): void => {
  const message = typeof err === 'string' ? err : err.message

  const extra = typeof err === 'string' ? options : { ...options, stack: err.stack }
  log('error', label, message, extra)
}


/**
 * Convenience logger for application start information.
 *
 * @param {string} host - Hostname or IP the app is bound to.
 * @param {number} port - Port number the app is listening on.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
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
 * @param {string} route - The route or URL path requested.
 * @param {string} method - HTTP method (GET, POST, etc.).
 * @param {Record<string, any>} [options={}] - Additional metadata to include (e.g., headers, id).
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
 * @param {string} route - The route or URL path the response corresponds to.
 * @param {string} method - HTTP method (GET, POST, etc.).
 * @param {number} status - HTTP status code returned.
 * @param {Record<string, any>} [options={}] - Additional metadata to include (e.g., timings).
 */
export const loggyResponseSent = (
  route: string,
  method: string,
  status: number,
  options: Record<string, any> = {}) => {
  loggyInfo("Response Sent", `${status}: ${route}`, { ...options, method })
}
