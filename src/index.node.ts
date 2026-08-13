
/**
 * Node.js entry point for ptr-be-core.
 * Re-exports all browser-compatible exports plus Node.js-specific modules:
 * API errors, logging, Panther graph parsing, validation, environment utilities, and Swagger types.
 */

// Re-export browser-specific exports
export * from "./index.browser.js";

// API error handling — custom error classes for request validation, auth, server, and SSR-only errors
export { InvalidRequestError, AuthorizationError, ServerError, SSROnlyError } from "./node/api/models.errors.js";

// Error message extraction utility
export {
    messageFromError
} from "./node/api/parsing.errors.js";

// API models and helpers — endpoint response interface
export { type ApiEndpointResponse } from "./node/api/models.api.js";

// Logger functionality — structured NDJSON logging with multiple severity levels
export { loggyDebug, loggyError, loggyInfo, loggyWarn, loggyTrace, loggyFatal, loggyAppStart, loggyRequestReceived, loggyResponseSent } from "./node/logging/logger.js";

// Handle API errors — maps error types to HTTP status codes
export {
    handleRouteError,
} from "./node/api/parsing.errors.js";

// Parse and validate graph nodes from raw HTTP request input
export {
    parseParsePantherNodes,
    parseSinglePantherNode
} from "./node/panther/parse.changeNodes.js";

// Parse and validate graph edges from raw HTTP request input
export {
    parseRichEdges,
    parseEqualEdges
} from "./node/panther/parse.changesEdges.js";

// Validations for Panther graph model label enums
export {
    validateEdgeLabel,
    validateNodeLabels
} from "./node/api/validations.shared.js";

// Enums used in BE applications — environment names
export {
    UsedEnvironments
} from "./node/apps/enums.general.js";

// Utility functions for environment parsing — reads package.json metadata
export {
    parsePackageJsonEnvironments
} from "./node/apps/utils.environment.js";

// Swagger universal types and utilities — schema template and type enum
export {
    type AppSchemaTemplate,
    SwaggerTypes
} from "./node/api/swagger.universal.js";