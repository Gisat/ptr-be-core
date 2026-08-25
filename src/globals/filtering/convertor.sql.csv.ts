/**
 * INFO: CSV Tansport format
 * We encode the filter into CSV format
 * The singe filter is a single CSL line
 * Format : chainingInfo,  attibute , fromValue , toValue , equal , equalMany , orderBy , ascending , groupBy , geometry
 * ChainingInfo: empty for first row, then "and" or "or"
 * Geometry is an optional GeoJSON Polygon serialized as a JSON string in its own cell.
 *
 * Transport: `webEncodeFilterCSV` wraps this CSV in a single-line
 * RFC 4648 §5 Base64url string (URL-safe, unpadded) for opacity and safe
 * use in URLs/query params. A consuming backend must decode with the same
 * scheme. This is encoding for compactness, not encryption.
 */


/** GeoJSON Polygon geometry: an outer ring of [lng, lat] coordinate tuples. */
export interface Polygon {
    type: "Polygon"
    coordinates: number[][][]
}

/** Describes a filter query for Panther attribute-based filtering. */
export interface PantherAttributeQuery {

    /** Chaining info: empty for first filter, "and" or "or" for subsequent ones. */
    chainingInfo?: "and" | "or"

    /** Attribute name to filter on. */
    attributeName: string

    /** Lower bound for range filtering. */
    fromValue?: number

    /** Upper bound for range filtering. */
    toValue?: number

    /** Exact match value (string, number, or boolean). */
    equal?: string | number | boolean

    /** Multiple possible exact-match values. */
    equalMany?: (string | number | boolean)[]

    /** Column to order results by. */
    orderBy?: string

    /** Sort direction. */
    ascending: "ascend" | "descend"

    /** Column to group results by. */
    groupBy?: string

    /** Optional spatial polygon to filter by. */
    geometry?: Polygon
}

/**
 * Creates a fluent builder for constructing a chain of {@link PantherAttributeQuery} filters.
 *
 * @returns An object with chained setter methods, `nextAttribute` to start the next filter,
 *          `result()` to get all filters, and `returnLineCSV()` to serialise as multi-line CSV.
 */
export const PantherFilter = () => {
    // Accumulate committed filters; current is the one being edited
    const filters: PantherAttributeQuery[] = []

    let current: PantherAttributeQuery = {} as any

    // Expose chainable setters and terminal methods
    const build = {

        /** Set the attribute name to filter on. */
        attribute: (name: string) => (current.attributeName = name, build),

        /** Set the lower bound for range filtering. */
        from: (value: number) => (current.fromValue = value, build),

        /** Set the upper bound for range filtering. */
        to: (value: number) => (current.toValue = value, build),

        /** Set an exact match value (string, number, or boolean). */
        equal: (value: string | number | boolean) => (current.equal = value, build),

        /** Set multiple possible exact-match values. */
        equalMany: (values: (string | number | boolean)[]) => (current.equalMany = values, build),

        /** Set the column to order results by. */
        orderBy: (column: string) => (current.orderBy = column, build),

        /** Set sort direction to ascending. */
        ascend: () => (current.ascending = "ascend", build),

        /** Set sort direction to descending. */
        descend: () => (current.ascending = "descend", build),

        /** Set the column to group results by. */
        groupBy: (column: string) => (current.groupBy = column, build),

        /** Set a spatial polygon to filter by. */
        geometry: (value: Polygon) => (current.geometry = value, build),

        /**
         * Commit current filter and start a new one with the given chaining operator.
         *
         * @param name - Attribute name for the next filter.
         * @param chaining - Logical connector: "and" or "or".
         * @returns The builder instance for further chaining.
         */
        nextAttribute: (name: string, chaining: "and" | "or") => {
            filters.push({ ...current })
            current = { attributeName: name, chainingInfo: chaining } as any

            return build
        },

        /** Return all filters assembled so far. */
        result: () => [...filters, { ...current }],

        /**
         * Serialise all filters into multi-line CSV, preserving empty slots for unset fields.
         *
         * @returns Multi-line CSV string with one filter per row.
         */
        returnCSV: () => [...filters, current].map((f) => [
            f.chainingInfo ?? "",
            f.attributeName,
            f.fromValue,
            f.toValue,
            f.equal,
            f.equalMany ? JSON.stringify(f.equalMany) : "",
            f.orderBy,
            f.ascending,
            f.groupBy,
            f.geometry ? JSON.stringify(f.geometry) : ""
        ].map((v) => v ?? "").join(", ")).join("\n"),

        /**
         * Serialize all filters into the single-line RFC 4648 §5 Base64url
         * transport string (opaque, URL-safe). Decode with `webDecodeFilterCSV`.
         *
         * @returns The Base64url-encoded transport string.
         */
        returnEncodedCSV: () => webEncodeFilterCSV([...filters, current])
    }

    return build
}

/**
 * Parses multi-line CSV (one filter per row) back into an array of {@link PantherAttributeQuery}.
 * Empty slots become undefined; numeric and boolean values are converted back to native types.
 *
 * @param lines - Multi-line CSV produced by `returnLineCSV`.
 * @returns The reconstructed list of filter queries.
 */
export const parsePantherFilterCSV = (lines: string): PantherAttributeQuery[] => {

    /**
     * Converts a raw CSV field back into a boolean, number, or string value.
     *
     * @param value - Raw string from the CSV field.
     * @returns The value as boolean, number, or original string.
     */
    const parseCSVValue = (value: string): string | number | boolean => {
        if (value === "true") return true

        if (value === "false") return false

        if (value !== "" && !isNaN(Number(value))) return Number(value)

        return value
    }

    return lines.split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => {
            // Split into 10 columns: chainingInfo, attributeName, fromValue, toValue, equal, equalMany, orderBy, ascending, groupBy, geometry
            const [chainingInfo, attributeName, fromValue, toValue, equal, equalMany, orderBy, ascending, groupBy, geometry] =
                line.split(", ").map((field) => field.trim())

            // Rebuild the filter, leaving empty slots undefined and defaulting sort direction
            return {
                chainingInfo: (chainingInfo === "and" || chainingInfo === "or" ? chainingInfo : undefined),
                attributeName,
                fromValue: fromValue !== "" ? Number(fromValue) : undefined,
                toValue: toValue !== "" ? Number(toValue) : undefined,
                equal: equal !== "" ? parseCSVValue(equal) : undefined,
                equalMany: equalMany !== "" && equalMany ? JSON.parse(equalMany) : undefined,
                orderBy: orderBy !== "" ? orderBy : undefined,
                ascending: (ascending === "ascend" || ascending === "descend" ? ascending : "ascend"),
                groupBy: groupBy !== "" ? groupBy : undefined,
                geometry: geometry !== "" && geometry ? JSON.parse(geometry) : undefined
            }
        })
}

/**
 * Encodes a string into RFC 4648 §5 Base64url (URL-safe, no padding).
 * Works in both browsers (`btoa`) and Node (`Buffer`).
 *
 * @param value - Raw string to encode.
 * @returns The Base64url-encoded string.
 */
const webToBase64url = (value: string): string => {
    const base64 = typeof Buffer !== "undefined"
        ? Buffer.from(value, "utf8").toString("base64")
        : btoa(value)

    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/**
 * Decodes a RFC 4648 §5 Base64url string back to its original form.
 * Throws if the input is not valid Base64url.
 *
 * @param value - Base64url-encoded string.
 * @returns The decoded string.
 */
const webFromBase64url = (value: string): string => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/")

    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)

    if (typeof Buffer !== "undefined") {
        return Buffer.from(padded, "base64").toString("utf8")
    }

    return atob(padded)
}

/**
 * Builds the same multi-line CSV serialization used by `PantherFilter.returnCSV`
 * from a list of filter queries.
 *
 * @param filters - The filter queries to serialize.
 * @returns The multi-line CSV string.
 */
const toCSV = (filters: PantherAttributeQuery[]): string => filters.map((f) => [
    f.chainingInfo ?? "",
    f.attributeName,
    f.fromValue,
    f.toValue,
    f.equal,
    f.equalMany ? JSON.stringify(f.equalMany) : "",
    f.orderBy,
    f.ascending,
    f.groupBy,
    f.geometry ? JSON.stringify(f.geometry) : ""
].map((v) => v ?? "").join(", ")).join("\n")

/**
 * Serializes filter queries into a single opaque, URL-safe transport string
 * (RFC 4648 §5 Base64url encoding of the CSV format documented above).
 *
 * This does not encrypt the payload; it only makes it compact and hard to
 * guess. A separate backend must decode it with the same scheme.
 *
 * @param filters - The filter queries to encode.
 * @returns A single-line Base64url string.
 */
export const webEncodeFilterCSV = (filters: PantherAttributeQuery[]): string =>
    webToBase64url(toCSV(filters))

/**
 * Deserializes a Base64url transport string back into filter queries.
 *
 * Validates that the input is a non-empty Base64url string before decoding.
 *
 * @param encoded - The single-line Base64url string produced by `webEncodeFilterCSV`.
 * @returns The reconstructed list of filter queries.
 * @throws If the input is empty or not valid Base64url encoding.
 */
export const webDecodeFilterCSV = (encoded: string): PantherAttributeQuery[] => {
    if (typeof encoded !== "string" || encoded.trim() === "") {
        throw new Error("webDecodeFilterCSV: input must be a non-empty Base64url string, got empty value")
    }

    if (!/^[A-Za-z0-9_-]+$/.test(encoded)) {
        throw new Error("webDecodeFilterCSV: input contains invalid Base64url characters (expected A-Za-z0-9, '_' or '-')")
    }

    const csv = webFromBase64url(encoded)

    if (csv.trim() === "") {
        throw new Error("webDecodeFilterCSV: decoded payload is empty")
    }

    return parsePantherFilterCSV(csv)
}