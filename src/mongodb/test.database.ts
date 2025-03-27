// import { AppEnvironment } from "@app/environment"
// import { connectDatabase } from "@core/(shared)/mongodb/db.connect"
// import { migrateMongoStructure } from "@core/(shared)/mongodb/db.structure"
// import { Db } from "mongodb"

// const TEST_DATABASE_NAME = "testdb"

// /**
//  * Create new testing database (database + migration)
//  * @param environment Application environment
//  * @returns Test database connection properties
//  */
// export const createTestDatabase = async (environment: AppEnvironment) =>{

//   // connect to testing database
//   const connectBundle = await connectDatabase(environment.dbString, TEST_DATABASE_NAME)
//   const database = connectBundle.database

//   // clear old database data
//   await dropTestDatabase(database)

//   // migrate application structure
//   await migrateMongoStructure(connectBundle.database)

//   // return connection properties
//   return connectBundle
// }

// /**
//  * Drops existing testing database with all collections and documents
//  * @param database Existing testing database
//  * @returns Drop database result
//  */
// export const dropTestDatabase = async (database: Db) =>
//   // drop testing database
//   await database.dropDatabase({ dbName: TEST_DATABASE_NAME })
