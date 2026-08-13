import { InvalidRequestError } from "../../node/api/models.errors"

/**
 * Return current epoch timestamp in either milliseconds or seconds.
 *
 * @param regime - Choose between "millisecond" (default) or "second" format.
 * @returns Current epoch timestamp as a number.
 */
export const nowTimestamp = (regime: "milisecond" | "second" = "milisecond"): number => {
  const timestamp = Date.now()

  // Convert to seconds if requested, otherwise return milliseconds
  return regime === "second" ? Math.round((timestamp / 1000)) : timestamp
}

/**
 * Return current epoch timestamp in seconds plus an offset.
 *
 * @param secondsToAdd - Number of seconds to add from now (use negative for past).
 * @returns Future (or past) timestamp in seconds.
 */
export const nowPlusTime = (secondsToAdd: number) => {
  return Math.round(Date.now() / 1000 + secondsToAdd)
}

/**
 * Convert an epoch timestamp to ISO 8601 string format.
 *
 * @param epochValue - Epoch timestamp in milliseconds.
 * @returns ISO 8601 formatted date string.
 */
export const epochToIsoFormat = (epochValue: number) => new Date(epochValue).toISOString()

/**
 * Return current time as an ISO 8601 string.
 *
 * @returns Current timestamp in ISO 8601 format.
 */
export const nowTimestampIso = () => {
  const timestamp = new Date().toISOString()

  return timestamp as string
}

/**
 * Check if a string is a valid ISO 8601 date format.
 *
 * @param dateToCheck - String to validate as ISO date.
 * @returns True if the string matches ISO 8601 format, false otherwise.
 */
 export const hasIsoFormat = (dateToCheck: string) => {
  try{
    const toDate = new Date(Date.parse(dateToCheck))

    // Verify that round-tripping through Date preserves the original string
    const isoCheck = toDate.toISOString().includes(dateToCheck)
 
    return isoCheck
  }
  catch{
    return false
  }
}

/**
 * Convert an ISO 8601 date string to a millisecond timestamp.
 *
 * @param isoDate - Date in ISO 8601 format.
 * @returns Timestamp in milliseconds.
 */
export const isoDateToTimestamp = (isoDate: string) => new Date(isoDate).getTime()

/**
 * Parse an ISO 8601 time interval (from/to) into a tuple of millisecond timestamps.
 *
 * Supports formats: "YYYY-MM-DD/YYYY-MM-DD" or a single year "YYYY".
 *
 * @param interval - ISO 8601 interval string (e.g. "2025-01-01/2025-12-31" or "2025").
 * @returns Tuple [fromTimestamp, toTimestamp] in milliseconds.
 * @throws {InvalidRequestError} If the interval has more than two parts or is not valid ISO 8601.
 */
export const isoIntervalToTimestamps = (interval: string): [number, number] => {

  // Split the interval into two parts
  const intervals = interval.split("/")

  // Single year interval — expand to full year range and recurse
  if (intervals.length == 1) {
    const newIso = `${interval}-01-01/${interval}-12-31`

    return isoIntervalToTimestamps(newIso)
  }

  // Reject intervals with more than two parts or empty
  else if (intervals.length > 2 || intervals.length < 1)
    throw new InvalidRequestError("Interval can have only two parameters")

  // Valid two-part interval — validate each part and convert to timestamps
  else {
    if (!intervals.every(interval => hasIsoFormat(interval)))
      throw new InvalidRequestError("Parameter intervalIso is not ISO 8601 time interval (date01/date02) or year");

    const [int1, int2] = intervals.map(intervalIso => {
      const cleared = intervalIso.replace(" ", "")

      return isoDateToTimestamp(cleared)
    })

    return [int1, int2]
  }
}
