import { enumCombineValuesToString, isInEnum } from "../../globals/coding/code.formating"
import { InvalidRequestError } from "./models.errors"
import { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "../../globals/panther/enums.panther"


/**
 * Validate that the provided value is a non-empty array of valid node labels.
 * Each label must be a member of UsedNodeLabels or UsedDatasourceLabels.
 *
 * @param labels - The input to validate, expected to be an array of strings.
 * @throws {InvalidRequestError} If labels is null/undefined, not an array, empty, or contains invalid values.
 */
export const validateNodeLabels = (labels: unknown) => {

  // Reject null or undefined labels
  if (labels === undefined || labels === null) {
    throw new InvalidRequestError("Graph node labels are required.")
  }

  // Ensure labels is an array
  if (!Array.isArray(labels))
    throw new InvalidRequestError(`Graph node labels must be an array of strings.`)

  // Ensure the array is not empty
  if (labels.length === 0)
    throw new InvalidRequestError("Graph node labels array must contain at least one label.")

  // Validate each label against the allowed enums
  for (const label of labels) {
    if (!isInEnum(label, UsedNodeLabels) && !isInEnum(label, UsedDatasourceLabels))
      throw new InvalidRequestError(`Label ${label} is not supported. Value must be one of: ${enumCombineValuesToString([UsedNodeLabels, UsedDatasourceLabels])}`)
  }
}

/**
 * Validate that the provided value is a string representing a valid edge label.
 * The label is normalised to lowercase and checked against UsedEdgeLabels.
 *
 * @param label - The value to validate; expected to be a string.
 * @throws {InvalidRequestError} If label is null/undefined, not a string, or not in UsedEdgeLabels.
 */
export const validateEdgeLabel = (label: unknown) => {

  // Reject null or undefined labels
  if (label === undefined || label === null) {
    throw new InvalidRequestError("Graph edge label is required.")
  }

  // Ensure label is a string
  if (typeof label !== "string") {
    throw new InvalidRequestError(`Graph edge label must be a string.`)
  }

  // Normalise to lowercase for case-insensitive matching
  const normalisedLabel = label.toLocaleLowerCase()

  // Check membership in the allowed edge labels enum
  if (!isInEnum(normalisedLabel, UsedEdgeLabels)) {
    throw new InvalidRequestError(`Graph edge label '${normalisedLabel}' is not supported. Value must be one of: ${enumCombineValuesToString([UsedEdgeLabels])}`)
  }
}