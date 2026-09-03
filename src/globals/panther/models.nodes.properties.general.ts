/**
 * Represents a time interval with ISO 8601 string and computed timestamps.
 * Used by Period nodes and timeseries datasources.
 */
export interface HasInterval {
    intervalIso: string,
    timestampFrom: number,
    timestampTo: number
}

/**
 * Entity with a custom JSON configuration string.
 * Stores serialised configuration for datasources, applications, etc.
 */
export interface HasConfiguration {
    configuration: string // JSON string
}

/**
 * Entity with geographic geometry and bounding box.
 * Used by Place nodes to define spatial location.
 */
export interface HasGeometry {
    geometry: any,
    bbox: number[],
}

/**
 * Entity with a numeric level value.
 * Used by AreaTreeLevel nodes to define hierarchy depth.
 */
export interface HasLevels {
    level: number,
}

/**
 * Represents an entity that has a measurement unit and value type.
 * Used by Attribute nodes to describe property types.
 */
export interface HasUnits{
    unit: string
    valueType: 'string' | 'number' | 'boolean' | 'date' | 'json'
}
