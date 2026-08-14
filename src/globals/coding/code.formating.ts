/**
 * Check if a string is a valid URL.
 *
 * @param candidate - String to validate as a URL.
 * @returns True if the string is a valid URL, false otherwise.
 */
export const isUrl = (candidate: string) => {
  try {
    new URL(candidate)

    return true
  } catch {
    return false
  }
}

/**
 * Check if all elements in a string array are valid URLs.
 *
 * @param candidates - Array of strings to validate as URLs.
 * @returns True if every element is a valid URL.
 */
export const isArrayOfUrls = (candidates: string[]) => candidates.every(candidate => isUrl(candidate))

/**
 * Check if a value is a member of the given enum.
 *
 * @param value - Value to check for membership.
 * @param enumEntity - The enum object to check against.
 * @returns True if the value exists in the enum.
 */
export const isInEnum = (value: any, enumEntity: any) => {
    const allEnumValues = Object.values(enumEntity) as string[]

    return allEnumValues.includes(value)
  }

/**
 * Sort an array of strings alphabetically.
 *
 * @param rawArray - Unsorted array of strings.
 * @returns Sorted string array (mutates the original).
 */
export const sortStringArray = (rawArray: string[]) => rawArray.sort()

/**
 * Remove duplicate values from an array.
 *
 * @param arr - Array with potential duplicate values.
 * @returns New array with unique values only.
 */
export const removeDuplicitiesFromArray = (arr: any[]) => [...new Set(arr)]


/**
 * Check if a string is not empty.
 *
 * @param value - String to check.
 * @returns True if the string is not empty.
 */
export const notEmptyString = (value: string) => value !== ""


/**
 * Join all values of an enum into a single string.
 *
 * @param enumType - The enum to extract values from.
 * @param separator - Optional separator between values (default: ", ").
 * @returns String of joined enum values.
 */
export const enumValuesToString = (enumType: any, separator = ", ") => Object.values(enumType).join(separator)

/**
 * Combine values from multiple enums into a single string.
 *
 * @param enumTypes - Array of enums to combine.
 * @param separator - Optional separator between values (default: ", ").
 * @returns String of combined enum values.
 */
export const enumCombineValuesToString = (enumTypes: any[], separator = ", ") => enumTypes.map(enumType => enumValuesToString(enumType, separator)).join(separator)

/**
 * Return all enum values as an array of strings.
 *
 * @param enumType - The enum to extract values from.
 * @returns Array of enum string values.
 */
export const enumValuesToArray = (enumType: any) => Object.values(enumType) as string[]

/**
 * Generate a random integer between min and max (inclusive).
 *
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (inclusive).
 * @returns Random integer in the range [min, max].
 */
export const randomNumberBetween = (min: number, max: number) => {
  const minAr = Math.ceil(min)

  const maxAr = Math.floor(max)

  return Math.floor(Math.random()*(maxAr - minAr + 1) + min)
}

/**
 * Recursively flattens a nested object. The keys of the resulting object
 * will be the paths to the original values in the nested object, joined by dots.
 *
 * @param obj - The object to flatten.
 * @param prefix - The prefix to use for the keys in the flattened object. Defaults to an empty string.
 * @returns A new object with flattened keys.
 *
 * @example
 * ```typescript
 * const nestedObj = {
 *   a: {
 *     b: {
 *       c: 1
 *     }
 *   },
 *   d: 2
 * };
 * const flatObj = flattenObject(nestedObj);
 * console.log(flatObj);
 * // Output: { 'a.b.c': 1, 'a.b.d': 2 }
 * ```
 */
export const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
        const propName = prefix ? `${prefix}.${key}` : key

        // Recurse into nested objects, otherwise assign the value directly
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], propName))
        } else {
            acc[propName] = obj[key]
        }

        return acc
    }, {})
}