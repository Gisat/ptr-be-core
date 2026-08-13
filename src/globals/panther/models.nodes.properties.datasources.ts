import { UsedTimeseriesSteps } from "./enums.panther"
import { HasInterval } from "./models.nodes.properties.general"

/**
 * Represents a datasource that has a unique document ID.
 * Used for datasets like vector layers that share a single identifier across services.
 */
export interface HasDocumentId {
    documentId: string
}

/**
 * Datasource with spectral band information, e.g. satellite imagery.
 * Bands, names, and periods are stored as arrays — order of values is significant.
 */
export interface HasBands {
    bands: number[]
    bandNames: string[]
    bandPeriods: string[]
}

/**
 * Datasource accessible via a URL.
 * Used for online resources and services (WMS, COG, etc.).
 */
export interface HasUrl {
    url: string
}

/**
 * Datasource representing time series data with a time interval and step granularity.
 * Extends HasInterval with a step property (year, quarter, month, week, day).
 */
export interface HasTimeseries extends HasInterval {
    step: UsedTimeseriesSteps
}

/**
 * Style datasource with a specific name identifier.
 * Used for entities that need a unique style name or title.
 */
export interface HasSpecificName {
    specificName: string
}

/**
 * Style datasource with a color property defined as a hexadecimal code.
 */
export interface HasColor {
    color: string // Hex color code
}

