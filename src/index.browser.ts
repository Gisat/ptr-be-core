/**
 * Browser entry point for ptr-be-core.
 * Re-exports shared utilities available in both browser and Node.js environments.
 * Groups exports by domain: formatting, dates, CSV, Panther graph models, types, and Arrows models.
 */

// shared code helpers — formatting, validation, and enum utilities
export {
    enumCombineValuesToString,
    enumValuesToArray,
    enumValuesToString,
    flattenObject,
    isInEnum,
    notEmptyString,
    randomNumberBetween,
    removeDuplicitiesFromArray,
    sortStringArray,
    isUrl,
    isArrayOfUrls
} from "./globals/coding/code.formating.js";

// code helpers for datetimes — timestamp and ISO format conversions
export {
    isoIntervalToTimestamps,
    nowTimestamp,
    nowTimestampIso,
    nowPlusTime,
    epochToIsoFormat,
    hasIsoFormat,
    isoDateToTimestamp
} from "./globals/coding/code.dates.js";

// code helpers for CSV formats — parse comma-separated values
export {
    csvParseNumbers,
    csvParseStrings
} from "./globals/coding/formats.csv.js";

// code helpers for Panther graph models — node and edge lookups
export {
    filterNodeByLabel,
    findEdgeByLabel,
    filterEdgeByLabel,
    findNodeByLabel
} from "./globals/panther/utils.panther.js";

// Shared general code types — Nullable, Unsure, Nullish, UsurePromise
export { type Nullable, type Nullish, type Unsure, type UsurePromise } from "./globals/coding/code.types.js";

// Panther graph model — labels for nodes, edges, datasources and timeseries steps
export { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels, UsedTimeseriesSteps } from "./globals/panther/enums.panther.js";

// Panther graph model — edge-specific property interfaces
export { type EdgeForPostgisLocationProperties, type EdgePropertiesBasic, type FullEdgeProperties } from "./globals/panther/models.edges.properties.js";

// Panther graph model — edge and relation tuple types
export { type GraphEdge, type GraphRelation } from "./globals/panther/models.edges.js";

// Panther graph model — node structural types (neighbours, edges)
export { 
    type HasEdges, 
    type HasNeighbours, 
    type NodeWithNeighbours 
} from "./globals/panther/models.nodes.structure.js";

// Panther graph model — general node property interfaces (geometry, interval, config, levels, units)
export {
    type HasConfiguration,
    type HasGeometry,
    type HasInterval,
    type HasLevels,
    type HasUnits
} from "./globals/panther/models.nodes.properties.general.js";

// Panther graph model — datasource-specific node property interfaces (bands, url, color, etc.)
export {
    type HasBands,
    type HasDocumentId,
    type HasTimeseries,
    type HasUrl,
    type HasSpecificName,
    type HasColor,
} from "./globals/panther/models.nodes.properties.datasources.js";

// Panther graph model — named node definitions (Place, Period, Datasource, etc.)
export {
    type Place,
    type Period,
    type AreaTreeLevel,
    type Datasource,
    type ApplicationNode,
    type Attribute,
    type PantherEntity,
    type FullPantherEntity
} from "./globals/panther/models.nodes.js";
