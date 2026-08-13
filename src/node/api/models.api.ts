/**
 * Universal API response model.
 * Wraps the response body and optional headers into a single structure.
 *
 * @typeParam T - The type of the response body.
 */
export interface ApiEndpointResponse<T>{
    intoBody: T;
    intoHeaders: Record<string, any> | null;
}