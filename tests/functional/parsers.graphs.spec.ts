import { UsedDatasourceLabels, UsedEdgeLabels, UsedNodeLabels } from "../../src/globals/panther/enums.panther"
import { GraphEdge } from "../../src/globals/panther/models.edges"
import { FullPantherEntity } from "../../src/globals/panther/models.nodes"
import { filterNodeByLabel, findEdgeByLabel, findNodeByLabel } from "../../src/globals/panther/utils.panther"
import { parseArrowsJson } from "../../src/node/api/parse.arrows.json"

import ArrowsImport from "../fixtures/arrows.import.allNodes.json"

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
