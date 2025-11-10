import { HasGeometry, HasInterval, HasLevels, HasConfiguration, HasUnits } from "./models.nodes.properties.general.js"
import { UsedNodeLabels, UsedDatasourceLabels } from "./enums.panther.js"
import { HasColor, HasSpecificName } from "./models.nodes.properties.datasources.js"
import { Nullable } from "../coding/code.types.js"
import { FullDatasourceProperties } from "./models.groups.js"

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

export interface MapStyle extends PantherEntity, Partial<HasSpecificName> { }

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
export interface Datasource extends PantherEntity, Partial<FullDatasourceProperties> { }

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
 * Represents a full panther entity which extends the basic PantherEntity
 * and optionally includes geometry, interval, levels, and configuration properties.
 * 
 * @extends PantherEntity
 * @extends Partial<HasGeometry>
 * @extends Partial<HasInterval>
 * @extends Partial<HasLevels>
 * @extends Partial<HasConfiguration>
 * @extends Partial<HasUrl>
 * @extends Partial<HasBands>
 * @extends Partial<HasSpecificName>
 * @extends Partial<HasColor>
 * @extends Partial<HasUnits>
 */