
// shared code helpers
export {
    enumCombineValuesToString,
    enumValuesToArray,
    enumValuesToString,
    flattenObject,
    isInEnum,
    notEmptyString,
    randomNumberBetween,
    removeDuplicitiesFromArray,
    sortStringArray
} from "./globals/coding/code.formating.js";

// code helpers for datetimes
export {
    isoIntervalToTimestamps,
    nowTimestamp,
    nowTimestampIso,
    epochToIsoFormat,
    hasIsoFormat,
    isoDateToTimestamp
} from "./globals/coding/code.dates.js";

// code helpers for CSV formats
export {
    csvParseNumbers,
    csvParseStrings
} from "./globals/coding/formats.csv.js";

// Shared geenral code types
export { type Nullable, type Nullish, type Unsure, type UsurePromise } from "./globals/coding/code.types.js";

// Panther graph model - labels for nodes and edges
export { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels, UsedTimeseriesSteps } from "./globals/panther/enums.panther.js";

// Panther graph model - edge specific properties
export { type EdgeForPostgisLocationProperties, type EdgePropertiesBasic, type FullEdgeProperties } from "./globals/panther/models.edges.properties.js";

// Panther graph model - edges and relations
export { type GraphEdge, type GraphRelation } from "./globals/panther/models.edges.js";

// Panther graph model - Nodes with neighbours models
export { 
    type HasEdges, 
    type HasNeighbours, 
    type NodeWithNeighbours 
} from "./globals/panther/models.nodes.structure.js";

// Panther graph model - node definitions with specific properties
export {
    type HasConfiguration,
    type HasGeometry,
    type HasInterval,
    type HasLevels,
    type HasUnits
} from "./globals/panther/models.nodes.properties.general.js";

// Panther graph model - Datasource specific node properties
export {
    type HasBands,
    type HasDocumentId,
    type HasTimeseries,
    type HasUrl,
    type HasSpecificName,
    type HasColor,
} from "./globals/panther/models.nodes.properties.datasources.js";

// Panther graph model - named node definitions
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

// Arrows.app models for import / export
export {
    type ArrowsNode,
    type ArrowsEdge
} from "./globals/arrows/models.arrows.js";


