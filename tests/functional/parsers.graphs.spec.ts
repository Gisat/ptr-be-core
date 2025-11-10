import { Datasource } from "@gisatcz/ptr-be-core/node"
import { datasourceNodeRequestBody, applicationNodeRequestBody, styleNodeRequestBody } from "../fixtures/requests"
import { parseParsePantherNodes } from "../../src/index.node"

describe("Parse graph structures (nodes and edges)", () => {

  it("Parse general node", async () => {
    const parsed = parseParsePantherNodes([datasourceNodeRequestBody, applicationNodeRequestBody, styleNodeRequestBody])
    expect(parsed).toHaveLength(3)
  })

  it("Parse datasource body", async () => {
    const parsed = parseParsePantherNodes([datasourceNodeRequestBody])
    expect(parsed).toHaveLength(1)

    const parsedDatasource = parsed[0] as Datasource

    // how many was parsed
    expect(parsedDatasource.labels).toHaveLength(2)
  })

})
