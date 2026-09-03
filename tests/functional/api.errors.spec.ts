import { describe, expect, test } from 'vitest'
import { AuthorizationError, InvalidRequestError, ServerError, SSROnlyError } from '../../src/node/api/models.errors'
import { handleRouteError } from '../../src/node/api/parsing.errors'

describe('API error classes', () => {
  test('InvalidRequestError exposes status 400 and prefixed message', () => {
    const error = new InvalidRequestError('boom')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(InvalidRequestError)
    expect(error.status).toBe(400)
    expect(error.message).toBe('Invalid Request: boom')
  })

  test('AuthorizationError exposes status 401', () => {
    const error = new AuthorizationError()

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AuthorizationError)
    expect(error.status).toBe(401)
    expect(error.message).toBe('Authorization has failed.')
  })

  test('ServerError exposes status 500 and prefixed message', () => {
    const error = new ServerError('boom')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ServerError)
    expect(error.status).toBe(500)
    expect(error.message).toBe('Server Error: boom')
  })

  test('SSROnlyError does not document an HTTP status', () => {
    const error = new SSROnlyError('boom')

    expect(error).toBeInstanceOf(SSROnlyError)
    expect(error.message).toBe('SSR Only Error: boom')
    expect((error as { status?: number }).status).toBeUndefined()
  })

  test('handleRouteError maps known error types to the same statuses', () => {
    expect(handleRouteError(new InvalidRequestError('x')).status).toBe(400)
    expect(handleRouteError(new AuthorizationError()).status).toBe(401)
    expect(handleRouteError(new ServerError('x')).status).toBe(500)
    expect(handleRouteError(new Error('generic')).status).toBe(500)
  })
})
