export interface PantherAttributeQuery {
    attributeName: string
    fromValue?: number
    toValue?: number
    equal?: string | number | boolean
    orderBy?: string
    ascending: "ascend" | "descend"
    groupBy?: string
}


export const PantherFilter = () => {
    let filter: PantherAttributeQuery = {} as any

    const build = {
        attribute: (name: string) => (filter.attributeName = name, build),
        from: (value: number) => (filter.fromValue = value, build),
        to: (value: number) => (filter.toValue = value, build),
        equal: (value: string | number | boolean) => (filter.equal = value, build),
        orderBy: (column: string) => (filter.orderBy = column, build),
        ascend: () => (filter.ascending = "ascend", build),
        descend: () => (filter.ascending = "descend", build),
        groupBy: (column: string) => (filter.groupBy = column, build),
        result: () => ({ ...filter })
    }

    return build
}