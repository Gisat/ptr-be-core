import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { redisUniqueKey } from "../../src/node/redis/redis"

const originalCwd = process.cwd()
const fixturesPath = join(originalCwd, "tests/fixtures")
const serviceFixturePath = join(fixturesPath, "service")

const importRedis = async () => {
  vi.resetModules()
  return import("../../src/node/redis/redis")
}

describe("Redis unique key", () => {

  afterEach(() => {
    process.chdir(originalCwd)
    vi.resetModules()
  })

  it("composes the service name and custom values", () => {
    const key = redisUniqueKey({ serviceName: "panther", values: ["user", "42"] })
    expect(key).toBe("panther:user:42")
  })

  it("accepts mixed string and number values", () => {
    const key = redisUniqueKey({ serviceName: "auth", values: ["token", 7, "session"] })
    expect(key).toBe("auth:token:7:session")
  })

  it("produces different keys for different services or values", () => {
    const base = redisUniqueKey({ serviceName: "panther", values: ["user"] })
    const otherService = redisUniqueKey({ serviceName: "auth", values: ["user"] })
    const otherValue = redisUniqueKey({ serviceName: "panther", values: ["place"] })

    expect(base).not.toBe(otherService)
    expect(base).not.toBe(otherValue)
  })

  it("is deterministic for equal inputs", () => {
    const first = redisUniqueKey({ serviceName: "panther", values: ["user", 42] })
    const second = redisUniqueKey({ serviceName: "panther", values: ["user", 42] })

    expect(first).toBe(second)
  })

  it("resolves the service name from package.json and strips the scope", async () => {
    process.chdir(serviceFixturePath)
    const { redisUniqueKey: freshRedisUniqueKey } = await importRedis()

    const key = freshRedisUniqueKey({ values: ["user"] })
    expect(key).toBe("panther-api:user")
  })

  it("prefers an explicit service name over package.json", async () => {
    process.chdir(serviceFixturePath)
    const { redisUniqueKey: freshRedisUniqueKey } = await importRedis()

    const key = freshRedisUniqueKey({ serviceName: "custom", values: ["user"] })
    expect(key).toBe("custom:user")
  })

  it("throws when fromPackageJson is false and serviceName is missing", () => {
    expect(() => redisUniqueKey({ values: ["user"], fromPackageJson: false })).toThrow()
  })

  it("throws when the service name cannot be resolved from package.json", async () => {
    process.chdir(fixturesPath)
    const { redisUniqueKey: freshRedisUniqueKey } = await importRedis()

    expect(() => freshRedisUniqueKey({ values: ["user"] })).toThrow()
  })

  it("throws when the service name is empty", () => {
    expect(() => redisUniqueKey({ serviceName: "", values: ["user"] })).toThrow()
  })

  it("throws when the values list is empty", () => {
    expect(() => redisUniqueKey({ serviceName: "panther", values: [] })).toThrow()
  })
})
