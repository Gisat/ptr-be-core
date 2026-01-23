/**
 * We miss a API parameter needed to process action
 */
class InvalidRequestError extends Error{
  constructor(message: string){
    super(`Invalid Request: ${message}`)
  }
}

/**
 * Where client has general authorization issue
 */
class AuthorizationError extends Error{
  constructor(){
    super(`Authorization has failed.`)
  }
}

/**
 * General backend server side error
 */
class ServerError extends Error{
  constructor(message: string){
    super(`Server Error: ${message}`)
  }
}

/**
 * Error to indicate that some functionality is SSR only
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