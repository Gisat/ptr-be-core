import { DateTime } from "luxon"
import { InvalidRequestError } from "../../node/api/errors.api"

/**
 * Return epoch timestamp
 * @param regime Set if you want milisecond format or second format
 * @returns 
 */
export const nowTimestamp = (regime: "milisecond" | "second" = "milisecond"): number => {
  const timestamp = DateTime.now().toMillis()
  return regime === "second" ? Math.round((timestamp / 1000)) : timestamp
}

/**
 * Return now local timestamp plus number of seconds to add
 * @param secondsToAdd Seconds to add from now (1 = now + 1 sec.)
 * @returns Timestamp of the future (past) on seconds
 */
export const nowPlusTime = (secondsToAdd: number) => {
  return Math.round(DateTime.now().plus({seconds: secondsToAdd}).toSeconds())
}

/**
 * Convert epoch time value into ISO format
 * @param epochValue Epoch value of the timestamp
 * @returns ISO format of the date
 */
export const epochToIsoFormat = (epochValue: number) => DateTime.fromMillis(epochValue).toISO() as string

/**
 * Return epoch timestamp
 * @param regime Set if you want milisecond format or second format
 * @returns 
 */
export const nowTimestampIso = () => {
  const timestamp = DateTime.now().toISO()
  return timestamp as string
}

/**
 * Check if input date is valid for ISO format
 * @param dateToCheck 
 * @returns 
 */
 export const hasIsoFormat = (dateToCheck: string) => {
  try{
    const toDate = new Date(Date.parse(dateToCheck))
    const isoCheck = toDate.toISOString().includes(dateToCheck) 
    return isoCheck
  }
  catch{
    return false
  }
}

/**
 * Convert date in ISO formtat to milisecond timestamp
 * @param isoDate Date in ISO 8601 format
 * @returns Timestamp representing the date in miliseconds
 */
export const isoDateToTimestamp = (isoDate: string) => DateTime.fromISO(isoDate).toMillis()

/**
 * Format ISO 8601 interval to from-to values
 * @param interval Defined inteval in ISO format (from/to) of the UTC
 * @returns Tuple - from timestamp and to timestamp
 */
export const isoIntervalToTimestamps = (interval: string): [number, number] => {

  // Split the interval into two parts
  const intervals = interval.split("/")

  // interval as a single year has just one part
  if (intervals.length == 1) {
    const newIso = `${interval}-01-01/${interval}-12-31`
    return isoIntervalToTimestamps(newIso)
  }

  // interval with two parts or less than one
  else if (intervals.length > 2 || intervals.length < 1)
    throw new InvalidRequestError("Interval can have only two parameters")

  // valid interval with two parts
  else {
    if (!intervals.every(interval => hasIsoFormat(interval)))
      throw new InvalidRequestError("Parameter utcIntervalIso is not ISO 8601 time interval (date01/date02) or year");

    const [int1, int2] = intervals.map(intervalIso => {
      const cleared = intervalIso.replace(" ", "")
      return isoDateToTimestamp(cleared)
    })

    return [int1, int2]
  }
}
