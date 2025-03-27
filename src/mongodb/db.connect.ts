// import {Db, MongoClient} from 'mongodb'

// /**
//  * Package of database client, database instance and logger client
//  */
// export interface MongodbConnectionBundle{
//   client: MongoClient,
//   database: Db
// }

// /**
//  * Connect to mongodb database 
//  * @param connectionString Connection string to database server
//  * @param databaseName What database use to connect
//  * @returns Package of database client, database instance and logger client
//  */
// export const connectDatabase = async (connectionString: string, databaseName: string): Promise<MongodbConnectionBundle> => {
//   const client = new MongoClient(connectionString)
//   const conn = await client.connect()
//   const database = conn.db(databaseName)
//   return {client, database}
// }