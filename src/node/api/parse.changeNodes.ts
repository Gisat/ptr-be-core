import { randomUUID } from "crypto"
import { isArray } from "lodash"
import { Unsure } from "../../globals/coding/code.types"
import { FullPantherEntity, PantherEntity } from "../../globals/panther/models.nodes"
import { HasConfiguration, HasGeometry, HasInterval, HasLevels, HasUnits } from "../../globals/panther/models.nodes.properties.general"
import { InvalidRequestError } from "./errors.api"
import { HasBands, HasColor, HasSpecificName, HasUrl } from "../../globals/panther/models.nodes.properties.datasources"
import { UsedDatasourceLabels, UsedNodeLabels } from "../../globals/panther/enums.panther"
import { validateNodeLabels } from "./validations.shared"
import { isoIntervalToTimestamps, nowTimestamp } from "../../globals/coding/code.dates"
import { csvParseNumbers, csvParseStrings } from "../../globals/coding/formats.csv"

/**
 * Extract and parse basic entitry from request body
 * This parse function is used in other parsers, becuase basic entity is part of other models
 * @param bodyRaw Body from http request
 * @param key Optional - key value for existing recods in database
 * @returns Parsed entity - all unwanted parameters are gone
 */
const parseBasicNodeFromBody = (bodyRaw: unknown): PantherEntity => {
  const {
    labels,
    nameInternal,
    nameDisplay,
    description,
    key
  } = bodyRaw as any

  validateNodeLabels(labels)

  const basicGraphResult: PantherEntity = {
    lastUpdatedAt: nowTimestamp(),
    key: key ?? randomUUID(),
    nameInternal: nameInternal as string ?? "",
    nameDisplay: nameDisplay as string ?? "",
    description: description as string ?? "",
    labels: labels as string[]
  }

  return basicGraphResult
}

/**
 * Parse node of type area tree level 
 * @param levelBody Content from request
 * @returns Parsed area tree level
 */
const paseHasLevels = (levelBody: unknown): HasLevels => {
  const { level } = levelBody as any

  const result: HasLevels = {
    level
  }

  return result
}

/**
 * Parse body to period entity
 * @param bodyRaw Request body content - can be anything
 * @returns Parsed entity - all unwanted parameters are gone
 */
const parseWithInterval = (bodyRaw: any): HasInterval => {
  const {
    intervalISO,
  } = bodyRaw

  if (!intervalISO)
    throw new InvalidRequestError("Period must have UTC interval in ISO format")

  const [from, to] = isoIntervalToTimestamps(intervalISO)
  const intervalResult: HasInterval = {
    validIntervalIso: intervalISO,
    validFrom: from,
    validTo: to
  }

  return intervalResult
}

const parseWithConfiguration = (bodyRaw: any, required = false): Unsure<HasConfiguration> => {
  const { configuration } = bodyRaw

  if (!configuration && required)
    throw new InvalidRequestError("Configuration is required")

  if (!configuration)
    return

  return { configuration: typeof configuration === 'string' ? configuration : JSON.stringify(configuration) }
}

/**
 * Parse body to place entity
 * @param bodyRaw Request body content - can be anything
 * @returns 
 */
const parseHasGeometry = (bodyRaw: any) => {
  const {
    bbox,
    geometry,
  } = bodyRaw

  /**
   * Convert bbox from CSV string to array of 4 coordinates
   * @returns Parsed bounding box from CSV string
   */
  const bboxFromCSV = () => {
    const bboxFromCSV = csvParseNumbers(bbox as string)

    if (bboxFromCSV.length !== 4)
      throw new InvalidRequestError("bbox must be an array of 4 numbers")

    return bboxFromCSV
  }

  const geometryResult: HasGeometry = {
    bbox: bbox ? bboxFromCSV() : [],
    geometry: geometry ?? ""
  }

  return geometryResult
}

/**
 * Parses the input object and extracts the `url` property.
 * If the `url` property is not present or is undefined, it returns `null` for `url`.
 *
 * @param bodyRaw - The raw input object that may contain a `url` property.
 * @returns An object with a single `url` property, which is either the extracted value or `null`.
 */
const parseHasUrl = (bodyRaw: any, isRequired = true): Unsure<HasUrl> => {
  const { url } = bodyRaw

  if (isRequired && !url)
    throw new InvalidRequestError("Url is required for the node")

  if (!url) return

  return { url }
}

/**
 * Parses the `specificName` property from the provided object and returns it wrapped in a `HasSpecificName` type.
 *
 * @param bodyRaw - The raw input object potentially containing the `specificName` property.
 * @param isRequired - If `true`, throws an `InvalidRequestError` when `specificName` is missing. Defaults to `false`.
 * @returns An object with the `specificName` property if present, or `undefined` if not required and missing.
 * @throws {InvalidRequestError} If `isRequired` is `true` and `specificName` is not provided.
 */
const parseHasSpecificName = (bodyRaw: any, isRequired = false): Unsure<HasSpecificName> => {
  const { specificName } = bodyRaw

  if (isRequired && !specificName)
    throw new InvalidRequestError("Property specificName is required for the node")

  if (!specificName) return

  return { specificName }
}



/**
 * Parses the `color` property from the provided `bodyRaw` object and returns it
 * wrapped in an object if it exists. If the `isRequired` flag is set to `true`
 * and the `color` property is missing, an error is thrown.
 *
 * @param bodyRaw - The raw input object containing the `color` property.
 * @param isRequired - A boolean indicating whether the `color` property is required.
 *                      Defaults to `false`.
 * @returns An object containing the `color` property if it exists, or `undefined` if not required.
 * @throws {InvalidRequestError} If `isRequired` is `true` and the `color` property is missing.
 */
const parseWithColor = (bodyRaw: any, isRequired = false): Unsure<HasColor> => {
  const { color } = bodyRaw

  if (isRequired && !color)
    throw new InvalidRequestError("Property color is required for the node")

  if (!color) return

  return { color }
}

/**
 * Parses the provided raw body object to extract unit and valueType properties.
 * Ensures that the required properties are present if `isRequired` is set to true.
 *
 * @param bodyRaw - The raw input object containing the properties to parse.
 * @param isRequired - A boolean indicating whether the `unit` and `valueType` properties are mandatory.
 *                      Defaults to `false`.
 * @returns An object containing the `unit` and `valueType` properties, or `null` if they are not provided.
 * @throws {InvalidRequestError} If `isRequired` is true and either `unit` or `valueType` is missing.
 */
const parseWithUnits = (bodyRaw: any, isRequired = false): Unsure<HasUnits> => {
  const { unit, valueType } = bodyRaw

  if (isRequired && (!unit || !valueType))
    throw new InvalidRequestError("Properties unit and valueType are required for the node")

  return { unit: unit ?? null, valueType: valueType ?? null }
}

/**
 * Parses the `bands`, `bandNames`, and `bandPeriods` properties from the provided raw input object.
 * 
 * - If `required` is `true`, throws an `InvalidRequestError` if any of the properties are missing.
 * - Converts CSV strings to arrays:
 *   - `bands` is parsed as an array of numbers.
 *   - `bandNames` and `bandPeriods` are parsed as arrays of trimmed strings.
 * - Returns an object containing any of the parsed properties that were present in the input.
 *
 * @param bodyRaw - The raw input object potentially containing `bands`, `bandNames`, and `bandPeriods` as CSV strings.
 * @param required - If `true`, all three properties are required and an error is thrown if any are missing. Defaults to `false`.
 * @returns An object with the parsed properties, or `undefined` if none are present.
 * @throws {InvalidRequestError} If `required` is `true` and any property is missing.
 */
const parseHasBands = (bodyRaw: any, required = false): Unsure<HasBands> => {
  const { bands, bandNames, bandPeriods } = bodyRaw
  let result: any

  if (required && (!bands || !bandNames || !bandPeriods))
    throw new InvalidRequestError("Bands, bandNames and bandPeriods are required for the node")

  if (bands) {
    result = result ?? {}
    Object.assign(result, { bands: csvParseNumbers(bands as string) })
  }

  if (bandNames) {
    result = result ?? {}
    Object.assign(result, { bandNames: csvParseStrings(bandNames as string) })
  }

  if (bandPeriods) {
    result = result ?? {}
    Object.assign(result, { bandPeriods: csvParseStrings(bandPeriods as string) })
  }

  return result as Unsure<HasBands>
}

/**
 * Parse single graph node from body entity 
 * @param bodyNodeEntity Entity from request body
 * @returns Parsed object for specific node
 */
export const parseSinglePantherNode = (bodyNodeEntity: unknown): FullPantherEntity => {

  // Parse basic node properties first
  let node: PantherEntity = parseBasicNodeFromBody(bodyNodeEntity)

  // Parse additional properties for specific node types
  // single for loop is used to avoid multiple labels array iterations
  for (const label of node.labels) {

    // If node is a Period, add interval information
    if (label === UsedNodeLabels.Period)
      node = { ...node, ...parseWithInterval(bodyNodeEntity) };

    // If node is a Place, add geographic information
    if (label === UsedNodeLabels.Place)
      node = { ...node, ...parseHasGeometry(bodyNodeEntity) };

    // If node is a Datasource or Application, add configuration when available
    if (label === UsedNodeLabels.Datasource || label === UsedNodeLabels.Application) {
      const parsedConfiguration = parseWithConfiguration(bodyNodeEntity, false);
      node = parsedConfiguration ? { ...node, ...parsedConfiguration } : node;
    }

    // If node is a online Datasource, add URL information
    const datasourcesWithUrl = [
      UsedDatasourceLabels.COG,
      UsedDatasourceLabels.WMS,
      UsedDatasourceLabels.MVT,
      UsedDatasourceLabels.WFS,
      UsedDatasourceLabels.WMTS,
      UsedDatasourceLabels.Geojson
    ];

    // If node is a Datasource with URL, add URL information
    if (datasourcesWithUrl.includes(label as UsedDatasourceLabels)) {
      const parsedUrl = parseHasUrl(bodyNodeEntity, true);
      node = parsedUrl ? { ...node, ...parsedUrl } : node;
    }

    // If node is a Datasource with bands, add bands information
    const datasourcesWithPossibleBands = [
      UsedDatasourceLabels.COG,
    ];

    // If node is a Datasource can have bands, add them
    if (datasourcesWithPossibleBands.includes(label as UsedDatasourceLabels)) {
      const parsedBands = parseHasBands(bodyNodeEntity, false);
      node = parsedBands ? { ...node, ...parsedBands } : node;
    }

    // If node is an AreaTreeLevel, add level information
    if (label === UsedNodeLabels.AreaTreeLevel)
      node = { ...node, ...paseHasLevels(bodyNodeEntity) };

    // If node is a Style, add specific name information
    if (label === UsedNodeLabels.Style) {
      const parsedSpecificName = parseHasSpecificName(bodyNodeEntity, true);
      node = parsedSpecificName ? { ...node, ...parsedSpecificName } : node;
    }

    // If node is an Attribute, add color information and units
    if (label === UsedNodeLabels.Attribute) {
      const parsedColor = parseWithColor(bodyNodeEntity, false);
      const parsedUnit = parseWithUnits(bodyNodeEntity, false);
      
      // Add parsed unit if available
      node = parsedUnit ? { 
        ...node, 
        ...parsedUnit 
      } : node;

      // Add parsed color if available
      node = parsedColor ? { 
        ...node, 
        ...parsedColor 
      } : node;
    }

  }

  return node;
}

/**
 * Parse array of graph nodes from request body
 * @param body Array of graph nodes inside http request body
 * @returns Array of parsed graph nodes in correct form
 */
export const parseParsePantherNodes = (body: unknown): FullPantherEntity[] => {
  const nodeArray = body as any[]

  if (!isArray(nodeArray))
    throw new InvalidRequestError("Request: Grah nodes must be an array")

  return nodeArray.map(PantherEntity => parseSinglePantherNode(PantherEntity))
}

// TODO: cover by better testing