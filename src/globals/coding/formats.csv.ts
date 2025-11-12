// TODO: Cover by tests
// TODO: mode to ptr-be-core as general CSV methods


/**
 * Parses a single line of CSV-formatted strings into an array of trimmed string values.
 *
 * @param csvStingsLine - A string representing a single line of comma-separated values.
 * @returns An array of strings, each representing a trimmed value from the CSV line.
 */
export const csvParseStrings = (csvStingsLine: string): string[] => {
  return csvStingsLine.split(",").map((value: string) => value.trim());
}

/**
 * Parses a comma-separated string of numbers into an array of numbers.
 *
 * @param csvNumbersLine - A string containing numbers separated by commas (e.g., "1, 2, 3.5").
 * @returns An array of numbers parsed from the input string.
 */
export const csvParseNumbers = (csvNumbersLine: string): number[] => {
  return csvNumbersLine.split(",").map((value: string) => parseFloat(value.trim()));
}