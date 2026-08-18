/**
 * CSV Tansport format
 * We encode the filter into CSV format
 * The singe filter is a single CSL line
 * Format : attibute , fromValue , toValue , equal , orderBy , ascending , groupBy
 */


/** Describes a filter query for Panther attribute-based filtering. */
export interface PantherAttributeQuery {
    /** Attribute name to filter on. */
    attributeName: string
    /** Lower bound for range filtering. */
    fromValue?: number
    /** Upper bound for range filtering. */
    toValue?: number
    /** Exact match value (string, number, or boolean). */
    equal?: string | number | boolean
    /** Column to order results by. */
    orderBy?: string
    /** Sort direction. */
    ascending: "ascend" | "descend"
    /** Column to group results by. */
    groupBy?: string
}

/**
 * Creates a fluent builder for constructing a {@link PantherAttributeQuery}.
 *
 * @returns An object with chained setter methods and a final `result()` accessor.
 */
export const PantherFilter = () => {
    // Initialise empty filter object
    let filter: PantherAttributeQuery = {} as any

    // Expose chainable setters and a terminal result method
    const build = {
        attribute: (name: string) => (filter.attributeName = name, build),
        from: (value: number) => (filter.fromValue = value, build),
        to: (value: number) => (filter.toValue = value, build),
        equal: (value: string | number | boolean) => (filter.equal = value, build),
        orderBy: (column: string) => (filter.orderBy = column, build),
        ascend: () => (filter.ascending = "ascend", build),
        descend: () => (filter.ascending = "descend", build),
        groupBy: (column: string) => (filter.groupBy = column, build),
        /** Return a shallow copy of the assembled filter object. */
        result: () => ({ ...filter }),
        /** Serialize the assembled filter into a CSV line, keeping empty slots for unset fields. */
        returnLineCSV: () => [
            filter.attributeName,
            filter.fromValue,
            filter.toValue,
            filter.equal,
            filter.orderBy,
            filter.ascending,
            filter.groupBy
        ].map((v) => v ?? "").join(", ")
    }

    return build
}

/** Converts a raw CSV field back into a boolean, number, or string value. */
const parseCSVValue = (value: string): string | number | boolean => {
    if (value === "true") return true
    if (value === "false") return false
    if (value !== "" && !isNaN(Number(value))) return Number(value)
    return value
}

/**
 * Parses a CSV line in the declared transport format back into a {@link PantherAttributeQuery}.
 * Empty slots become undefined; numeric and boolean values are converted back to native types.
 *
 * @param line - CSV line produced by `returnLineCSV`.
 * @returns The reconstructed filter query.
 */
export const parseFilterCSV = (line: string): PantherAttributeQuery => {
    // Split into fields and strip surrounding whitespace
    const [attributeName, fromValue, toValue, equal, orderBy, ascending, groupBy] =
        line.split(", ").map((field) => field.trim())

    // Rebuild the filter, leaving empty slots undefined and defaulting sort direction
    return {
        attributeName,
        fromValue: fromValue !== "" ? Number(fromValue) : undefined,
        toValue: toValue !== "" ? Number(toValue) : undefined,
        equal: equal !== "" ? parseCSVValue(equal) : undefined,
        orderBy: orderBy !== "" ? orderBy : undefined,
        ascending: (ascending === "ascend" || ascending === "descend" ? ascending : "ascend"),
        groupBy: groupBy !== "" ? groupBy : undefined
    }
}