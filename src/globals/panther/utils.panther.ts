import { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "./enums.panther"
import { GraphEdge } from "./models.edges"
import { FullPantherEntity } from "./models.nodes"

/**
 * Find the first node in the array whose labels include the given label.
 *
 * @param nodes - Array of entities to search.
 * @param label - Label to match (datasource or node label).
 * @returns The first matching entity, or undefined if none found.
 */
export const findNodeByLabel = (
  nodes: FullPantherEntity[],
  label: UsedDatasourceLabels | UsedNodeLabels): FullPantherEntity | undefined => {
  return nodes.find(n => n.labels.includes(label))
}

/**
 * Filter an array of entities to only those containing the specified label.
 *
 * @param nodes - Array of entities to filter.
 * @param label - Label to match (datasource or node label).
 * @returns New array with only matching entities.
 */
export const filterNodeByLabel = (
  nodes: FullPantherEntity[],
  label: UsedDatasourceLabels | UsedNodeLabels): FullPantherEntity[] => {
  return nodes.filter(n => n.labels.includes(label))
}

/**
 * Find the first edge whose label matches the given value.
 *
 * @param edges - Array of edges to search.
 * @param label - Label to match.
 * @returns The first matching edge, or undefined if none found.
 */
export const findEdgeByLabel = (
  edges: GraphEdge[],
  label: UsedEdgeLabels): GraphEdge | undefined => {
  return edges.find(e => e.label === label)
}

/**
 * Filter an array of edges to only those with the specified label.
 *
 * @param edges - Array of edges to filter.
 * @param label - Label to match.
 * @returns New array with only matching edges.
 */
export const filterEdgeByLabel = (
  edges: GraphEdge[],
  label: UsedEdgeLabels): GraphEdge[] => {
  return edges.filter(e => e.label === label)
}