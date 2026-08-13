/**
 * Enum representing the names of headers used in API requests.
 */
export enum UsedHeaderNames {
  IgnoreCache = "ignore-cache",
  ResultFrom = "result-from",
  Sid = "sid"
}

/**
 * Enum representing the possible values for headers used in API responses.
 */
export enum UsedHeaderValues {
  ResultFromStorage = "storage",
  ResultFromCache = "cache",
}