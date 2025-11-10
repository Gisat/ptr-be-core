import { EdgeForPostgisLocationProperties, EdgePropertiesBasic } from "./models.edges.properties";
import { PantherEntity } from "./models.nodes";
import { HasBands, HasColor, HasDocumentId, HasSpecificName, HasTimeseries, HasUrl } from "./models.nodes.properties.datasources";
import { HasConfiguration, HasGeometry, HasInterval, HasLevels, HasUnits } from "./models.nodes.properties.general";

/**
 * Full properties for a datasource, combining all relevant interfaces.
 */
export interface FullDatasourceProperties extends 
HasConfiguration, HasUrl, HasBands, HasTimeseries, HasSpecificName, HasColor, HasDocumentId { }

/**
 * Represents a full panther entity which extends the basic PantherEntity
 */
export interface FullPantherEntity extends
    PantherEntity,
    Partial<
        HasGeometry &
        HasInterval &
        HasLevels &
        HasConfiguration &
        HasUrl &
        HasBands &
        HasSpecificName &
        HasColor &
        HasUnits & 
        HasDocumentId &
        HasTimeseries> { }

/**
 * Represents a union type for edge properties, which can be either
 * `EdgeForPostgisLocationProperties` or `EdgePropertiesBasic`.
 * This type is used to define the possible properties of an edge
 * in the application.
 */
export type FullEdgeProperties =
    EdgeForPostgisLocationProperties |
    EdgePropertiesBasic