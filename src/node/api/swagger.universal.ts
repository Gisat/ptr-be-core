/**
 * Universal Swagger types and utilities
 * This interface can be extended for more precise typing if needed.
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
 * Shared swagger types used in API documentation
 */
export enum SwaggerTypes {
  String = "string",
  Number = "number",
  Object = "object",
  Array = "array",
  Boolean = "boolean"
}