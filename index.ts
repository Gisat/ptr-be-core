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
} from "./src/coding/code.formating";

// Shared geenral code types
export { type Nullable, type Nullish, type Unsure, type UsurePromise } from "./src/coding/code.types";

// API error handling
export { messageFromError, InvalidRequestError, AuthorizationError } from "./src/api/errors.api";


// API models and helpers
export { type ApiEndpointResponse } from "./src/api/models.api";

// Logger functionality
export { type AppLogOptions } from "./src/logging/logger";
export { AppLogger } from "./src/logging/logger";

// Panther graph model - labels for nodes and edges
export { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "./src/panther/enums.panther";

// Panther graph model - edges and relations
export { type GraphEdge, type GraphRelation } from "./src/panther/models.edges";

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
} from "./src/panther/models.nodes.properties";

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
} from "./src/panther/models.nodes";
