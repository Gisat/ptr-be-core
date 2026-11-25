import { describe, expect, it } from "vitest"
import { UsedHeaderNames, UsedHeaderValues } from "../../src/node/api/enums.http.headers"

describe("HTTP header enums", () => {

  it("UsedHeaderNames exposes the expected header names with exact values", () => {
    // These string values are the cross-service HTTP contract — they must not change.
    expect(UsedHeaderNames.IgnoreCache).toBe("ignore-cache")
    expect(UsedHeaderNames.ResultFrom).toBe("result-from")
    expect(UsedHeaderNames.Sid).toBe("sid")
    expect(UsedHeaderNames.SessionId).toBe("x-session-id")
  })

  it("UsedHeaderNames has exactly four members", () => {
    const members = Object.keys(UsedHeaderNames).filter(k => Number.isNaN(Number(k)))
    expect(members).toEqual(["IgnoreCache", "ResultFrom", "Sid", "SessionId"])
  })

  it("UsedHeaderValues exposes the result-source values", () => {
    expect(UsedHeaderValues.ResultFromStorage).toBe("storage")
    expect(UsedHeaderValues.ResultFromCache).toBe("cache")
  })

  it("UsedHeaderValues has exactly two members", () => {
    const members = Object.keys(UsedHeaderValues).filter(k => Number.isNaN(Number(k)))
    expect(members).toEqual(["ResultFromStorage", "ResultFromCache"])
  })
})
