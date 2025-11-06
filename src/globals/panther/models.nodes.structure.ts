import { GraphEdge } from "./models.edges";

/**
 * Represents an object that exposes a collection of neighbouring items.
 *
 * The `neighbours` array contains zero or more related elements of type `T`.
 * Implementations should document whether the array is ordered, whether duplicates
 * are allowed, and whether `null`/`undefined` values may appear. Modifying the array
 * (e.g. pushing or splicing) mutates the host object and may affect other consumers
 * that hold a reference to the same instance.
 *
 * @typeParam T - The element type stored in the `neighbours` array.
 * @property neighbours - An array of neighbouring items of type `T`.
 */
export interface HasNeighbours<T> {
    neighbours: T[]; 
}

/**
 * Represents a construct that exposes a collection of graph connections.
 *
 * Implementations provide an array of GraphEdge instances that describe the relationships
 * (edges) associated with the entity — for example, connections from or to a graph node.
 *
 * Remarks:
 * - The array may be empty to indicate no connections.
 * - Implementations are responsible for keeping the array consistent when edges are added,
 *   removed or updated.
 *
 * @property edges - The list of GraphEdge objects representing this entity's connections.
 */
export interface HasEdges{
    edges: GraphEdge[]; 
}

/**
 * Represents a node and its neighbouring nodes.
 *
 * @typeParam T - The type of the node and its neighbours.
 * @property node - The main node, or `null` if not present.
 * @property neighbours - An array of neighbouring nodes.
 * @property edges - An array of edges connecting the node to its neighbours.
 */
export interface NodeWithNeighbours<T> extends HasNeighbours<T>, HasEdges {
    node: T;
}