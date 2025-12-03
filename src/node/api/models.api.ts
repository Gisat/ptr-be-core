/**
 * Universal API model as resource for endpoint response with body and headers
 * Generic type T is type of body
 * Headers can be null
 */
export interface ApiEndpointResponse<T>{
    intoBody: T;
    intoHeaders: Record<string, any> | null;
}