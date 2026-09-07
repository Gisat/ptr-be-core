import { InvalidRequestError, ServerError } from "../../src/node/api/models.errors"
import { parseNeo4jMap, serializeNeo4jMap } from "../../src/node/panther/validations.neo4j"

describe("Neo4j Map codec (serialize and parse)", () => {

  const map = { source: "gisat", tags: ["demo", "test"], meta: { owner: "team-x" } }

  it("Serializes a Neo4j Map into a JSON string", () => {
    expect(serializeNeo4jMap(map)).toBe(JSON.stringify(map))
  })

  it("Serializes absent extras to null", () => {
    expect(serializeNeo4jMap(null)).toBeNull()
    expect(serializeNeo4jMap(undefined)).toBeNull()
  })

  it("Rejects extras that are not objects on serialization", () => {
    expect(() => serializeNeo4jMap(["unsupported"])).toThrow(InvalidRequestError)
    expect(() => serializeNeo4jMap("serialized")).toThrow(InvalidRequestError)
    expect(() => serializeNeo4jMap("serialized")).toThrow('Value of "extras" is not supported in a Neo4j Map.')
  })

  it("Rejects extras with unsupported values on serialization", () => {
    const serializeWithDateValue = () => serializeNeo4jMap({ nested: { date: new Date() } })

    expect(serializeWithDateValue).toThrow(InvalidRequestError)
    expect(serializeWithDateValue).toThrow('Value of "extras.nested.date" is not supported in a Neo4j Map.')
  })

  it("Round-trips a Neo4j Map through serialize and parse", () => {
    expect(parseNeo4jMap(serializeNeo4jMap(map))).toEqual(map)
  })

  it("Parses a serialized JSON string into a Neo4j Map", () => {
    expect(parseNeo4jMap(JSON.stringify(map))).toEqual(map)
  })

  it("Parses absent extras to null", () => {
    expect(parseNeo4jMap(null)).toBeNull()
    expect(parseNeo4jMap(undefined)).toBeNull()
  })

  it("Accepts an already-object Neo4j Map on parse", () => {
    expect(parseNeo4jMap(map)).toEqual(map)
  })

  it("Throws on a malformed serialized JSON string", () => {
    expect(() => parseNeo4jMap("{not-json")).toThrow(ServerError)
    expect(() => parseNeo4jMap("{not-json")).toThrow('Value of "extras" is not a valid serialized Neo4j Map')
  })

  it("Throws on values that cannot be decoded", () => {
    expect(() => parseNeo4jMap(42)).toThrow(ServerError)
    expect(() => parseNeo4jMap(42)).toThrow('Value of "extras" cannot be decoded into a Neo4j Map.')
  })
})
