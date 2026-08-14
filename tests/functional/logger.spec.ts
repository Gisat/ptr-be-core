import { hostname } from 'node:os'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

type ConsoleMethod = 'debug' | 'info' | 'warn' | 'error'

const consoleSpies = (): Record<ConsoleMethod, ReturnType<typeof vi.spyOn>> => ({
  debug: vi.spyOn(console, 'debug').mockImplementation(() => undefined),
  info: vi.spyOn(console, 'info').mockImplementation(() => undefined),
  warn: vi.spyOn(console, 'warn').mockImplementation(() => undefined),
  error: vi.spyOn(console, 'error').mockImplementation(() => undefined),
})

const importLogger = async (level?: string) => {
  vi.resetModules()

  if (level === undefined) delete process.env.LOG_LEVEL
  else process.env.LOG_LEVEL = level

  return import('../../src/node/logging/logger')
}

describe('native logger', () => {
  let previousLogLevel: string | undefined

  beforeEach(() => {
    previousLogLevel = process.env.LOG_LEVEL
  })

  afterEach(() => {
    vi.restoreAllMocks()

    if (previousLogLevel === undefined) delete process.env.LOG_LEVEL
    else process.env.LOG_LEVEL = previousLogLevel
  })

  test('emits the compatible JSON shape through the matching console method', async () => {
    const spies = consoleSpies()
    const logger = await importLogger('trace')

    logger.loggyInfo('worker', 'started', { requestId: 'abc' })

    expect(spies.info).toHaveBeenCalledOnce()
    const entry = JSON.parse(spies.info.mock.calls[0][0] as string)
    expect(entry).toMatchObject({
      level: 'info',
      pid: process.pid,
      hostname: hostname(),
      requestId: 'abc',
      label: 'worker',
      message: 'started',
    })
    expect(new Date(entry.time).toISOString()).toBe(entry.time)
  })

  test('routes all levels and does not use console.trace', async () => {
    const spies = consoleSpies()
    const logger = await importLogger('trace')

    logger.loggyTrace('label', 'trace')
    logger.loggyDebug('label', 'debug')
    logger.loggyInfo('label', 'info')
    logger.loggyWarn('label', 'warn')
    logger.loggyError('label', 'error')
    logger.loggyFatal('label', 'fatal')

    expect(spies.debug).toHaveBeenCalledTimes(2)
    expect(spies.info).toHaveBeenCalledOnce()
    expect(spies.warn).toHaveBeenCalledOnce()
    expect(spies.error).toHaveBeenCalledTimes(2)
  })

  test('uses info as the default and fallback threshold', async () => {
    for (const configuredLevel of [undefined, 'invalid']) {
      const spies = consoleSpies()
      const logger = await importLogger(configuredLevel)

      logger.loggyDebug('label', 'hidden')
      logger.loggyInfo('label', 'visible')

      expect(spies.debug).not.toHaveBeenCalled()
      expect(spies.info).toHaveBeenCalledOnce()
      vi.restoreAllMocks()
    }
  })

  test('supports each threshold boundary and silent', async () => {
    const levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const

    for (const [thresholdIndex, threshold] of levels.entries()) {
      const spies = consoleSpies()
      const logger = await importLogger(threshold)
      const functions = [logger.loggyTrace, logger.loggyDebug, logger.loggyInfo, logger.loggyWarn, logger.loggyError, logger.loggyFatal]

      functions.forEach((fn) => fn('label', 'message'))

      const emitted = Object.values(spies).reduce((total, spy) => total + spy.mock.calls.length, 0)
      expect(emitted).toBe(Math.max(0, functions.length - thresholdIndex))
      vi.restoreAllMocks()
    }
  })

  test('includes Error stacks and safely serializes circular and BigInt metadata', async () => {
    const spies = consoleSpies()
    const logger = await importLogger('info')
    const circular: Record<string, any> = {}
    circular.self = circular

    logger.loggyError('failure', new Error('broken'), { circular, count: 12n })

    const entry = JSON.parse(spies.error.mock.calls[0][0] as string)
    expect(entry).toMatchObject({
      level: 'error',
      label: 'failure',
      message: 'broken',
      circular: { self: '[Circular]' },
      count: 12,
    })
    expect(entry.stack).toContain('Error: broken')
  })

  test('preserves convenience logger messages and parameters', async () => {
    const spies = consoleSpies()
    const logger = await importLogger('info')

    logger.loggyAppStart('127.0.0.1', 3000, { id: 1 })
    logger.loggyRequestReceived('/items', 'GET', { id: 2 })
    logger.loggyResponseSent('/items', 'GET', 204, { id: 3 })

    const entries = spies.info.mock.calls.map(([line]) => JSON.parse(line as string))
    expect(entries).toEqual(expect.arrayContaining([
      expect.objectContaining({ label: 'Application started', message: 'Running on 127.0.0.1:3000', id: 1 }),
      expect.objectContaining({ label: 'Request Received', message: 'GET: /items', id: 2 }),
      expect.objectContaining({ label: 'Response Sent', message: '204: /items', method: 'GET', id: 3 }),
    ]))
  })
})
