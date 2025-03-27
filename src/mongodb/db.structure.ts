// import { Db } from "mongodb"
// import { mongoCreateCollection } from "./db.commands.universal"

// /**
//  * Used mongodb collections and these names
//  */
// export enum UsedCollections {
//   Nodes = "nodes",
//   Edges = "edges",
//   ConnectedNodes = "connectedNodes",
// }

// /**
//  * Indexes we use inside collections.
//  */
// type IndexProps = {
//   field: string,
//   order: number,
//   sparse: boolean,
//   unique: boolean
// }

// /**
//  * Migrate basic mongodb structure (collections, indexes)
//  * @param database Database instance for migration
//  */
// export const migrateMongoStructure = async (database: Db) => {

//   // create index setup map
//   const indexMap: Map<string, IndexProps[]> = new Map<string, IndexProps[]>()

//   indexMap.set(
//     UsedCollections.Edges, [
//       { field: "key", order: 1, sparse: false, unique: true },
//     ]
//   ).set(
//     UsedCollections.Nodes, [
//       { field: "key", order: 1, sparse: false, unique: true },
//       { field: "nodeType", order: 1, sparse: false, unique: false },
//     ]
//   ).set(
//     UsedCollections.ConnectedNodes, [
//       { field: "key", order: 1, sparse: false, unique: true },
//       { field: "nodeType", order: 1, sparse: false, unique: false },
//     ]
//   )

//   // migrate mongo collections wit indexes
//   for (const collectionName of Object.values(UsedCollections)) {

//     // create collection
//     await mongoCreateCollection(collectionName, database)

//     // create collection indexes
//     const collectionIndexes = indexMap.get(collectionName)

//     if (!collectionIndexes)
//       continue

//     const indexPromises = collectionIndexes.map(index => {
//       const { field, order, sparse, unique } = index
//       database.collection(collectionName).createIndex(
//         { [field]: order as number },
//         { sparse, unique }
//       )
//     })

//     await Promise.all(indexPromises)
//   }

// }