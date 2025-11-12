import _ from "lodash"
import { enumCombineValuesToString, isInEnum } from "../../globals/coding/code.formating"
import { InvalidRequestError } from "./errors.api"
import { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "../../globals/panther/enums.panther"


/**
 * Validates the provided labels to ensure they are an array of strings and that each label
 * is a valid value within the specified enums (`UsedNodeLabels` or `UsedDatasourceLabels`).
 *
 * @param labels - The input to validate, expected to be an array of strings.
 * @throws {InvalidRequestError} If `labels` is not an array.
 * @throws {InvalidRequestError} If any label in the array is not a valid value in the combined enums.
 */
export const validateNodeLabels = (labels: unknown) => {

  if (labels === undefined || labels === null) {
    throw new InvalidRequestError("Graph node labels are required.")
  }

  if (!_.isArray(labels))
    throw new InvalidRequestError(`Graph node labels must be an array of strings.`)

  if (labels.length === 0)
    throw new InvalidRequestError("Graph node labels array must contain at least one label.")

  for (const label of labels) {
    if (!isInEnum(label, UsedNodeLabels) && !isInEnum(label, UsedDatasourceLabels))
      throw new InvalidRequestError(`Label ${label} is not supported. Value must be one of: ${enumCombineValuesToString([UsedNodeLabels, UsedDatasourceLabels])}`)
  }
}

/**
 * Validate a graph edge label.
 *
 * The value is first checked for presence (not `undefined`/`null`), then for type (`string`).
 * The string is normalised using `toLocaleLowerCase()` and validated against the `UsedEdgeLabels` enum.
 *
 * @param label - The value to validate; expected to be a string representing an edge label.
 *
 * @throws {InvalidRequestError} If `label` is `undefined` or `null`.
 * @throws {InvalidRequestError} If `label` is not a `string`.
 * @throws {InvalidRequestError} If the normalised label is not one of the supported values in `UsedEdgeLabels`.
 *
 * @example
 * validateEdgeLabel('CONNECTS'); // succeeds if 'connects' exists in UsedEdgeLabels
 *
 * @remarks
 * Membership is determined via `isInEnum` and error messages include the allowed values (via `enumCombineValuesToString`).
 */
export const validateEdgeLabel = (label: unknown) => {

  if (label === undefined || label === null) {
    throw new InvalidRequestError("Graph edge label is required.")
  }

  if (typeof label !== "string") {
    throw new InvalidRequestError(`Graph edge label must be a string.`)
  }

  const normalisedLabel = label.toLocaleLowerCase()

  if (!isInEnum(normalisedLabel, UsedEdgeLabels)) {
    throw new InvalidRequestError(`Graph edge label '${normalisedLabel}' is not supported. Value must be one of: ${enumCombineValuesToString([UsedEdgeLabels])}`)
  }
}