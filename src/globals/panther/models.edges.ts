import type { Nullable } from "../coding/code.types.js"
import { UsedEdgeLabels } from "./enums.panther.js"
import { FullEdgeProperties } from "./models.groups.js"

/**
 * Tuple for relation between two graph nodes
 * It is point to point definition of graph edge
 */
export type GraphRelation = [string, string]

/**
 * Edge of the graph model.
 * It connects two graph nodes and have some properties.
 * Have "key" witch is composed from node keys.
 */
export interface GraphEdge{
    label: UsedEdgeLabels,
    edgeNodes: GraphRelation
    properties: Nullable<FullEdgeProperties>
}