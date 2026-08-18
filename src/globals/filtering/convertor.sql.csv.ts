/**
 * INFO: CSV Tansport format
 * We encode the filter into CSV format
 * The singe filter is a single CSL line
 * Format : chainingInfo,  attibute , fromValue , toValue , equal , orderBy , ascending , groupBy
 * ChainingInfo: empty for first row, then "and" or "or"
 */


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

    /** Column to order results by. */
    orderBy?: string

    /** Sort direction. */
    ascending: "ascend" | "descend"

    /** Column to group results by. */
    groupBy?: string
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

        /** Set the column to order results by. */
        orderBy: (column: string) => (current.orderBy = column, build),

        /** Set sort direction to ascending. */
        ascend: () => (current.ascending = "ascend", build),

        /** Set sort direction to descending. */
        descend: () => (current.ascending = "descend", build),

        /** Set the column to group results by. */
        groupBy: (column: string) => (current.groupBy = column, build),

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
            f.orderBy,
            f.ascending,
            f.groupBy
        ].map((v) => v ?? "").join(", ")).join("\n")
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
            // Split into 8 columns: chainingInfo, attributeName, fromValue, toValue, equal, orderBy, ascending, groupBy
            const [chainingInfo, attributeName, fromValue, toValue, equal, orderBy, ascending, groupBy] =
                line.split(", ").map((field) => field.trim())

            // Rebuild the filter, leaving empty slots undefined and defaulting sort direction
            return {
                chainingInfo: (chainingInfo === "and" || chainingInfo === "or" ? chainingInfo : undefined),
                attributeName,
                fromValue: fromValue !== "" ? Number(fromValue) : undefined,
                toValue: toValue !== "" ? Number(toValue) : undefined,
                equal: equal !== "" ? parseCSVValue(equal) : undefined,
                orderBy: orderBy !== "" ? orderBy : undefined,
                ascending: (ascending === "ascend" || ascending === "descend" ? ascending : "ascend"),
                groupBy: groupBy !== "" ? groupBy : undefined
            }
        })
}