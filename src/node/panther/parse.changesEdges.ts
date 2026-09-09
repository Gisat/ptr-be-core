import { InvalidRequestError } from "../api/models.errors"
import { GraphEdge, GraphRelation } from "../../globals/panther/models.edges"
import { enumValuesToString, isInEnum } from "../../globals/coding/code.formating"
import { UsedEdgeLabels } from "../../globals/panther/enums.panther"

/**
 * Parse and validate an array of rich edge objects from a request body.
 * Each edge must have a label, fromKey, toKey, and optional properties.
 *
 * @param body - Array of raw edge objects from the request body.
 * @returns Array of parsed GraphEdge instances.
 * @throws {InvalidRequestError} If body is not an array, is empty, or any edge is invalid.
 */
export const parseRichEdges = (body: unknown): GraphEdge[] => {

    /**
     * Parse a single edge object, validating its label, fromKey, and toKey.
     *
     * @param edge - Raw edge object from the request body.
     * @returns Parsed GraphEdge with validated label, keys, and properties.
     * @throws {InvalidRequestError} If label, fromKey, or toKey are missing or invalid.
     */
    const parseSingleEdge = (edge: unknown): GraphEdge => {

        const {label, fromKey, toKey, properties } = edge as any

        // Validate label presence and type
        if (!label || typeof label !== "string")
            throw new InvalidRequestError("Every graph edge must have string label")

        // Validate label is a known edge type
        if (!isInEnum(label, UsedEdgeLabels))
            throw new InvalidRequestError(`Graph edge label is not allowed (${label}). Must be one of: ${enumValuesToString(UsedEdgeLabels)}`)

        // Validate fromKey presence and type
        if (!fromKey || typeof fromKey !== "string")
            throw new InvalidRequestError("Every graph edge must have string fromKey")

        // Validate toKey presence and type
        if (!toKey || typeof toKey !== "string")
            throw new InvalidRequestError("Every graph edge must have string toKey")

        // Prevent self-referencing edges
        if (fromKey === toKey)
            throw new InvalidRequestError(`Cannot connect two same keys in graph edge (${fromKey})`)

        // Build the parsed edge object
        const parsedEdge: GraphEdge = {
            label: label as UsedEdgeLabels,
            edgeNodes: [fromKey, toKey],
            properties: properties || {}
        }

        return parsedEdge
    }

    const edgesRaw = body as any[]
    
    // Validate the body is an array
    if (!Array.isArray(edgesRaw))
        throw new InvalidRequestError("Graph edges must be an array of edges")

    // Ensure the array is not empty
    if (edgesRaw.length === 0)
        throw new InvalidRequestError("Graph edges array must not be empty")

    // Parse each edge and collect the results
    const parsedEdges = edgesRaw.map(edge => parseSingleEdge(edge))

    return parsedEdges
}

/**
 * Parse and validate an array of graph relations (simple [string, string] tuples).
 *
 * @param body - Array of two-element string tuples from the request body.
 * @returns Array of validated GraphRelation tuples.
 * @throws {InvalidRequestError} If body is not an array or any relation is invalid.
 */
export const parseEqualEdges = (body: unknown): GraphRelation[] => {
    const relations = body as any[]

    /**
     * Validate a single edge relation tuple.
     * Must be a two-element array of strings with different values.
     *
     * @param edgeRelation - Raw relation tuple from the request body.
     * @returns Validated GraphRelation tuple.
     * @throws {InvalidRequestError} If the relation is not a valid two-element tuple.
     */
    const parseSingleEdgeRelation = (edgeRelation: unknown): GraphRelation => {

        // Ensure the relation is an array
        if (!Array.isArray(edgeRelation))
            throw new InvalidRequestError("Every graph relation must be two element string tuple [string, string]")

        // Ensure the relation has exactly two elements
        if (edgeRelation.length !== 2)
            throw new InvalidRequestError("Every graph relation must be two element string tuple [string, string]")

        // Prevent self-referencing relations
        if (edgeRelation[0] === edgeRelation[1])
            throw new InvalidRequestError(`Cannot connect two same keys in graph relation (${edgeRelation[0]})`)

        return edgeRelation as GraphRelation
    }

    // Validate the body is an array
    if (!Array.isArray(relations))
        throw new InvalidRequestError("Graph edges must be an array of tuples")

    // Validate each relation tuple
    const validatedGraphEdges = relations.map(edge => parseSingleEdgeRelation(edge))

    return validatedGraphEdges
} 