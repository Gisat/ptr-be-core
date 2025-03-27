// import Winston from "winston";
// import { nowTimestamp, epochToIsoFormat } from "../coding/code.dates";

// /**
//  * Log input model needed to generate new log record
//  */
// export interface LogInput {
//   level: UsedLogLevels
//   message?: string,
//   [key: string]: any
// }

// /**
//  * Log record used for recording events into log management and database
//  */
// export interface LogOutput extends LogInput {
//   label: UsedLogLabels | string
//   created: number,
//   createdIso: string
// }

// /**
//  * Log levels that we use
//  */
// export type UsedLogLevels = "info" | "warning" | "error"

// /**
//  * Supported log labels
//  */
// export enum UsedLogLabels {
//   ApplicationStarted = "application-started",
//   General = "general-event",
//   IncomeRequest = "income-request",
//   SentResponse = "response-send",
//   InternalError = "internal-error"
// }

// /**
//  * Props for log emmiter
//  */
// interface LogEmmiterProps {
//   useTestingMode?: boolean
//   serviceName: string
// }

// /**
//  * Application logger for collectiong and distribution of event logs
//  */
// export class AppLogger {

//   private WinstonInstance: Winston.Logger

//   /**
//    * Lets build application logger based on winston
//    * @param props Logger build props from ENV
//    */
//   constructor({ serviceName, useTestingMode }: LogEmmiterProps) {

//     const transports: Winston.transport[] = []

//     transports.push(new Winston.transports.Console())

//     const logger = Winston.createLogger({
//       levels: Winston.config.syslog.levels,
//       defaultMeta: { service: serviceName },
//       format: Winston.format.json(),
//       silent: useTestingMode,
//       transports
//     })

//     this.WinstonInstance = logger
//   }

//   /**
//    * Creates full log content from input properties
//    * @param props Log input props 
//    * @returns Full log content as an object
//    */
//   private createLogRecord({ level, label, message, ...args }: LogInput): LogOutput {
//     const now = nowTimestamp()
//     const log: LogOutput = {
//       level,
//       label,
//       created: now,
//       createdIso: epochToIsoFormat(now),
//       description: message,
//       ...args
//     }

//     return log
//   }

//   /**
//    * Record log to system logger
//    * @param logForManager Log in format for log manager
//    * @returns Log record that has been recorded
//    */
//   private recordLog(logForManager: LogOutput) {

//     const { level, ...restOfLog } = logForManager

//     switch (level) {
//       case "info":
//         this.WinstonInstance.info(restOfLog)
//         break;
//       case "warning":
//         this.WinstonInstance.warning(restOfLog)
//         break;
//       case "error":
//         this.WinstonInstance.error(restOfLog)
//         break;

//       default:
//         throw new Error("Unsupported log method");
//     }

//     return logForManager
//   }

//   /**
//    * Log some unspecific event in system
//    * @param logInput General log input from event
//    * @returns Log created by emmiter and logged to system
//    */
//   logEventInSystem = (logInput: LogInput) => {
//     const log = this.createLogRecord(logInput)
//     this.recordLog(log)
//     return log
//   }

//   /**
//    * Log application start event
//    * @param url Url where the application has tarted
//    * @returns Log created by emmiter and logged to system
//    */
//   logAppStart = (url: string) => {
//     const log = this.createLogRecord({ level: "info", label: UsedLogLabels.ApplicationStarted, url })
//     this.recordLog(log)
//     return log
//   }

//   /**
//    * Log income HTTP request event.
//    * @param requestInfo Request informations
//    * @returns Log created by emmiter and logged to system
//    */
//   logRequest(endpoint: string, method: string, requestId: string, ip: string, args?: any) {

//     const log = this.createLogRecord({
//       level: "info",
//       label: UsedLogLabels.IncomeRequest,
//       method,
//       endpoint,
//       requestId,
//       ip,
//       message: `Incoming request on ${endpoint} with method ${method}`,
//       ...args
//     })

//     this.recordLog(log)
//     return log
//   }

//   /**
//    * Log outcome HTTP response event
//    * @param responseInfo Response informations
//    * @returns Log created by emmiter and logged to system
//    */
//   logResponse(status: number, endpoint: string, method: string, requestId: string, ip: string, args?: any) {
//     let logLevel: UsedLogLevels

//     if (status < 400)
//       logLevel = "info"
//     else if (status >= 400 && status < 500)
//       logLevel = "warning"
//     else
//       logLevel = "error"

//     const log = this.createLogRecord({
//       level: logLevel,
//       label: UsedLogLabels.SentResponse,
//       status,
//       endpoint,
//       method,
//       requestId,
//       ip,
//       message: `Request with method ${method} to ${endpoint} ended with status ${status}`,
//       ...args
//     })

//     this.recordLog(log)
//     return log
//   }
// }