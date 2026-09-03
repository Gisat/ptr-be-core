import { HasGeometry, HasInterval, HasLevels, HasConfiguration, HasUnits } from "./models.nodes.properties.general.js"
import { UsedNodeLabels, UsedDatasourceLabels } from "./enums.panther.js"
import { HasBands, HasColor, HasDocumentId, HasSpecificName, HasTimeseries, HasUrl } from "./models.nodes.properties.datasources.js"
import { Neo4jMap, Nullable } from "../coding/code.types.js"

/**
 * Base graph node shared by all metadata entities.
 * Every entity has labels, a unique key, display/internal names, a description,
 * arbitrary extras, and a last-updated timestamp.
 */
export interface PantherEntity {
    labels: Array<string | UsedNodeLabels | UsedDatasourceLabels>,
    key: string
    nameDisplay: string,
    nameInternal: string,
    description: Nullable<string>,
    extras: Nullable<Neo4jMap>,
    lastUpdatedAt: number,
}

/**
 * Place node — represents a geographic location with geometry.
 */
export interface Place extends PantherEntity, HasGeometry { }

/**
 * Period node — represents a time range with interval.
 */
export interface Period extends PantherEntity, HasInterval { }

/**
 * Area tree level node — represents a level in a hierarchical area tree.
 */
export interface AreaTreeLevel extends PantherEntity, HasLevels { }

/**
 * Datasource node — represents a data source with optional configuration, URL, bands, timeseries, etc.
 */
export interface Datasource extends PantherEntity, Partial<HasConfiguration & HasUrl & HasBands & HasTimeseries & HasSpecificName & HasColor & HasDocumentId> { }

/**
 * Application node — the main root entity in the metadata model, with optional configuration.
 */
export interface ApplicationNode extends PantherEntity, Partial<HasConfiguration> { }

/**
 * Attribute node — describes a property of an entity (e.g. "temperature", "population").
 * May have optional color and unit information.
 */
export interface Attribute extends PantherEntity, Partial<HasColor & HasUnits> {
}

/**
 * Full-featured Panther entity combining the base entity with all optional property mixins.
 * Properties like geometry, interval, levels, configuration, URL, bands, specific name,
 * color, units, document ID, and timeseries are all optional.
 * Consumers should check for presence before accessing optional fields.
 */
export interface FullPantherEntity extends PantherEntity, Partial<HasGeometry & HasInterval & HasLevels & HasConfiguration & HasUrl & HasBands & HasSpecificName & HasColor & HasUnits &  HasDocumentId & HasTimeseries> { }
