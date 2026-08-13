import { GraphEdge } from "./models.edges";

/**
 * Generic interface for an object that holds a collection of neighbouring items.
 *
 * @typeParam T - The element type stored in the neighbours array.
 */
export interface HasNeighbours<T> {
    neighbours: T[]; 
}

/**
 * Interface for an object that exposes a list of graph edge connections.
 */
export interface HasEdges{
    edges: GraphEdge[]; 
}

/**
 * Represents a graph node together with its neighbouring nodes and connecting edges.
 *
 * @typeParam T - The type of the main node.
 * @typeParam U - The type of the neighbouring nodes.
 */
export interface NodeWithNeighbours<T, U>{
    node: T ;
    neighbours: U[];
    edges: GraphEdge[];
}