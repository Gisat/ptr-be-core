import { HasGeometry, HasInterval, HasLevels, HasConfiguration, HasUnits } from "./models.nodes.properties.general.js"
import { UsedNodeLabels, UsedDatasourceLabels } from "./enums.panther.js"
import { HasBands, HasColor, HasDocumentId, HasSpecificName, HasTimeseries, HasUrl } from "./models.nodes.properties.datasources.js"
import { Nullable } from "../coding/code.types.js"

/**
 * General graph node - same for all metadatata entities
 */
export interface PantherEntity {
    labels: Array<string | UsedNodeLabels | UsedDatasourceLabels>,
    key: string
    nameDisplay: string,
    nameInternal: string,
    description: Nullable<string>,
    lastUpdatedAt: number,
}

/**
 * Place node - somewhere in the world
 */
export interface Place extends PantherEntity, HasGeometry { }

/**
 * Period node - selected time in timeline
 */
export interface Period extends PantherEntity, HasInterval { }

/**
 * Area tree node - tree of areas
 */
export interface AreaTreeLevel extends PantherEntity, HasLevels { }

/**
 * Datasource with source configuration
 */
export interface Datasource extends PantherEntity, Partial<HasConfiguration & HasUrl & HasBands & HasTimeseries & HasSpecificName & HasColor & HasDocumentId> { }

/**
 * Application node - main entity in metadata model
 */
export interface ApplicationNode extends PantherEntity, Partial<HasConfiguration> { }

/**
 * Attribute node - describes a property of an entity
 * Like "temperature", "humidity", "population", etc.
 */
export interface Attribute extends PantherEntity, Partial<HasColor & HasUnits> {
}

/**
 * Represents a comprehensive Panther entity composed of the required core
 * PantherEntity shape plus a collection of optional feature mixins.
 *
 * The base PantherEntity provides the mandatory identity and core fields.
 * The additional capabilities are included via Partial<...>, so they may be
 * absent at runtime:
 * - HasGeometry: spatial geometry (e.g. GeoJSON) for spatial features.
 * - HasInterval: temporal interval or validity range for the entity.
 * - HasLevels: hierarchical or zoom/detail levels.
 * - HasConfiguration: rendering or domain-specific configuration data.
 * - HasUrl: an external URL or resource locator.
 * - HasBands: spectral band information (useful for raster/multiband data).
 * - HasSpecificName: alternate or more specific naming fields.
 * - HasColor: color or styling metadata.
 * - HasUnits: measurement units for numeric values.
 * - HasDocumentId: backend/document database identifier.
 * - HasTimeseries: timeseries metadata or embedded series data.
 *
 * Use this interface when you need a single type that can represent a fully
 * featured Panther entity. Consumers should always check for the presence of
 * optional properties before accessing them.
 */
export interface FullPantherEntity extends PantherEntity, Partial<HasGeometry & HasInterval & HasLevels & HasConfiguration & HasUrl & HasBands & HasSpecificName & HasColor & HasUnits &  HasDocumentId & HasTimeseries> { }
