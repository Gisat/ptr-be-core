
// Re-export browser-specific exports
export * from "./index.browser.js";

// API error handling
export { InvalidRequestError, AuthorizationError, ServerError, SSROnlyError } from "./node/api/models.errors.js";

export {
    messageFromError
} from "./node/api/parsing.errors.js";


// API models and helpers
export { type ApiEndpointResponse } from "./node/api/models.api.js";

// Logger functionality
export { loggyDebug, loggyError, loggyInfo, loggyWarn, loggyTrace, loggyFatal, loggyAppStart, loggyRequestReceived, loggyResponseSent } from "./node/logging/logger.js";

// parse and validate nodes from Arrows.app JSON format
export {
    parseArrowsJson,
} from "./node/api/parse.arrows.json.js";

// parse and validate nodes from raw input
export {
    parseParsePantherNodes,
    parseSinglePantherNode
} from "./node/api/parse.changeNodes.js";


// parse and validate edges from raw input
export {
    parseRichEdges,
    parseEqualEdges
} from "./node/api/parse.changesEdges.js";

// validations for panther graph model label enums
export {
    validateEdgeLabel,
    validateNodeLabels
} from "./node/api/validations.shared.js";

// enums used in BE applications
export {
    UsedEnvironments
} from "./node/apps/enums.general.js";

// utility functions for environment parsing
export {
    parsePackageJsonEnvironments
} from "./node/apps/utils.environment.js";

// Swagger universal types and utilities
export {
    type AppSchemaTemplate,
    SwaggerTypes
} from "./node/api/swagger.universal.js";

// SQLite enums
export {
    UsedSqlTables,
} from "./node/sqlite/enums.sqlite.js";

// SQLite default constants
export {
    DEFAULT_DB_NAME,
    DEFAULT_DB_STATE_EXPIRATION_SEC
} from "./node/sqlite/defaults.sqlite.js";

// SQLite database connection
export { openDb, type AppDb } from "./node/sqlite/sqlite.connection.js";

// SQLite commands for app state management
export {
    dbSaveState
} from "./node/sqlite/sqlite.commands.js";

// SQLite queries for app state retrieval
export {
    dbNeedAppState
} from "./node/sqlite/sqlite.queries.js";

// OpenID Connect SSR context for authorization code grant flow
export {
    ssrOpenidContext,
    type AuthCodeCheckValues,
    type AuthCodeHandleResult,
    type AuthCallbackInput,
    type AuthCallbackResult
} from "./node/auth/openid.ssr.js";