// import Redis from "ioredis"
// import NodeCache from "node-cache"
// import { Nullable, Unsure } from "../coding/code.types"
// import { ApiResponseModel } from "@app/api.utils"
// import { fastNoCrypticHash } from "../security/crypto"
// import { UsedHeaderNames, UsedHeaderValues } from "@app/enums.http.headers"

// /**
//  * Properties to generate key for a cache at endpoint
//  */
// export interface CacheKeyProps {
//     endpointPrefix: string,
//     filter: unknown,
//     limit: number,
//     skip: number,
//     keyPostfix?: string
// }

// /**
//  * Input properties for cache provider
//  */
// interface CacheProviderInitialProps {
//     cacheKeyPrefix: string
//     redisProps?: { redisHost: string, redisPort: number }
//     testingMode?: boolean
// }

// /**
//  * Cache provider - is used to set or get data to cache.
//  * Cache can be global (Redis) or local (NodeCache)
//  * Selection depends on constructor setup
//  */
// export class CacheProvider {

//     // do we use local cache or redis (distributed cache)
//     readonly cacheMode: "appCache" | "redisCache"

//     // cache key prefix for this application
//     readonly cacheKeyPrefix: string

//     // client for redis, if exist
//     private redisClient: Nullable<Redis> = null

//     // client for local cache, if exist
//     private nodeCacheClient: Nullable<NodeCache> = null

//     /**
//      * Create instance of cache provider
//      * @param providerProps Properties to setup cache provider
//      */
//     constructor(providerProps: CacheProviderInitialProps) {

//         /**
//          * Function to connect redis and choose database depends on environment
//          * @param host Redis hostname
//          * @param port Redis port
//          * @param testingDb Choose testing database, or not?
//          * @returns Redis instance for cache provider
//          */
//         const connectRedisFunction = (host: string, port: number, testingDb?: boolean): Redis => {
//             const databaseNumber = testingDb ? 1 : 0 // 0 app, 1 testing
//             const instance = new Redis(port, host, { db: databaseNumber })

//             instance.on('error', (err) => {
//             console.error('Redis connection error:', err)
//             })

//             instance.on('connect', () => {
//             console.log('Redis connected successfully')
//             })

//             return instance
//         }

//         const { redisProps, testingMode, cacheKeyPrefix } = providerProps

//         this.cacheKeyPrefix = cacheKeyPrefix

//         this.nodeCacheClient = new NodeCache()

//         if (redisProps) {
//             const { redisHost, redisPort } = redisProps
//             this.redisClient = connectRedisFunction(redisHost, redisPort, testingMode)
//             this.cacheMode = "redisCache"
//         }
//         else this.cacheMode = "appCache"
//     }

//     /**
//      * Generates final cache key from input. 
//      * Need to be used, becuase redis is shared by more applications
//      * @param key Key, that identifies the data
//      * @returns Unique key for cache system
//      */
//     private generateMetadataKey = (key: string) => `${this.cacheKeyPrefix}:${key}`

//     /**
//      * Read data from cache, if exist
//      * @param key Key, that is used to identitfy data in cache
//      * @returns Value if data exist (need to be converted from string)
//      */
//     async cacheGet<T>(key: string) {
//         const metadataKey = this.generateMetadataKey(key)

//         const result = this.cacheMode === "redisCache" ? await this.redisClient?.get(metadataKey) : this.nodeCacheClient?.get(metadataKey)
//         const originalValue = this.cacheMode === "redisCache" ? JSON.parse(result as any) : result

//         return originalValue as Unsure<T>
//     }

//     /**
//      * Save data to cache with expiration. 
//      * @param key Key to be used for data identification
//      * @param value Data in string format
//      * @param expirationInSeconds Optional - how long will data survive in cache
//      */
//     async cacheSet(key: string, value: unknown, expirationInSeconds: number = 360) {
//         const serialised = JSON.stringify(value)
//         const metadataKey = this.generateMetadataKey(key)

//         if (this.cacheMode === "redisCache") {
//             await this.redisClient?.setex(metadataKey, expirationInSeconds, serialised)
//         } else {
//             this.nodeCacheClient?.set(metadataKey, value, expirationInSeconds)
//         }
//     }

//     /**
//      * Dump cache data, by default for the whole service.
//      * @param subkey If you want dump data just for a key subtree (one endpoint)
//      */
//     async dumpCache(subkey?: string) {

//         const prefix = subkey ? `${this.cacheKeyPrefix}:${subkey}` : `${this.cacheKeyPrefix}`

//         if (this.cacheMode === "redisCache") {
//             const keys = await this.redisClient?.keys(`${prefix}:*`)
//             if (keys && keys.length > 0) {
//                 await this.redisClient?.del(keys)
//             }
//         }
//         else {
//             const allKeys = this.nodeCacheClient?.keys()
//             const toDump = allKeys?.filter(key => key.startsWith(prefix))
//             if (toDump) {
//                 this.nodeCacheClient?.del(toDump)
//             }
//         }
//     }

//     /**
//      * Function to build a cache key by query params
//      * @param cacheProps Props for a key generation
//      * @returns Cache key for specific query
//      */
//     buildCacheKeyForQuery({ endpointPrefix, filter, limit, skip, keyPostfix }: CacheKeyProps) {
//         const keyHash = `filter:queryresult:${endpointPrefix}${fastNoCrypticHash(filter)}:${limit}:${skip}${keyPostfix && `:${keyPostfix}` || ""}`
//         return keyHash
//     }

//     /**
//      * Build cache query key postfix for vectorKey datasource query 
//      * @param includeAttributes Is geometry included?
//      * @returns Cache key postfix for cache query props
//      */
//     cachePostfixForVectorKey(includeAttributes: boolean) {
//         return `${includeAttributes ? "attributes" : "noattributes"}`
//     }

//     /**
//      * Read query record from cache provider by specific query props
//      * @param keyProps Props for a key generation
//      * @param cache Cache provider instance
//      * @returns Record, if exist, Otherwise NULL
//      */
//     async readQueryFromCache(keyProps: CacheKeyProps) {
//         const key = this.buildCacheKeyForQuery(keyProps)
//         const result = await this.cacheGet(key)
//         return result ?? null
//     }

//     /**
//      * Save query result into cache
//      * @param keyProps Props for a key generation
//      * @param content Response content
//      * @param cache Cache provider instance
//      * @param ttlSec Optional - how long will be record saved inside cache
//      */
//     async saveQueryResultToCache(
//         keyProps: CacheKeyProps,
//         content: ApiResponseModel<any>,
//         ttlSec: number = (60*60*60)
//     ) {
//         const key = this.buildCacheKeyForQuery(keyProps)
//         const cacheEditedApiResponseModel: ApiResponseModel<any> = {
//             intoBody: content.intoBody, 
//             intoHeaders: {
//                 ...content.intoHeaders, 
//                 [UsedHeaderNames.ResultFrom]: UsedHeaderValues.ResultFromCache
//             }}
//         await this.cacheSet(key, cacheEditedApiResponseModel, ttlSec)
//     }

//     /**
//      * Build cache key for amount of records in database for specific filter
//      * @param filter Filter content
//      * @param collection Collection for the filter
//      * @returns Key for cache
//      */
//     buildCacheKeyForTotalRecordsInQuery(filter: unknown, collection: string) {
//         const cacheKey = `filter:total:${collection}:${fastNoCrypticHash(filter)}`
//         return cacheKey
//     }

//     /**
//      * Closes the cache provider by performing necessary cleanup operations.
//      * 
//      * If the cache mode is set to "redisCache", it will quit the Redis client.
//      * Otherwise, it will flush all entries in the Node cache client.
//      * 
//      * @returns {Promise<void>} A promise that resolves when the cache provider is closed.
//      */
//     closeCacheProvider = async () => {

//         if (this.cacheMode === "redisCache") {
//             await this?.redisClient?.quit();
//         }
//         else {
//             this?.nodeCacheClient?.flushAll()
//         }    
//     }
// }