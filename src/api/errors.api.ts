/**
 * Extract message from exception error (try-catch)
 * @param error error from catch block as any
 * @returns 
 */
 export const messageFromError = (error: any) => error["message"] as string

/**
 * We miss a API parameter needed to process action
 */
export class InvalidRequestError extends Error{
  constructor(message: string){
    super(`Invalid Request: ${message}`)
  }
}


/**
 * Wher client has general authorization issue
 */
export class AuthorizationError extends Error{
  constructor(){
    super(`Authorization has failed.`)
  }
}