import neo4j, { Driver } from 'neo4j-driver';


/**
 * Establishes a connection to a Neo4j database.
 *
 * @param dbString - The connection string for the Neo4j database.
 * @param user - The username for authentication.
 * @param password - The password for authentication.
 * @returns A promise that resolves to a Neo4j Driver instance.
 */
export const connectNeo4j = async (dbString: string, user: string, password: string): Promise<Driver> => {
    const driver = neo4j.driver(dbString, neo4j.auth.basic(user, password))
    return driver
}