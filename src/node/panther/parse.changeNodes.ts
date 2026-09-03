import { randomUUID } from "crypto"
import { Unsure } from "../../globals/coding/code.types"
import { FullPantherEntity, PantherEntity } from "../../globals/panther/models.nodes"
import { HasConfiguration, HasGeometry, HasInterval, HasLevels, HasUnits } from "../../globals/panther/models.nodes.properties.general"
import { InvalidRequestError } from "../api/models.errors"
import { HasBands, HasColor, HasDocumentId, HasSpecificName, HasTimeseries, HasUrl } from "../../globals/panther/models.nodes.properties.datasources"
import { UsedDatasourceLabels, UsedNodeLabels } from "../../globals/panther/enums.panther"
import { validateNodeLabels } from "../api/validations.shared"
import { isoIntervalToTimestamps, nowTimestamp } from "../../globals/coding/code.dates"
import { csvParseNumbers, csvParseStrings } from "../../globals/coding/formats.csv"

/**
 * Extract and parse basic entity fields from a raw request body.
 * Fields parsed: labels, nameInternal, nameDisplay, description, key, extras.
 * Generates a UUID for key if not provided.
 *
 * @param bodyRaw - Raw HTTP request body.
 * @returns Parsed PantherEntity with validated labels and generated defaults.
 */
const parseBasicNodeFromBody = (bodyRaw: unknown): PantherEntity => {
  const {
    labels,
    nameInternal,
    nameDisplay,
    description,
    extras,
    key
  } = bodyRaw as any

  // Validate labels against allowed enums
  validateNodeLabels(labels)

  // Build the basic entity with defaults for missing fields
  const basicGraphResult: PantherEntity = {
    lastUpdatedAt: nowTimestamp(),
    key: key ?? randomUUID(),
    nameInternal: nameInternal as string ?? "",
    nameDisplay: nameDisplay as string ?? "",
    description: description as string ?? "",
    extras: extras ?? null,
    labels: labels as string[]
  }

  return basicGraphResult
}

/**
 * Parse the level property from raw body for area tree level nodes.
 *
 * @param levelBody - Raw body containing level data.
 * @returns Parsed HasLevels object with the level value.
 */
const paseHasLevels = (levelBody: unknown): HasLevels => {
  const { level } = levelBody as any

  const result: HasLevels = {
    level
  }

  return result
}

/**
 * Parse interval data from raw body for period nodes.
 * Extracts intervalIso and converts it to timestamps.
 *
 * @param bodyRaw - Raw body containing interval data.
 * @returns Parsed HasInterval with ISO string and computed timestamps.
 * @throws {InvalidRequestError} If intervalIso is missing or invalid.
 */
const parseWithInterval = (bodyRaw: any): HasInterval => {
  const {
    intervalIso,
  } = bodyRaw

  // Interval is required for period nodes
  if (!intervalIso)
    throw new InvalidRequestError("Period must have UTC interval in ISO format")

  // Parse ISO interval into from/to timestamps
  const [from, to] = isoIntervalToTimestamps(intervalIso)

  const intervalResult: HasInterval = {
    intervalIso,
    timestampFrom: from,
    timestampTo: to
  }

  return intervalResult
}

/**
 * Parse configuration from raw body, optionally required.
 * Stringifies object configurations to JSON strings.
 *
 * @param bodyRaw - Raw body containing configuration data.
 * @param required - If true, throws when configuration is missing.
 * @returns HasConfiguration object or undefined if not required and missing.
 * @throws {InvalidRequestError} If required and configuration is missing.
 */
const parseWithConfiguration = (bodyRaw: any, required = false): Unsure<HasConfiguration> => {
  const { configuration } = bodyRaw

  // Throw if configuration is required but missing
  if (!configuration && required)
    throw new InvalidRequestError("Configuration is required")

  // Skip if configuration is not provided
  if (!configuration)
    return

  // Stringify object configs for consistent storage format
  return { configuration: typeof configuration === 'string' ? configuration : JSON.stringify(configuration) }
}

/**
 * Parse geometry data including bounding box and GeoJSON geometry.
 * Bbox is parsed from CSV string to an array of 4 coordinates.
 *
 * @param bodyRaw - Raw body containing geometry and bbox.
 * @returns Parsed HasGeometry object.
 * @throws {InvalidRequestError} If bbox CSV does not contain exactly 4 numbers.
 */
const parseHasGeometry = (bodyRaw: any) => {
  const {
    bbox,
    geometry,
  } = bodyRaw

/**
   * Convert bbox from CSV string to array of 4 coordinate numbers.
   *
   * @returns An array of 4 numbers: [xmin, ymin, xmax, ymax].
   * @throws {InvalidRequestError} If the parsed bbox does not have exactly 4 values.
   */
  const bboxFromCSV = (): number[] => {
    const bboxFromCSV = csvParseNumbers(bbox as string)

    // Validate bbox has exactly 4 values (xmin, ymin, xmax, ymax)
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
 * Parse URL property from raw body.
 *
 * @param bodyRaw - Raw body containing URL data.
 * @param isRequired - If true, throws when URL is missing (default: true).
 * @returns HasUrl object or undefined if not required and missing.
 * @throws {InvalidRequestError} If required and URL is missing.
 */
const parseHasUrl = (bodyRaw: any, isRequired = true): Unsure<HasUrl> => {
  const { url } = bodyRaw

  // Throw if URL is required but missing
  if (isRequired && !url)
    throw new InvalidRequestError("Url is required for the node")

  // Skip if URL is not provided
  if (!url) return

  return { url }
}

/**
 * Parse the specificName property from raw body.
 *
 * @param bodyRaw - Raw body containing specificName data.
 * @param isRequired - If true, throws when specificName is missing (default: false).
 * @returns HasSpecificName object or undefined if not required and missing.
 * @throws {InvalidRequestError} If required and specificName is missing.
 */
const parseHasSpecificName = (bodyRaw: any, isRequired = false): Unsure<HasSpecificName> => {
  const { specificName } = bodyRaw

  // Throw if specificName is required but missing
  if (isRequired && !specificName)
    throw new InvalidRequestError("Property specificName is required for the node")

  // Skip if not provided
  if (!specificName) return

  return { specificName }
}



/**
 * Parse the color property from raw body.
 *
 * @param bodyRaw - Raw body containing color data.
 * @param isRequired - If true, throws when color is missing (default: false).
 * @returns HasColor object or undefined if not required and missing.
 * @throws {InvalidRequestError} If required and color is missing.
 */
const parseWithColor = (bodyRaw: any, isRequired = false): Unsure<HasColor> => {
  const { color } = bodyRaw

  // Throw if color is required but missing
  if (isRequired && !color)
    throw new InvalidRequestError("Property color is required for the node")

  // Skip if not provided
  if (!color) return

  return { color }
}

/**
 * Parse unit and valueType properties from raw body.
 *
 * @param bodyRaw - Raw body containing unit and valueType data.
 * @param isRequired - If true, throws when unit or valueType is missing (default: false).
 * @returns HasUnits object or undefined if not required and missing.
 * @throws {InvalidRequestError} If required and unit or valueType is missing.
 */
const parseWithUnits = (bodyRaw: any, isRequired = false): Unsure<HasUnits> => {
  const { unit, valueType } = bodyRaw

  // Throw if required fields are missing
  if (isRequired && (!unit || !valueType))
    throw new InvalidRequestError("Properties unit and valueType are required for the node")

  return { unit: unit ?? null, valueType: valueType ?? null }
}

/**
 * Parse the documentId property from raw body.
 *
 * @param bodyRaw - Raw body containing documentId data.
 * @returns HasDocumentId object with the documentId value.
 * @throws {InvalidRequestError} If documentId is missing.
 */
const parseHasDocumentId = (bodyRaw: any): HasDocumentId => {
  const { documentId } = bodyRaw

  // Document ID is required
  if (!documentId)
    throw new InvalidRequestError("Property documentId is required for the node")

  return { documentId }
}

/**
 * Parse timeseries data including interval and step granularity.
 * Delegates interval parsing to parseWithInterval.
 *
 * @param bodyRaw - Raw body containing timeseries data.
 * @returns HasTimeseries object with interval fields and step.
 * @throws {InvalidRequestError} If step is missing.
 */
const parseWithTimeseries = (bodyRaw: any): HasTimeseries => {
  const timeseriesIntervals = parseWithInterval(bodyRaw)

  const { step } = bodyRaw

  // Step is required for timeseries datasources
  if (!step)
    throw new InvalidRequestError("Property step is required for timeseries datasource")

  return { ...timeseriesIntervals, step }
}

/**
 * Parse bands, bandNames, and bandPeriods from CSV strings in raw body.
 *
 * @param bodyRaw - Raw body containing bands data.
 * @param required - If true, throws when any band property is missing (default: false).
 * @returns HasBands object with parsed arrays, or undefined if no band data present.
 * @throws {InvalidRequestError} If required and any band property is missing.
 */
const parseHasBands = (bodyRaw: any, required = false): Unsure<HasBands> => {
  const { bands, bandNames, bandPeriods } = bodyRaw

  let result: any

  // Throw if bands are required but missing
  if (required && (!bands || !bandNames || !bandPeriods))
    throw new InvalidRequestError("Bands, bandNames and bandPeriods are required for the node")

  // Parse bands from CSV string to number array
  if (bands) {
    result = result ?? {}
    Object.assign(result, { bands: csvParseNumbers(bands as string) })
  }

  // Parse bandNames from CSV string to trimmed string array
  if (bandNames) {
    result = result ?? {}
    Object.assign(result, { bandNames: csvParseStrings(bandNames as string) })
  }

  // Parse bandPeriods from CSV string to trimmed string array
  if (bandPeriods) {
    result = result ?? {}
    Object.assign(result, { bandPeriods: csvParseStrings(bandPeriods as string) })
  }

  return result as Unsure<HasBands>
}

/**
 * Parse a single graph node from a raw request body entity.
 * Applicable property parsers are applied based on the node's labels.
 *
 * @param bodyNodeEntity - Single entity from the request body.
 * @returns Fully parsed FullPantherEntity with all applicable properties.
 */
export const parseSinglePantherNode = (bodyNodeEntity: unknown): FullPantherEntity => {

  // Parse basic node properties first — labels, key, names, description
  let node: PantherEntity = parseBasicNodeFromBody(bodyNodeEntity)

  // Iterate over labels once to apply all relevant property parsers
  for (const label of node.labels) {

    // Period — add interval information
    if (label === UsedNodeLabels.Period)
      node = { ...node, ...parseWithInterval(bodyNodeEntity) };

    // Place — add geographic geometry and bbox
    if (label === UsedNodeLabels.Place)
      node = { ...node, ...parseHasGeometry(bodyNodeEntity) };

    // Datasource or Application — add optional configuration
    if (label === UsedNodeLabels.Datasource || label === UsedNodeLabels.Application) {
      const parsedConfiguration = parseWithConfiguration(bodyNodeEntity, false);
      node = parsedConfiguration ? { ...node, ...parsedConfiguration } : node;
    }

    // Online datasources with URLs — add URL
    const datasourcesWithUrl = [
      UsedDatasourceLabels.COG,
      UsedDatasourceLabels.WMS,
      UsedDatasourceLabels.MVT,
      UsedDatasourceLabels.WFS,
      UsedDatasourceLabels.WMTS,
      UsedDatasourceLabels.Geojson,
      UsedDatasourceLabels.External
    ];

    if (datasourcesWithUrl.includes(label as UsedDatasourceLabels)) {
      const parsedUrl = parseHasUrl(bodyNodeEntity, true);
      node = parsedUrl ? { ...node, ...parsedUrl } : node;
    }

    // Raster datasources — add optional band information
    const datasourcesWithPossibleBands = [
      UsedDatasourceLabels.COG,
    ];

    if (datasourcesWithPossibleBands.includes(label as UsedDatasourceLabels)) {
      const parsedBands = parseHasBands(bodyNodeEntity, false);
      node = parsedBands ? { ...node, ...parsedBands } : node;
    }

    // Style or MapStyle — add specific name
    if (label === UsedNodeLabels.Style || label === UsedDatasourceLabels.MapStyle) {
      const parsedSpecificName = parseHasSpecificName(bodyNodeEntity, true);
      node = parsedSpecificName ? { ...node, ...parsedSpecificName } : node;
    }

    // Timeseries datasource — add interval and step
    if (label === UsedDatasourceLabels.Timeseries) {
      const parsedTimeseries = parseWithTimeseries(bodyNodeEntity);
      node = { ...node, ...parsedTimeseries };
    }

    // Datasources with document ID — PostGIS and Timeseries
    const datasourcesWithDocumentId = [
      UsedDatasourceLabels.PostGIS,
      UsedDatasourceLabels.Timeseries
    ];

    if (datasourcesWithDocumentId.includes(label as UsedDatasourceLabels)) {
      const parsedDocumentId = parseHasDocumentId(bodyNodeEntity);
      node = { ...node, ...parsedDocumentId };
    }

    // AreaTreeLevel — add level information
    if (label === UsedNodeLabels.AreaTreeLevel)
      node = { ...node, ...paseHasLevels(bodyNodeEntity) };

    // Attribute — add optional color and unit information
    if (label === UsedNodeLabels.Attribute) {
      const parsedColor = parseWithColor(bodyNodeEntity, false);

      const parsedUnit = parseWithUnits(bodyNodeEntity, false);
      
      node = parsedUnit ? { 
        ...node, 
        ...parsedUnit 
      } : node;

      node = parsedColor ? { 
        ...node, 
        ...parsedColor 
      } : node;
    }

  }

  return node;
}

/**
 * Parse an array of graph nodes from a raw request body.
 *
 * @param body - Array of graph node objects from the HTTP request body.
 * @returns Array of parsed FullPantherEntity objects.
 * @throws {InvalidRequestError} If body is not an array.
 */
export const parseParsePantherNodes = (body: unknown): FullPantherEntity[] => {
  const nodeArray = body as any[]

  // Validate the body is an array
  if (!Array.isArray(nodeArray))
    throw new InvalidRequestError("Request: Grah nodes must be an array")

  // Parse each node entity through the single-node parser
  return nodeArray.map(PantherEntity => parseSinglePantherNode(PantherEntity))
}

// TODO: cover by better testing