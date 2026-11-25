import { describe, expect, it } from "vitest"
import { UsedAuthRoles, UsedAuthGroups } from "../../src/globals/iam/enums.iam"

describe("IAM role and group enums", () => {

  it("UsedAuthRoles contains all expected role members with exact string values", () => {
    // These string values are the database contract — they must not change.
    expect(UsedAuthRoles.PublicUser).toBe("public_user")
    expect(UsedAuthRoles.RegisteredUser).toBe("registered_user")
    expect(UsedAuthRoles.Admin).toBe("admin")
    expect(UsedAuthRoles.Superadmin).toBe("superadmin")
  })

  it("UsedAuthRoles has exactly four members", () => {
    const members = Object.keys(UsedAuthRoles).filter(k => Number.isNaN(Number(k)))
    expect(members).toEqual(["PublicUser", "RegisteredUser", "Admin", "Superadmin"])
  })

  it("UsedAuthGroups is an empty enum", () => {
    const members = Object.keys(UsedAuthGroups).filter(k => Number.isNaN(Number(k)))
    expect(members).toEqual([])
  })
})