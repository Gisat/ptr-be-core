import { nowTimestamp } from "@features/shared/coding/code.dates"
import { randomUUID } from "crypto"
import { Datasource, PantherEntity, UsedDatasourceLabels, UsedNodeLabels } from "@gisatcz/ptr-be-core/node"


/**
 * Fake database datasource node
 */
export const fakeDatabaseSource: Datasource = ({
  key: "testKey",
  labels: [UsedNodeLabels.Datasource, UsedDatasourceLabels.Attribute],
  lastUpdatedAt: nowTimestamp(),
  nameDisplay: "Some fancy name",
  nameInternal: "Formal name",
  description: "Something interesting about the entity",
  configuration: JSON.stringify({
    propertyName: "country",
    vectorKey: "geojson_1",
  })
})

/**
 * Fake online datasource node
 */
export const fakeOnlineSource: Datasource = ({
  key: "testKey",
  labels: [UsedNodeLabels.Datasource, UsedDatasourceLabels.WMS],
  lastUpdatedAt: nowTimestamp(),
  nameDisplay: "Some fancy name",
  nameInternal: "Formal name",
  description: "Something interesting about the entity",
  url: "http://www.something.abc",
  configuration: JSON.stringify({
    configuration: {
      limit: 1000
    }
  })
})

/**
 * Create fake node entity for testing
 * @param modificatorType What type of node we need
 * @param testKey Optional - set specific database key, or leave it random
 * @returns Simple node entity for database
 */
export const fakeSimpleNode = (modificatorType: any, testKey: string = randomUUID()): PantherEntity => ({
  key: testKey,
  lastUpdatedAt: nowTimestamp(),
  nameDisplay: "Some fancy name",
  nameInternal: "Formal name",
  description: "Something interesting about the entity",
  labels: modificatorType,
})