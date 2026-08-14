/**
 * Error indicating a required API parameter is missing or invalid.
 * Results in an HTTP 400 response.
 */
class InvalidRequestError extends Error{
  constructor(message: string){
    super(`Invalid Request: ${message}`)
  }
}

/**
 * Error indicating the client failed authorization.
 * Results in an HTTP 401 response.
 */
class AuthorizationError extends Error{
  constructor(){
    super(`Authorization has failed.`)
  }
}

/**
 * General backend server-side error.
 * Results in an HTTP 500 response.
 */
class ServerError extends Error{
  constructor(message: string){
    super(`Server Error: ${message}`)
  }
}

/**
 * Error indicating a feature is only available in SSR (Server-Side Rendering) context.
 */
class SSROnlyError extends Error{
  constructor(message: string){
    super(`SSR Only Error: ${message}`)
  }
}

export {
    InvalidRequestError,
    AuthorizationError,
    ServerError,
    SSROnlyError
} 