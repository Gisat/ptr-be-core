import { randomUUID } from "crypto"
import _ from "lodash"
import { validateNodeLabels } from "./validations.shared"
import { parseSinglePantherNode } from "./parse.changeNodes"
import { GraphEdge, GraphRelation } from "../../globals/panther/models.edges"
import { UsedEdgeLabels } from "../../globals/panther/enums.panther"
import { isInEnum } from "../../globals/coding/code.formating"
import { InvalidRequestError } from "./errors.api"
import { FullPantherEntity, PantherEntity } from "../../globals/panther/models.nodes"

/**
 * Parses a node object from the Arrows JSON format and converts it into a `PantherEntity`.
 *
 * Validates that the node's labels are arrays of supported enum values, and constructs
 * a `PantherEntity` object with the appropriate properties. Throws an `InvalidRequestError`
 * if the labels are not valid.
 *
 * @param node - The node object from the Arrows JSON to parse.
 * @returns A `PantherEntity` object representing the parsed node.
 * @throws {InvalidRequestError} If the node's labels are not an array of supported values.
 */
const parseNodeFromArrows = (node: any): FullPantherEntity => {
    const { labels, properties, id, caption } = node

    validateNodeLabels(labels)

    const basicGraphResult: FullPantherEntity = parseSinglePantherNode({
        labels: labels as string[],
        key: properties.key as string ?? id ?? randomUUID(),
        nameDisplay: caption ?? properties.nameDisplay as string ?? "",
        ...properties
    })

    return basicGraphResult
}


/**
 * Parses an edge object from the Arrows format and converts it into a `GraphEdge`.
 *
 * @param edge - The edge object to parse, containing details about the graph edge.
 * @returns A `GraphEdge` object containing the parsed edge nodes, label, and properties.
 *
 * @throws {InvalidRequestError} If the edge does not have a type (`label`).
 * @throws {InvalidRequestError} If the edge type (`label`) is not supported.
 * @throws {InvalidRequestError} If the edge does not have properties.
 * @throws {InvalidRequestError} If the edge does not have `fromId` or `toId`.
 * @throws {InvalidRequestError} If the `fromId` and `toId` are the same.
 */
const parseEdgeFromArrows = (edge: any): GraphEdge => {
    const {
        fromId: from,
        toId: to,
        type,
        properties
    } = edge

    // Determine the label, defaulting to "RelatedTo" if the type is invalid or not provided
    const label = (typeof type === "string" && type.trim().length > 0) 
        ? type.trim() as UsedEdgeLabels
        : UsedEdgeLabels.RelatedTo
        
    // validate the edge properties
    if (!isInEnum(label, UsedEdgeLabels))
        throw new InvalidRequestError(`Graph edge type '${label}' is not supported`)

    // edge must have a properties
    if (!properties)
        throw new InvalidRequestError(`Graph edge must have properties`)

    // edge must have fromId and toId
    if (!from || !to)
        throw new InvalidRequestError(`Graph edge must have fromId and toId`)

    if (from === to)
        throw new InvalidRequestError(`Cannot connect two same keys in graph relation (${from} leads to ${to})`)

    // prepare relation tuple
    const result: GraphRelation = [from, to]

    // construct the parsed edge object
    const parsedEdge: GraphEdge = {
        edgeNodes: result,
        label,
        properties
    }

    // return the parsed edge
    return parsedEdge
}

/**
 * Parses a JSON object representing nodes and relationships (edges) from the Arrows JSON.
 *
 * @param body - The input JSON object to parse. Expected to contain `nodes` and `relationships` arrays.
 * @returns An object containing parsed `nodes` and `edges` arrays.
 * @throws {InvalidRequestError} If the input is not a valid object, or if required properties are missing or not arrays.
 */
export const parseArrowsJson = (body: unknown): { nodes: FullPantherEntity[]; edges: GraphEdge[] } => {

    // Check if the body is a valid object
    if (typeof body !== "object" || body === null)
        throw new InvalidRequestError("Invalid JSON format")

    // Check if the body contains the required properties
    if (!("nodes" in body) || !("relationships" in body))
        throw new InvalidRequestError("Invalid JSON format: Missing nodes or relationships")

    // Check if nodes and relationships are arrays
    if (!_.isArray((body as any).nodes) || !_.isArray((body as any).relationships))
        throw new InvalidRequestError("Invalid JSON format: nodes and relationships must be arrays")

    // Extract nodes and relationships from the body
    const { nodes: rawNodes, relationships: rawEdges } = body as any

    // Define default values for nodes and edges
    const nodes: PantherEntity[] = rawNodes ?? []
    const edges: GraphEdge[] = rawEdges ?? []

    // Parse nodes and edges using the defined functions
    const parsedNodes = nodes.map((node: any) => parseNodeFromArrows(node))
    const parsedEdges = edges.map((edge: any) => parseEdgeFromArrows(edge))

    return {
        nodes: parsedNodes,
        edges: parsedEdges
    }
}