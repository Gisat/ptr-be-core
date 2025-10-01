export interface EndpointResponse<T>{
    intoBody: T;
    intoHeaders: Record<string, any> | null;
}