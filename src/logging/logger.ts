import pino from "pino";
/**
 * @typedef {Object} AppLogOptions
 * @property {string} label - The label for the log entry.
 * @property {string | number | boolean} [key] - Additional log entry properties.
 */
export type AppLogOptions = {
    label: string
    [key: string]: string | number | boolean
}

/**
 * Default log options.
 * @type {AppLogOptions}
 */
const DEFAULT_LOG_OPTIONS: AppLogOptions = {
    label: "App"
}

/**
 * A utility class for application logging using the Pino logger.
 * Provides static methods for different log levels with formatted output.
 * 
 * @class AppLogger
 * @static
 * 
 * @property {pino.Logger} logger - The internal Pino logger instance configured with pretty printing
 * @method info - Logs an informational message
 * @method error - Logs an error message
 * @method warn - Logs a warning message
 */
export class AppLogger {

    /**
     * The internal Pino logger instance configured with pretty printing.
     * @type {pino.Logger}
     * @private
     */
    static initLogger(): pino.Logger {
        return pino({
            name: undefined,
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    levelFirst: true,
                    translateTime: 'yyyy-mm-dd HH:MM:ss'
                }
            }
        });
    }

    /**
     * Logs an informational message.
     * @param {string} message - The message to log.
     * @param {AppLogOptions} [options=DEFAULT_LOG_OPTIONS] - Additional log options.
     * @static
     */
    public static info(message: string, options: AppLogOptions = DEFAULT_LOG_OPTIONS) {
        AppLogger.initLogger().info({
            ...options,
            message
        });
    }

    /**
     * Logs a warning message.
     * @param {string} message - The message to log.
     * @param {AppLogOptions} [options=DEFAULT_LOG_OPTIONS] - Additional log options.
     * @static
     */
    public static warn(message: string, options: AppLogOptions = DEFAULT_LOG_OPTIONS) {
        AppLogger.initLogger().warn({
            ...options,
            message
        });
    }

    /**
     * Logs an error message.
     * @param {string} message - The message to log.
     * @param {AppLogOptions} [options=DEFAULT_LOG_OPTIONS] - Additional log options.
     * @static
     */
    public static error(message: string, options: AppLogOptions = DEFAULT_LOG_OPTIONS) {
        AppLogger.initLogger().error({
            ...options,
            message
        });
    }

    /**
     * Logs the application start message.
     * @param {string} host - The host where the application is running.
     * @param {number} port - The port where the application is running.
     * @param {AppLogOptions} [options=DEFAULT_LOG_OPTIONS] - Additional log options.
     * @static
     */
    public static appStart(host: string, port: number, options: AppLogOptions = DEFAULT_LOG_OPTIONS) {
        AppLogger.info(`Application started on ${host}:${port}`, options);
    }
}

// Functional alternative, better for config, but looks more verbose
// export const AppLog = (name: string) => {
//     const pinoLogger = pino({
//         name,
//         transport: {
//             target: 'pino-pretty',
//             options: {
//                 colorize: true,
//                 levelFirst: true,
//                 translateTime: 'yyyy-mm-dd HH:MM:ss'
//             }
//         }
//     });

//     const info = (message: string, options: AppLogOptions = DEFAULT_LOG_OPTIONS) => {
//         pinoLogger.info({
//             ...options,
//             message
//         });
//     }

//     return {
//         info
//     }
// }