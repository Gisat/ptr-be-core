import { UsedTimeseriesSteps } from "./enums.panther"
import { HasInterval } from "./models.nodes.properties.general"

/**
 * Represents a datasource that has a document ID.
 * The document ID is a unique identifier for the document.
 * Example is vector dataset, that has one unique document ID for all backend services and frontends.
 */
export interface HasDocumentId {
    documentId: string
}

/**
 * Datasource that has bands, e.g. satellite imagery
 * Bands have CSV format - order of values is important.
 * Bands are used to represent different spectral bands in satellite imagery.
 * Each band can have a name and a period (e.g., wavelength).
 */
export interface HasBands {
    bands: number[]
    bandNames: string[]
    bandPeriods: string[]
}

/**
 * Datasource that has a URL, e.g. a link to a resource or a service.
 * This is used for entities that can be accessed via a URL.
 */
export interface HasUrl {
    url: string
}

/**
 * Datasource representing time series data
 * Has relevant time interval and step.
 * @extends HasInterval
 */
export interface HasTimeseries extends HasInterval {
    step: UsedTimeseriesSteps
}

/**
 * Style Datasource that has a specific name, e.g. a unique identifier or a specific title.
 * This is used for entities that need to be identified by a specific name.
 */
export interface HasSpecificName {
    specificName: string
}

/**
 * Style Datasource that has a color property.
 * The color is defined as a hexadecimal color code.
 */
export interface HasColor {
    color: string // Hex color code
}

