/**
 * Check, if the string is url
 * @param candidate Candidate input, to be checked
 * @returns Is this string url?
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
 * Check if the value in included in enum posibilities.
 * @param value Value we need to check
 * @param enumEntity Enum type we check againts the value
 * @returns Is the value in this enum?
 */
export const isInEnum = (value: any, enumEntity: any) => {
    const allEnumValues = Object.values(enumEntity) as string[]
    return allEnumValues.includes(value)
  }

/**
 * Sort array of string elements
 * @param rawArray Raw unsorted array of elements
 * @returns Sorted string array
 */
export const sortStringArray = (rawArray: string[]) => rawArray.sort()

/**
 * Remove all duplicity string items from an array
 * @param arr Original array with duplicities
 * @returns Array of original values
 */
export const removeDuplicitiesFromArray = (arr: any[]) => [...new Set(arr)]


/**
 * Check if the string value is not ` "" `
 * @param value Value to check
 * @returns Boolean result about the truth
 */
export const notEmptyString = (value: string) => value !== ""


/**
 * Return enum values as array of string
 * @param enumType Type of the enum from code
 * @param separator Optional - separator character
 * @returns Array of enum possible values
 */
export const enumValuesToString = (enumType: any, separator = ", ") => Object.values(enumType).join(separator)

/**
 * Return enum values as array of string
 * @param enumTypes Combination of enum types
 * @param separator Optional - separator character
 * @returns Array of enum possible values
 */
export const enumCombineValuesToString = (enumTypes: any[], separator = ", ") => enumTypes.map(enumType => enumValuesToString(enumType, separator)).join(separator)

/**
 * Return all enum values as array
 * @param enumType What array we want to work with
 * @returns Array of enum values
 */
export const enumValuesToArray = (enumType: any) => Object.values(enumType) as string[]

/**
 * Return random number (integer) between two values
 * @param min 
 * @param max 
 * @returns 
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
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            Object.assign(acc, flattenObject(obj[key], propName))
        } else {
            acc[propName] = obj[key]
        }
        return acc
    }, {})
}