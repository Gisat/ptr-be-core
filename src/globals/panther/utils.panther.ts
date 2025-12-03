import { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "./enums.panther"
import { GraphEdge } from "./models.edges"
import { FullPantherEntity } from "./models.nodes"

/**
 * Finds the first node in the provided list that contains the specified label.
 *
 * Searches the given array of FullPantherEntity objects and returns the first entity
 * whose `labels` array includes the provided label.
 *
 * @param nodes - Array of FullPantherEntity objects to search through.
 * @param label - Label to match; may be a UsedDatasourceLabels or UsedNodeLabels.
 * @returns The first FullPantherEntity whose `labels` includes `label`, or `undefined`
 *          if no such entity is found.
 *
 * @remarks
 * - The search stops at the first match (uses `Array.prototype.find`).
 * - Label comparison is exact (uses `Array.prototype.includes`), so it is case-sensitive
 *   and requires the same string instance/value.
 *
 * @example
 * const result = findNodeByLabel(nodes, 'datasource-main');
 * if (result) {
 *   // found a node that has the 'datasource-main' label
 * }
 */
export const findNodeByLabel = (
  nodes: FullPantherEntity[],
  label: UsedDatasourceLabels | UsedNodeLabels): FullPantherEntity | undefined => {
  return nodes.find(n => n.labels.includes(label))
}

/**
 * Filters an array of FullPantherEntity objects, returning only those that contain the specified label.
 *
 * The function performs a shallow, non-mutating filter: it returns a new array and does not modify the input.
 * Matching is done using Array.prototype.includes on each entity's `labels` array (strict equality).
 *
 * @param nodes - The array of entities to filter.
 * @param label - The label to match; can be a UsedDatasourceLabels or UsedNodeLabels value.
 * @returns A new array containing only the entities whose `labels` array includes the provided label.
 *
 * @remarks
 * Time complexity is O(n * m) where n is the number of entities and m is the average number of labels per entity.
 *
 * @example
 * ```ts
 * const matched = filterNodeByLabel(entities, 'MY_LABEL');
 * ```
 */
export const filterNodeByLabel = (
  nodes: FullPantherEntity[],
  label: UsedDatasourceLabels | UsedNodeLabels): FullPantherEntity[] => {
  return nodes.filter(n => n.labels.includes(label))
}

/**
 * Finds the first edge in the provided array whose label strictly equals the given label.
 *
 * @param edges - Array of GraphEdge objects to search.
 * @param label - The UsedEdgeLabels value to match against each edge's `label` property.
 * @returns The first matching GraphEdge if found; otherwise `undefined`.
 *
 * @example
 * const edge = findEdgeByLabel(edges, 'dependency');
 * if (edge) {
 *   // handle found edge
 * }
 */
export const findEdgeByLabel = (
  edges: GraphEdge[],
  label: UsedEdgeLabels): GraphEdge | undefined => {
  return edges.find(e => e.label === label)
}

/**
 * Filters a list of GraphEdge objects by a specific edge label.
 *
 * Returns a new array containing only those edges whose `label` property
 * strictly equals the provided `label` argument. The original `edges`
 * array is not mutated.
 *
 * @param edges - Array of GraphEdge objects to filter.
 * @param label - The label to match; comparison is performed using strict (`===`) equality.
 * @returns A new array of GraphEdge objects whose `label` matches the provided label. Returns an empty array if no edges match.
 *
 * @remarks
 * Time complexity: O(n), where n is the number of edges.
 *
 * @example
 * // const result = filterEdgeByLabel(edges, 'CONNECTS');
 */
export const filterEdgeByLabel = (
  edges: GraphEdge[],
  label: UsedEdgeLabels): GraphEdge[] => {
  return edges.filter(e => e.label === label)
}