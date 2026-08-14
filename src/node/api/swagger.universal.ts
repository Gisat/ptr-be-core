/**
 * Universal schema template for API endpoint documentation.
 * Supports body, querystring, params, headers, response schemas plus metadata fields.
 * Can be extended with additional properties via the index signature.
 */
export interface AppSchemaTemplate {
  body?: Record<string, any>;
  querystring?: Record<string, any>;
  params?: Record<string, any>;
  headers?: Record<string, any>;
  response?: Record<string, any>;
  description?: string;
  tags?: string[];
  summary?: string;
  [key: string]: any;
}

/**
 * Shared Swagger data types used in API documentation schemas.
 */
export enum SwaggerTypes {
  String = "string",
  Number = "number",
  Object = "object",
  Array = "array",
  Boolean = "boolean"
}