import { hasIsoFormat, isoDateToTimestamp, isoIntervalToTimestamps } from "../../src/globals/coding/code.dates"
import { expectArrayCompare } from "../tools/test.expects"


describe("Work with datetime values", () => {

  it("ISO input is valid", async () => {
    const IsoDate = "2022-07"
    const WrongDate = "dog"
    const results = [hasIsoFormat(IsoDate), hasIsoFormat(WrongDate)]
    expectArrayCompare([true, false], results)
  })

  it("ISO range to timestamps", async () => {
    const interval = "2021-07/2022-07"
    const [ts1, ts2] = [isoDateToTimestamp("2021-07"), isoDateToTimestamp("2022-07")]
    const [from, to] = isoIntervalToTimestamps(interval)
    expect(from).toBe(ts1)
    expect(to).toBe(ts2)
  })
})
