import { RecordShape } from "neo4j-driver"

/**
 * Parses a node entity from a Neo4j database record.
 * @template T - The type of the node entity.
 * @param {RecordShape} record - The database record containing the node entity.
 * @returns {T} The parsed node entity.
 * @throws Will throw an error if the node entity is not found in the database record.
 */
export const parseNodesFromDb = <T>(record: RecordShape): T => {

    const nodeEntity = record?.node

    if (!nodeEntity) {
        throw new Error("Node Parsing: Node entity not found in database record")
    }

    const node: T = {
        labels: nodeEntity.labels,
        ...nodeEntity.properties,
    }

    return node
}

/**
 * Parses a node entity and its neighbours from a Neo4j database record.
 * @template T - The type of the node entity.
 * @param {RecordShape} record - The database record containing the node entity and its neighbours.
 * @returns {{ node: T, neighbours: any[] }} An object containing the parsed node entity and its neighbours.
 * @throws Will throw an error if the node entity is not found in the database record.
 */
export const parseNodesAndNeighboursFromDb = <T>(record: RecordShape): { node: T, neighbours: any[] } => {

    const nodeEntity = record?.node
    const neighboursEntities = record?.neighbours ?? []

    if (!nodeEntity) {
        throw new Error("Node Parsing: Node entity not found in database record")
    }

    const node: T = {
        labels: nodeEntity.labels,
        ...nodeEntity.properties,
    }

    const parsedNeighbours = neighboursEntities.map((neighbour: any) => ({
        labels: neighbour.labels,
        ...neighbour.properties,
    }))

    return { node, neighbours: parsedNeighbours }
}

/**
 * Converts an array of node labels into a string for Neo4j Cypher.
 * @param {string[]} labels - Array of node labels.
 * @returns {string} A string representing the labels for use in Cypher.
 */
export function reduceLabelsForCypher(labels: string[]): string {
    if (!Array.isArray(labels) || labels.length === 0) {
      return '';
    }
    // Join labels with `:` and prefix with `:` if not empty
    return `:${labels.join(':')}`;
  }
