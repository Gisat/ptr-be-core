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
        result: () => ({ ...filter })
    }

    return build
}