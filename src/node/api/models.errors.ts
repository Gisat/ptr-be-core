/**
 * Error indicating a required API parameter is missing or invalid.
 * Results in an HTTP 400 response (see `status`).
 */
class InvalidRequestError extends Error{
  readonly status: number = 400

  constructor(message: string){
    super(`Invalid Request: ${message}`)
  }
}

/**
 * Error indicating the client failed authorization.
 * Results in an HTTP 401 response (see `status`).
 */
class AuthorizationError extends Error{
  readonly status: number = 401

  constructor(){
    super(`Authorization has failed.`)
  }
}

/**
 * General backend server-side error.
 * Results in an HTTP 500 response (see `status`).
 */
class ServerError extends Error{
  readonly status: number = 500

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