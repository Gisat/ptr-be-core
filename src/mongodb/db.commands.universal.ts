// import { Db } from "mongodb";

// /**
//  * Create new mongodb collection
//  * @param collectionName Name of the new collection
//  * @param db Database instance
//  */
// export const mongoCreateCollection = async (collectionName: string, db: Db) => {
//   try {
//     await db.createCollection(collectionName)
//   } catch {
//     console.log(`Collection ${collectionName} already exist, or failed.`)
//   }
// }

// /**
//  * Insert multiple entity records to mongodb
//  * @param entities Array of entities
//  * @param collectionName Name of target mongo collection 
//  * @param db Database instance
//  * @returns Information if all entities ware inserted
//  */
// export const mongoInsertUniversal = async function (entities: any[], collectionName: string, db: Db): Promise<boolean> {
//   const result = await db.collection(collectionName).insertMany(entities)
//   return result.insertedCount === entities.length
// }

// /**
//  * Replace more entities in database. Old documets are deleted by filter and than are inserted new entities
//  * @param replaceFilter What entities are old and will be deleted
//  * @param newEntities What will be inserted
//  * @param collectionName Name of the target mongodb collection
//  * @param db Database client
//  * @returns Has all documents been inserted?
//  */
// export const mongoReplaceUniversal =
//   async function (replaceFilter: unknown, newEntities: any[], collectionName: string, db: Db) {

//     if (newEntities.length < 1)
//       return false

//     const mongoCollection = db.collection(collectionName)
//     await mongoCollection.deleteMany(replaceFilter as any)

//     const inserted = await mongoInsertUniversal(newEntities, collectionName, db)
//     return inserted
//   }

// /**
//  * Delete documents by filter from certain collection
//  * @param deleteFilter Filter to select documents to be deleted
//  * @param collectionName Name of the target mongodb collection
//  * @param db Database client
//  * @returns Number of deleted documents
//  */
// export const mongoDeleteUniversal =
//   async function (deleteFilter: unknown, collectionName: string, db: Db) {
//     const mongoCollection = db.collection(collectionName)
//     const deleted = await mongoCollection.deleteMany(deleteFilter as any)
//     return deleted.deletedCount
//   }