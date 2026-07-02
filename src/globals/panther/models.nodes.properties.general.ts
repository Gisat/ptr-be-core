/**
 * Datasource that has relevant time interval.
 * Example: Period is connected to some time range.
 */
export interface HasInterval {
    intervalIso: string,
    timestampFrom: number,
    timestampTo: number
}

/**
 * Entity with custom configuration
 */
export interface HasConfiguration {
    configuration: string // JSON string
}

/**
 * Place node - somewhere in the world
 */
export interface HasGeometry {
    geometry: any,
    bbox: number[],
}

/**
 * Place node - somewhere in the world
 */
export interface HasLevels {
    level: number,
}

/**
 * Represents an entity that has a unit of measurement.
 */
export interface HasUnits{
    unit: string
    valueType: 'string' | 'number' | 'boolean' | 'date' | 'json'
}