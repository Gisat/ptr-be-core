export const applicationNodeRequestBody: unknown = {
    key: "nextdemo",
    labels: ["application"],
    description: null,
    nameDisplay: "Panther Demo App",
    nameInternal: "panther-demo-app",
    configuration: {
        layerTree: [
            {
                key: "baseOSM",
                level: 0,
                isBasemap: true,
                category: "basemaps",
                onClickInteraction: null
            }
        ]
    }
}

export const datasourceNodeRequestBody: unknown = {
    key: "baseOSM",
    labels: ["datasource", "xyz"],
    nameDisplay: "Open Street Maps (OSM)",
    nameInternal: "osm",
    description: null,
    lastUpdatedAt: 123,
    configuration: {
        url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    }
}

export const styleNodeRequestBody: unknown = {
    key: "testStyle",
    labels: ["style"],
    nameDisplay: "Test Style Entity",
    nameInternal: "tstyle",
    description: null,
    specificName: "blue_color_style",
    configuration: {
        color: "green"
    }
}