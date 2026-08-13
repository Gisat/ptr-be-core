import type { Nullable } from "../coding/code.types.js"
import { UsedEdgeLabels } from "./enums.panther.js"
import { FullEdgeProperties } from "./models.edges.properties.js"

/**
 * Tuple representing a directed relation between two graph nodes.
 * First element is the source key, second is the target key.
 */
export type GraphRelation = [string, string]

/**
 * Edge of the Panther graph model.
 * Connects two graph nodes via a labelled relation with optional properties.
 */
export interface GraphEdge{
    label: UsedEdgeLabels,
    edgeNodes: GraphRelation
    properties: Nullable<FullEdgeProperties>
}