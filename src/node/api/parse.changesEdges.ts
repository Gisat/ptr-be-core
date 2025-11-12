import _ from "lodash"
import { InvalidRequestError } from "./errors.api"
import { GraphEdge, GraphRelation } from "../../globals/panther/models.edges"
import { enumValuesToString, isInEnum } from "../../globals/coding/code.formating"
import { UsedEdgeLabels } from "../../globals/panther/enums.panther"

export const parseRichEdges = (body: unknown): GraphEdge[] => {

    const parseSingleEdge = (edge: unknown): GraphEdge => {

        const {label, fromKey, toKey, properties } = edge as any

        if (!label || typeof label !== "string")
            throw new InvalidRequestError("Every graph edge must have string label")

        if (!isInEnum(label, UsedEdgeLabels))
            throw new InvalidRequestError(`Graph edge label is not allowed (${label}). Must be one of: ${enumValuesToString(UsedEdgeLabels)}`)

        if (!fromKey || typeof fromKey !== "string")
            throw new InvalidRequestError("Every graph edge must have string fromKey")

        if (!toKey || typeof toKey !== "string")
            throw new InvalidRequestError("Every graph edge must have string toKey")

        if (fromKey === toKey)
            throw new InvalidRequestError(`Cannot connect two same keys in graph edge (${fromKey})`)

        const parsedEdge: GraphEdge = {
            label: label as UsedEdgeLabels,
            edgeNodes: [fromKey, toKey],
            properties: properties || {}
        }

        return parsedEdge
    }
    const edgesRaw = body as any[]
    
    if (!_.isArray(edgesRaw))
        throw new InvalidRequestError("Graph edges must be an array of edges")

    if (edgesRaw.length === 0)
        throw new InvalidRequestError("Graph edges array must not be empty")

    const parsedEdges = edgesRaw.map(edge => parseSingleEdge(edge))
    return parsedEdges
}

/**
 * Parse body to graph relation
 * @param body Body from request
 * @returns Graph relation
 */
export const parseEqualEdges = (body: unknown): GraphRelation[] => {
    const relations = body as any[]

    /**
     * Check single edge relation and parse it
     * @param edgeRelation 
     * @returns Parsed edge relation
     */
    const parseSingleEdgeRelation = (edgeRelation: unknown): GraphRelation => {

        if (!_.isArray(edgeRelation))
            throw new InvalidRequestError("Every graph relation must be two element string tuple [string, string]")

        if (edgeRelation.length !== 2)
            throw new InvalidRequestError("Every graph relation must be two element string tuple [string, string]")

        if (edgeRelation[0] === edgeRelation[1])
            throw new InvalidRequestError(`Cannot connect two same keys in graph relation (${edgeRelation[0]})`)

        return edgeRelation as GraphRelation
    }

    if (!_.isArray(relations))
        throw new InvalidRequestError("Graph edges must be an array of tuples")

    const validatedGraphEdges = relations.map(edge => parseSingleEdgeRelation(edge))

    return validatedGraphEdges
} 