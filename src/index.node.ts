// Shared code helpers
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

// Shared geenral code types
export { type Nullable, type Nullish, type Unsure, type UsurePromise } from "./globals/coding/code.types.js";


// Panther graph model - labels for nodes and edges
export { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "./globals/panther/enums.panther.js";

// Panther graph model - edges and relations
export { type GraphEdge, type GraphRelation } from "./globals/panther/models.edges.js";

// Panther graph model - node definitions with specific properties
export {
    type HasBands,
    type HasColor,
    type HasConfiguration,
    type HasGeometry,
    type HasInterval,
    type HasLevels,
    type HasSpecificName,
    type HasUrl,
    type HasUnits
} from "./globals/panther/models.nodes.properties.js";

export {
    type Place,
    type Period,
    type AreaTreeLevel,
    type Datasource,
    type ApplicationNode,
    type Attribute,
    type FullPantherEntity,
    type MapStyle,
    type PantherEntity
} from "./globals/panther/models.nodes.js";

// API error handling
export { messageFromError, InvalidRequestError, AuthorizationError } from "./node/api/errors.api.js";

// API models and helpers
export { type ApiEndpointResponse } from "./node/api/models.api.js";

// Logger functionality
export { type AppLogOptions } from "./node/logging/logger.js";
export { AppLogger } from "./node/logging/logger.js";

