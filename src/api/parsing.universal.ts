import { InvalidRequestError } from "./api.errors"

/**
 * Parse listing parameters from query strings
 * @param paramsOrBody Request data contains limits and offsets
 * @param endpointLimitMaxValue Optional - maximum value for limit query string. It serves for our database and app stability
 * @returns Skip and limit integer values
 * @throws {InvalidRequestError} If limit or offset values are invalid
 */
export const parseQueryListing = (paramsOrBody: unknown, endpointLimitMaxValue = 10000) => {
    const { offset: rawOffset, limit: rawLimit } = paramsOrBody as any

    const limit = rawLimit ? parseInt(rawLimit) : 0
    const skip = rawOffset ? parseInt(rawOffset) : 0

    if (limit < 0)
        throw new InvalidRequestError("Limit must be 0 or higher")

    if (limit > endpointLimitMaxValue)
        throw new InvalidRequestError(`Limit must be less than ${endpointLimitMaxValue} for this endpoint`)

    if (skip < 0)
        throw new InvalidRequestError("Offset must be 0 or higher")

    return { skip, limit }
}

/**
 * Parse filter by key from request data
 * @param paramsOrBody Request data containing the key
 * @returns The key value
 * @throws {InvalidRequestError} If key is not provided
 */
export const parseFilterByKey = (paramsOrBody: unknown) => {
    const { key } = paramsOrBody as any

    if (!key)
        throw new InvalidRequestError("Keys must be array with at least one value")

    return key
}

/**
 * Parse filter by keys from request data
 * @param paramsOrBody Request data containing the keys
 * @returns The keys array
 * @throws {InvalidRequestError} If keys are not provided or invalid
 */
export const parseFilterByKeys = (paramsOrBody: unknown) => {
    const { keys } = paramsOrBody as any

    if (!keys || !Array.isArray(keys) || keys.length < 1)
        throw new InvalidRequestError("Keys must be array with at least one value")

    return keys
}