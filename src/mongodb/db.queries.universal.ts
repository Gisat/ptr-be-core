// import { Db } from "mongodb";
// import { UsedCollections } from "./db.structure";
// import { UsedNodeLabels } from "@core/(shared)/panther/models.nodes";

// /**
//  * Find anything by single key
//  * @param key Database key
//  * @returns Filter for mongodb
//  */
// export const filterByKey = (key: string) => ({ "key": key }) as unknown

// /**
//  * Find entities by one of these keys
//  * @param key Database key
//  * @param includeMode Optional - for "all" value filter require all keys to be prensent in database. For "in" value search for some of them. 
//  * @returns Filter for mongodb
//  */
// export const filterByKeys = (keys: string[]) => ({ "key": { $in: [...keys] } })

// /**
//  * Filter all nodes by keys and it's type
//  * @param keys 
//  * @param nodeType 
//  * @returns 
//  */
// export const filterByKeysAndNodeType = (keys: string[], nodeType: UsedNodeLabels) => ({
//   "nodeType": nodeType, 
//   "key": { $in: [...keys] }
// })

// /**
//  * Find elements in collection by filter and retype it back as collection of results
//  * @param filter Query filter to select elements in collection
//  * @param collection Name of the collection
//  * @param db Database instance
//  * @param limit Optional - number of elements returned from request
//  * @param skip Optional - number of elements to be skipped
//  * @returns Array of elements from collection
//  */
// export const mongoFindByFilter = async <T>(filter: unknown, collection: string, db: Db, limit = 0, skip = 0): Promise<T[]> => {
//   const searchResult =
//     await db.collection(collection)
//       .find(filter as any, { limit, skip })
//       .project({ _id: false })
//       .toArray()

//   return searchResult.length === 0 ? [] : searchResult as T[]
// }

// /**
//  * Return mongodb find cursor by input filter
//  * @param filter Query filter to select elements in collection
//  * @param collection Name of the collection
//  * @param db Database instance
//  * @param limit Optional - number of elements returned from request
//  * @param skip Optional - number of elements to be skipped
//  * @returns Unresolved find cursor in database
//  */
// export const mongoCursorByFilter = async (filter: unknown, collection: string, db: Db, limit = 0, skip = 0) => {
//   const searchResult = db.collection(collection).find(filter as any, { limit, skip })
//   return searchResult
// }

// /**
//  * Returns number of documents by specific filter from database
//  * @param filter Query filter to select elements in collection
//  * @param collection Name of the collection
//  * @param db Database instance
//  * @returns Number of documents from specific filter
//  */
// export const mongoCountByFilter = async (filter: unknown, collection: string, db: Db) => {
//   const count = db.collection(collection).countDocuments(filter as any)
//   return count
// }

// /**
//  * Check key existence of node key
//  * @param key Key to approve
//  * @param db Database instance
//  * @returns Information of the key exist
//  */
// export const checkKeyExistence = async (key: string, db: Db) => {
//   const filter = filterByKey(key)
//   const result = await db.collection(UsedCollections.Nodes).find(filter as any, {limit: 1}).toArray()
//   return result.length === 1
// }
