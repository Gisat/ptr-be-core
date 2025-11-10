/**
 * Datasource that has relevant time interval.
 * Example: Period is connected to some time range.
 */
export interface HasInterval {
    validIntervalIso: string,
    validFrom: number,
    validTo: number
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
 * Entity that has a specific name, e.g. a unique identifier or a specific title.
 * This is used for entities that need to be identified by a specific name.
 */
export interface HasSpecificName {
    specificName: string
}   


/**
 * Represents an entity that has a color property.
 * The color is defined as a hexadecimal color code.
 */
export interface HasColor{
    color: string // Hex color code
}

/**
 * Represents an entity that has a unit of measurement.
 */
export interface HasUnits{
    unit: string
    valueType: 'string' | 'number' | 'boolean' | 'date' | 'json'
}