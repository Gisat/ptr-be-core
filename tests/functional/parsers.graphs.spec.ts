import { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "../../src/globals/panther/enums.panther"
import { GraphEdge } from "../../src/globals/panther/models.edges"
import { FullPantherEntity } from "../../src/globals/panther/models.nodes"
import { parseParsePantherNodes } from "../../src/node/panther/parse.changeNodes"
import { parseRichEdges } from "../../src/node/panther/parse.changesEdges"
import { filterNodeByLabel, findEdgeByLabel, findNodeByLabel } from "../../src/globals/panther/utils.panther"
import { InvalidRequestError } from "../../src/node/api/models.errors"

import GraphImport from "../fixtures/graph.import.nodes.edges.json"

describe("Parse graph structures (nodes and edges)", () => {

  let nodes: FullPantherEntity[] = []

  let edges: GraphEdge[] = []

  beforeAll(() => {
    nodes = parseParsePantherNodes(GraphImport.nodes)
    edges = parseRichEdges(GraphImport.edges)
  })

  it("Check parsed nodes by labels", () => {

    // Check number of parsed nodes and edges
    expect(nodes.length).toBe(9)
    expect(edges.length).toBe(8)

    // Check specific nodes count by label
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Application).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Attribute).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Tag).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Place).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Period).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Datasource).length).toBe(3)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Layer).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedDatasourceLabels.COG).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedDatasourceLabels.Attribute).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedDatasourceLabels.Timeseries).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedDatasourceLabels.External).length).toBe(1)
  })

  it("Check parsed tag node", () => {
    const tag = findNodeByLabel(nodes, UsedNodeLabels.Tag)

    expect(tag?.nameInternal).toBeDefined()
    expect(tag?.nameDisplay).toBeDefined()
    expect(tag?.description).toBeDefined()
    expect(tag?.labels).toContain(UsedNodeLabels.Tag)
  })

  it("Check parsed basic panther entity", () => {
    const pantherEntity = findNodeByLabel(nodes, UsedNodeLabels.Application)

    expect(pantherEntity?.nameInternal).toBeDefined()
    expect(pantherEntity?.nameDisplay).toBeDefined()
    expect(pantherEntity?.lastUpdatedAt).toBeDefined()
    expect(pantherEntity?.labels).toBeDefined()
  })

  it("Check parsed extras common property", () => {
    const pantherEntity = findNodeByLabel(nodes, UsedNodeLabels.Application)

    expect(pantherEntity?.extras).toEqual({
      source: "gisat",
      tags: ["demo", "test"],
      meta: { owner: "team-x" }
    })
    expect(pantherEntity?.extras?.tags).toEqual(["demo", "test"])
    expect(pantherEntity?.extras?.meta?.owner).toBe("team-x")

    const periodWithoutExtras = findNodeByLabel(nodes, UsedNodeLabels.Period)
    expect(periodWithoutExtras?.extras).toBeNull()
  })

  it("Rejects extras that are not objects", () => {
    const nodeWithArrayExtras = {
      key: "bad-extras-1",
      labels: ["application"],
      nameInternal: "test",
      nameDisplay: "test",
      extras: ["unsupported"]
    }

    expect(() => parseParsePantherNodes([nodeWithArrayExtras])).toThrow(InvalidRequestError)
  })

  it("Rejects extras with unsupported values", () => {
    const nodeWithUnsupportedNestedExtras = {
      key: "bad-extras-2",
      labels: ["application"],
      nameInternal: "test",
      nameDisplay: "test",
      extras: { nested: { date: new Date() } }
    }

    const parseNodeWithUnsupportedExtras = () => parseParsePantherNodes([nodeWithUnsupportedNestedExtras])

    expect(parseNodeWithUnsupportedExtras).toThrow(InvalidRequestError)
    expect(parseNodeWithUnsupportedExtras).toThrow('Value of "extras.nested.date" is not supported in a Neo4j Map.')
  })

  it("Accepts extras with all supported value types", () => {
    const nodeWithFullExtras = {
      key: "good-extras",
      labels: ["application"],
      nameInternal: "test",
      nameDisplay: "test",
      extras: {
        string: "value",
        number: 42,
        boolean: true,
        nullValue: null,
        array: ["a", 1, false, null, { deep: true }],
        nested: { deep: { deeper: "ok" } }
      }
    }

    const parsed = parseParsePantherNodes([nodeWithFullExtras])

    expect(parsed[0].extras).toEqual(nodeWithFullExtras.extras)
  })

  it("Check parsed COG datasource", () => {
    const datasourceCog = findNodeByLabel(nodes, UsedDatasourceLabels.COG)

    expect(datasourceCog?.url).toBeDefined()
    expect(datasourceCog?.bands).toBeDefined()
    expect(datasourceCog?.bandNames).toBeDefined()
    expect(datasourceCog?.bandPeriods).toBeDefined()
  })

  it("Check parsed external datasource", () => {
    const datasourceExternal = findNodeByLabel(nodes, UsedDatasourceLabels.External)

    expect(datasourceExternal?.url).toBeDefined()
    expect(datasourceExternal?.labels).toContain(UsedDatasourceLabels.External)
  })

  it("Check parsed timeseries datasources", () => {
    const datasourceTimeseriesVector = findNodeByLabel(nodes, UsedDatasourceLabels.Timeseries)

    expect(datasourceTimeseriesVector?.documentId).toBeDefined()
    expect(datasourceTimeseriesVector?.timestampFrom).toBeDefined()
    expect(datasourceTimeseriesVector?.timestampTo).toBeDefined()
    expect(datasourceTimeseriesVector?.intervalIso).toBeDefined()
    expect(datasourceTimeseriesVector?.step).toBeDefined()

    const timeseriesEdge = findEdgeByLabel(edges, UsedEdgeLabels.InPostgisLocation)
    expect(timeseriesEdge?.properties?.column).toBeDefined()
  })

})