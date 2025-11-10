import { UsedEdgeLabels } from "../../dist/index.browser"
import { FullPantherEntity, GraphEdge, parseArrowsJson, parseParsePantherNodes, UsedDatasourceLabels, UsedNodeLabels } from "../../src/index.node"

import ArrowsImport from "../fixtures/arrows.import.allNodes.json"

const findNodeByLabel = (
  nodes: FullPantherEntity[],
  label: UsedDatasourceLabels | UsedNodeLabels): FullPantherEntity | undefined => {
  return nodes.find(n => n.labels.includes(label))
}

const filterNodeByLabel = (
  nodes: FullPantherEntity[],
  label: UsedDatasourceLabels | UsedNodeLabels): FullPantherEntity[] => {
  return nodes.filter(n => n.labels.includes(label))
}

const findEdgeByLabel = (
  edges: GraphEdge[],
  label: UsedEdgeLabels): GraphEdge | undefined => {
  return edges.find(e => e.label === label)
}

const filterEdgeByLabel = (
  edges: GraphEdge[],
  label: UsedEdgeLabels): GraphEdge[] => {
  return edges.filter(e => e.label === label)
}

describe("Parse graph structures (nodes and edges)", () => {

  let nodes: FullPantherEntity[] = []
  let edges: GraphEdge[] = []

  beforeAll(() => {
    const parsed = parseArrowsJson(ArrowsImport)
    nodes = parsed.nodes
    edges = parsed.edges
  })

  it("Check parsed nodes by labels", () => {

    // Check number of parsed nodes and edges
    expect(nodes.length).toBe(7)
    expect(edges.length).toBe(8)

    // Check specific nodes count by label
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Application).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Attribute).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Place).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Period).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Datasource).length).toBe(2)
    expect(filterNodeByLabel(nodes, UsedNodeLabels.Layer).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedDatasourceLabels.COG).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedDatasourceLabels.Attribute).length).toBe(1)
    expect(filterNodeByLabel(nodes, UsedDatasourceLabels.Timeseries).length).toBe(1)
  })

  it("Check parsed basic panther entity", () => {
    const pantherEntity = findNodeByLabel(nodes, UsedNodeLabels.Application)

    expect(pantherEntity?.nameInternal).toBeDefined()
    expect(pantherEntity?.nameDisplay).toBeDefined()
    expect(pantherEntity?.lastUpdatedAt).toBeDefined()
    expect(pantherEntity?.labels).toBeDefined()
    })

    it("Check parsed COG datasource", () => {
    const datasourceCog = findNodeByLabel(nodes, UsedDatasourceLabels.COG)

    expect(datasourceCog?.url).toBeDefined()
    expect(datasourceCog?.bands).toBeDefined()
    expect(datasourceCog?.bandNames).toBeDefined()
    expect(datasourceCog?.bandPeriods).toBeDefined()
    })

    it("Check parsed timeseries datasources", () => {
    const datasourceTimeseriesVector = findNodeByLabel(nodes, UsedDatasourceLabels.Timeseries)

    expect(datasourceTimeseriesVector?.documentId).toBeDefined()
    expect(datasourceTimeseriesVector?.validFrom).toBeDefined()
    expect(datasourceTimeseriesVector?.validTo).toBeDefined()
    expect(datasourceTimeseriesVector?.validIntervalIso).toBeDefined()
    expect(datasourceTimeseriesVector?.step).toBeDefined()

    const timeseriesEdge = findEdgeByLabel(edges, UsedEdgeLabels.InPostgisLocation)
    expect(timeseriesEdge?.properties?.column).toBeDefined()
    })

})
