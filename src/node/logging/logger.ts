// logger.ts
import pino from 'pino'


/**
 * Shared pino logger instance used by all logging functions.
 *
 * The logger uses ISO timestamps and a simple level formatter that exposes
 * the textual level as the `level` property on emitted objects.
 */
const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label, number) {
      return { level: label }
    }
  }
})


/**
 * Log an informational message.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable log message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyInfo = (label: string, message: string, options: Record<string, any> = {}): void => {
  logger.info({ ...options, label, message })
}


/**
 * Log a debug-level message.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable debug message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyDebug = (label: string, message: string, options: Record<string, any> = {}): void => {
  logger.debug({ ...options, label, message })
}


/**
 * Log a warning-level message.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable warning message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyWarn = (label: string, message: string, options: Record<string, any> = {}): void => {
  logger.warn({ ...options, label, message })
}


/**
 * Log a trace-level message.
 *
 * @param {string} label - Short label or category for the log entry.
 * @param {string} message - Human-readable trace message.
 * @param {Record<string, any>} [options={}] - Additional metadata to include.
 */
export const loggyTrace = (label: string, message: string, options: Record<string, any> = {}): void => {
  logger.trace({ ...options, label, message })
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
  logger.fatal({ ...options, label, message })
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
  logger.error({ ...extra, label, message })
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
  loggyInfo("Request Recieved", `${method}: ${route}`, options)
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