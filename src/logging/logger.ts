// logger.ts
import pino, { Logger } from 'pino'
import pretty from 'pino-pretty'

/**
 * @typedef {Object} AppLogOptions
 * @property {string} label       - The label for the log entry.
 * @property {string|number|boolean} [key] - Any extra fields.
 */
export type AppLogOptions = {
  label: string
  [key: string]: string|number|boolean
}

const DEFAULT_LOG_OPTIONS: AppLogOptions = {
  label: 'App'
}

// create the pretty‐printing stream once
const prettyStream = pretty({
  colorize: true,
  levelFirst: true,
  translateTime: 'yyyy-mm-dd HH:MM:ss'
})

// create your logger once and for all
const baseLogger: Logger = pino({}, prettyStream)

export class AppLogger {
  static info(
    message: string,
    options: AppLogOptions = DEFAULT_LOG_OPTIONS,
  ) {
    baseLogger.info({ ...options, message })
  }

  static warn(
    message: string,
    options: AppLogOptions = DEFAULT_LOG_OPTIONS,
  ) {
    baseLogger.warn({ ...options, message })
  }

  static error(
    message: string,
    options: AppLogOptions = DEFAULT_LOG_OPTIONS,
  ) {
    baseLogger.error({ ...options, message })
  }

  static appStart(
    host: string,
    port: number,
    options: AppLogOptions = DEFAULT_LOG_OPTIONS,
  ) {
    AppLogger.info(`Application started on ${host}:${port}`, options)
  }
}